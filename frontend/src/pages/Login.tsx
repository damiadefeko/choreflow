import { Page } from '@/components/Page';
import { Button } from '@/components/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NavLink } from 'react-router-dom';

export function Login() {
    return (
        <Page>
            <main className='flex px-[24px] md:px-[74px] xl:px-[88px] flex-col h-full flex-grow justify-center items-center'>
                <Card className='w-full max-w-sm py-8'>
                    <CardHeader>
                        <CardTitle className='text-center'>Welcome back</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className='flex flex-col gap-8'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input id='email' type='email' placeholder='m@example.com' required />
                                </div>
                                <div className='grid gap-2'>
                                    <div className='flex items-center'>
                                        <Label htmlFor='password'>Password</Label>
                                    </div>
                                    <Input id='password' type='password' required />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className='flex-col w-full items-center'>
                        <Button size='default' additionalClasses='mt-6 mb-8 !w-full' text='Login' />
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
