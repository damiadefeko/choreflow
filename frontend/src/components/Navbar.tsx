import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';
export function Navbar() {
    const navLinkStyle = 'text-white hover:text-(--primary-300) font-medium text-[14px] md:text-[16px] xl:text-[20px]';
    return (
        <nav className='w-full flex justify-between px-[24px] md:px-[74px] xl:px-[88px] bg-(--primary-100) items-center'>
            <NavLink to='/'>
                <img src={logo} className='w-[100px] md:w-[120px]' />
            </NavLink>
            <div className='flex gap-6'>
                <NavLink
                    to='/login'
                    className={({ isActive }) => `${navLinkStyle} ${isActive ? '!text-(--primary-300)' : ''}`}>
                    Login
                </NavLink>
                <NavLink
                    to='/register'
                    className={({ isActive }) => `${navLinkStyle} ${isActive ? '!text-(--primary-300)' : ''}`}>
                    Register
                </NavLink>
            </div>
        </nav>
    );
}
