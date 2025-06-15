import { Page } from '../components/Page';
import heroImg from '../assets/images/hero.svg';
import { Button } from '../components/Button';

export function Home() {
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
                    <Button text='Get Started' />
                </div>
                <img src={heroImg} className='h-auto max-h-[320px] md:max-h-[420px] xl:max-h-[550px]' />
            </main>
        </Page>
    );
}
