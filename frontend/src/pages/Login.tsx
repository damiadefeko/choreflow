import { Page } from '@/components/Page';
import { Button } from '@/components/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/utils/constants';
import axios from 'axios';
import { setUser } from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        try {
            setSubmissionStatus(true);
            const { data } = await axios.post(
                `${API_BASE_URL}/auth/login`,
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
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
            // @ts-ignore
            alert(error.response?.data?.message);
            setSubmissionStatus(false);
        }
    }
    return (
        <Page>
            <main className='flex px-[24px] md:px-[74px] xl:px-[88px] flex-col h-full flex-grow justify-center items-center'>
                <Card className='w-full max-w-sm py-8'>
                    <CardHeader>
                        <CardTitle className='text-center'>Welcome back</CardTitle>
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
                            </div>
                            <Button
                                size='default'
                                additionalClasses='mt-10 mb-6 !w-full'
                                text={submissionStatus ? 'Submitting...' : 'Login'}
                                disabled={submissionStatus}
                            />
                        </form>
                    </CardContent>
                    <CardFooter className='flex-col w-full items-center'>
                        <NavLink
                            to='/register'
                            className='text-center inline-block text-sm underline-offset-4 hover:underline'>
                            Don't have an account? Sign up
                        </NavLink>
                    </CardFooter>
                </Card>
            </main>
        </Page>
    );
}
