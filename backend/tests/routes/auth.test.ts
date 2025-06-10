import request from 'supertest';
import { app, setupServer } from '../../src/utils/server';
import { User } from '../../src/models/user.model';
import mongoose from 'mongoose';
import { API_PREFIX } from '../../src/utils/constants';
import { FamilyMember } from '../../src/models/family-member.model';
import { Family } from '../../src/models/family.model';

describe('Authentication & Registration', () => {
    // Test Setup
    beforeAll(async () => {
        try {
            // Spy on console.error, console.log and mock its implementation to prevent actual logging
            jest.spyOn(console, 'error').mockImplementation();
            jest.spyOn(console, 'log').mockImplementation();

            await setupServer(true);
        } catch (error) {
            console.error('Error setting up test environment:', error);
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear collections before each test
        await User.deleteMany({});
        await FamilyMember.deleteMany({});
    });

    describe('Login', () => {
        beforeEach(async () => {
            // Test user
            const user = new User({ email: 'test@example.com' });
            await User.register(user, 'password123');
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post(`${API_PREFIX}/auth/login`)
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.user).toHaveProperty('email', 'test@example.com');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('isAdmin');
            expect(response.headers['set-cookie']).toBeDefined();
        });

        it('should fail with wrong password', async () => {
            const response = await request(app)
                .post(`${API_PREFIX}/auth/login`)
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('success', false);
        });

        it('should fail with wrong email', async () => {
            const response = await request(app)
                .post(`${API_PREFIX}/auth/login`)
                .send({
                    email: 'fake@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('Register', () => {
        it('should register a new user - not admin & no invite', async () => {
            const response = await request(app)
                .post(`${API_PREFIX}/auth/register`)
                .send({
                    email: 'newuser@example.com',
                    password: 'password123',
                    isAdmin: false,
                    inviteId: null
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
            expect(response.body.user).toHaveProperty('id');
            expect(response.headers['set-cookie']).toBeDefined();

            // Verify user was saved to database
            const user = await User.findOne({ email: 'newuser@example.com' });
            expect(user).toBeTruthy();

            const newFamilyMember = await FamilyMember.findOne({ user: user?._id });
            expect(newFamilyMember).toBeTruthy();
        });
        it('should register a new user - admin & create family', async () => {
            const response = await request(app)
                .post(`${API_PREFIX}/auth/register`)
                .send({
                    email: 'newuser@example.com',
                    password: 'password123',
                    isAdmin: true,
                    inviteId: null
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
            expect(response.body.user).toHaveProperty('id');
            expect(response.headers['set-cookie']).toBeDefined();

            // Verify user was saved to database
            const user = await User.findOne({ email: 'newuser@example.com' });
            expect(user).toBeTruthy();

            const newFamily = await Family.findOne({ admin: user?._id });
            expect(newFamily).toBeTruthy();
        });
        it('should register a new user - not admin & with invite', async () => {
            // First create an admin user
            await request(app)
                .post(`${API_PREFIX}/auth/register`)
                .send({
                    email: 'newuser@example.com',
                    password: 'password123',
                    isAdmin: true,
                    inviteId: null
                });

            const admin = await User.findOne({ email: 'newuser@example.com' });
            expect(admin).toBeTruthy();
            const newFamily = await Family.findOne({ admin: admin?._id });
            expect(newFamily).toBeTruthy();
            const inviteId = newFamily?.inviteId;
            expect(inviteId).toBeDefined();

            // Now register a new user with the invite ID
            const userResponse = await request(app)
                .post(`${API_PREFIX}/auth/register`)
                .send({
                    email: 'newuser2@example.com',
                    password: 'password123',
                    isAdmin: false,
                    inviteId: inviteId
                });

            expect(userResponse.status).toBe(201);
            const newUser = await User.findOne({ email: 'newuser2@example.com' })
            expect(newUser).toBeTruthy();
            // Verify the user was added to the family
            const family = await Family.findOne({ admin: admin?._id })
                .populate({
                    path: 'familyMembers',
                    populate: {
                        path: 'user'
                    }
                });

            const newFamilyMember = family?.familyMembers.find(member => member.user.email === newUser?.email);
            expect(newFamilyMember).toBeTruthy();
        });

        it('should fail when registering with existing email', async () => {
            // Create initial user
            const user = new User({ email: 'existing@example.com' });
            await User.register(user, 'password123');

            // Try to register with same email
            const response = await request(app)
                .post(`${API_PREFIX}/auth/register`)
                .send({
                    email: 'existing@example.com',
                    password: 'newpassword'
                });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('success', false);
        });

        it('should fail with empty credentials', async () => {
            const response = await request(app)
                .post(`${API_PREFIX}/auth/register`)
                .send({
                    email: '',
                    password: '12345'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('Logout', () => {

        beforeEach(async () => {
            // Test user
            const user = new User({ email: 'test@example.com' });
            await User.register(user, 'password123');
        });

        afterAll(async () => {
            await User.deleteMany({});
        });

        it('should logout the user', async () => {
            const loginResponse = await request(app)
                .post(`${API_PREFIX}/auth/login`)
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
            expect(loginResponse.status).toBe(200);
            expect(loginResponse.body).toHaveProperty('success', true);
            expect(loginResponse.headers['set-cookie']).toBeDefined();

            const responseLogout = await request(app)
                .post(`${API_PREFIX}/auth/logout`)
                .set('Cookie', loginResponse.headers['set-cookie']);
            expect(responseLogout.status).toBe(200);
            expect(responseLogout.body).toHaveProperty('success', true);
            expect(responseLogout.headers['set-cookie']).toBeDefined();
        });

        it('should fail with no active session', async () => {
            // Attempting to logout again should fail
            const logoutResponse = await request(app)
                .post(`${API_PREFIX}/auth/logout`);

            expect(logoutResponse.status).toBe(401);
            expect(logoutResponse.body).toEqual({
                success: false,
                message: 'No active session',
                code: 'NO_SESSION'
            });
        });
    });
});