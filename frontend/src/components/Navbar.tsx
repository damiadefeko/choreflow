import logo from '../assets/images/logo.png';
export function Navbar() {
    const navLinkStyle = 'text-white font-medium text-[14px] md:text-[16px] xl:text-[20px]';
    return (
        <nav className='w-full flex justify-between px-[24px] md:px-[74px] xl:px-[88px] bg-(--primary-100) items-center'>
            <img src={logo} className='w-[100px] md:w-[120px]' />
            <div className='flex gap-6'>
                <a href='#' className={navLinkStyle}>
                    Login
                </a>
                <a href='#' className={navLinkStyle}>
                    Register
                </a>
            </div>
        </nav>
    );
}
