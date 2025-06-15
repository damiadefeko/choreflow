import { Navbar } from './Navbar';

interface PageProps {
    children: React.ReactNode;
}
export function Page(props: PageProps) {
    return (
        <div className='w-full h-full flex flex-col flex-grow text-(--text-color) gap-[64px]'>
            <Navbar />
            {props.children}
            <footer className='w-full flex justify-center items-center px-[24px] md:px-[74px] xl:px-[88px] py-[16px] mt-auto'>
                <p className='text-(--text-color) text-[10px] md:text-[14px]'>
                    Copyright © 2025 ChoreFlow - Final Year Project By Oluwadamilola Adefeko
                </p>
            </footer>
        </div>
    );
}
