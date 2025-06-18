import { Page } from '../components/Page';
import heroImg from '../assets/images/hero.svg';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/userSlice';
import { API_BASE_URL } from '@/utils/constants';
import axios from 'axios';

export function Home() {
    const navigate = useNavigate();
    const userId = useAppSelector((state) => state.user.userId);
    const dispatch = useAppDispatch();

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
    return (
        <Page>
            <main className='flex px-[24px] md:px-[74px] xl:px-[88px] flex-col xl:flex-row items-center xl:justify-between h-full flex-grow gap-[48px]'>
                <div className='flex flex-col w-full xl:w-2/5 gap-[28px] items-center xl:items-start'>
                    <h1 className='text-[32px] md:text-[38px] xl:text-[64px] font-semibold leading-[130%] text-center xl:text-start'>
                        <span className='text-(--primary-100)'>Simplify</span> Chores.<br></br>
                        <span className='text-(--primary-100)'>Empower</span> Your Family.
                    </h1>
                    <p className='text-[16px] md:text-[20px] xl:text-[24px] leading-[150%] text-(--text-color-light) text-center xl:text-start'>
                        Easily assign and track household tasks so everyone knows what to do and when.
                    </p>
                    <Button size='large' text='Get Started' onClick={() => navigate('/dashboard')} />
                </div>
                <img src={heroImg} className='h-auto max-h-[320px] md:max-h-[420px] xl:max-h-[550px]' />
            </main>
        </Page>
    );
}
