import { Page } from '@/components/Page';
import { Button } from '@/components/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/userSlice';
import { API_BASE_URL } from '@/utils/constants';

export function Register() {
    const [searchParams] = useSearchParams();
    const inviteId = searchParams.get('inviteId');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userId = useAppSelector((state) => state.user.userId);

    useEffect(() => {
        async function checkIsLoggedIn() {
            if (userId) {
                return true;
            }

            let hasActiveSession = false;

            try {
                const { data } = await axios.get(`${API_BASE_URL}/auth/session`, { withCredentials: true });

                if (data.user) {
                    hasActiveSession = true;
                    dispatch(
                        setUser({
                            userId: data.user.id,
                            email: data.user.email,
                            isAdmin: data.user.isAdmin,
                        })
                    );
                }
            } catch (error) {
                console.error(error);
            }

            if (hasActiveSession) {
                navigate('/dashboard');
            }
        }
        checkIsLoggedIn();
    }, []);

    async function handleFormSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (password !== password2) {
            alert('Passwords do not match');
            return;
        }

        try {
            setSubmissionStatus(true);
            const { data } = await axios.post(
                `${API_BASE_URL}/auth/register`,
                {
                    email,
                    password,
                    isAdmin,
                    inviteId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // Include cookies in the request
                }
            );

            dispatch(
                setUser({
                    userId: data.user.id,
                    email: data.user.email,
                    isAdmin: data.user.isAdmin,
                })
            );

            setSubmissionStatus(false);
            // Redirect to the dashboard after successful registration
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
            // @ts-ignore
            alert(error.response.data.message || error);
            setSubmissionStatus(false);
        }
    }

    return (
        <Page>
            <main className='flex px-[24px] md:px-[74px] xl:px-[88px] flex-col h-full flex-grow justify-center items-center'>
                <Card className='w-full max-w-sm py-8'>
                    <CardHeader>
                        <CardTitle className='text-center'>Get Started with your account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => handleFormSubmit(e)}>
                            <div className='flex flex-col gap-8'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                        id='email'
                                        type='email'
                                        placeholder='m@example.com'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='grid gap-2'>
                                    <div className='flex items-center'>
                                        <Label htmlFor='password'>Password</Label>
                                    </div>
                                    <Input
                                        id='password'
                                        type='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='grid gap-2'>
                                    <div className='flex items-center'>
                                        <Label htmlFor='password2'>Password Confirmation</Label>
                                    </div>
                                    <Input
                                        id='password2'
                                        type='password'
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                        required
                                    />
                                </div>
                                {!inviteId && (
                                    <div className='flex items-center gap-3'>
                                        <Checkbox
                                            id='isAdmin'
                                            checked={isAdmin}
                                            onCheckedChange={(checked) => setIsAdmin(!!checked)}
                                        />
                                        <Label htmlFor='isAdmin'>Register as an admin</Label>
                                    </div>
                                )}
                            </div>
                            <Button
                                size='default'
                                additionalClasses='mt-8 mb-6 !w-full'
                                disabled={submissionStatus}
                                text={submissionStatus ? 'Submitting...' : 'Register'}
                            />
                        </form>
                    </CardContent>
                    <CardFooter className='flex-col w-full items-center'>
                        <NavLink
                            to='/login'
                            className='text-center inline-block text-sm underline-offset-4 hover:underline'>
                            Already have an account? Log in
                        </NavLink>
                    </CardFooter>
                </Card>
            </main>
        </Page>
    );
}
