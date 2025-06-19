import logo from '@/assets/images/logo-transparent-no-text.png';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector } from '@/store/hooks';
import dashboardIcon from '@/assets/icons/dashboard.svg';
import dashboardActiveIcon from '@/assets/icons/dashboard-active.svg';
import taskIcon from '@/assets/icons/task.svg';
import taskActiveIcon from '@/assets/icons/task-active.svg';
import familyIcon from '@/assets/icons/family.svg';
import familyActiveIcon from '@/assets/icons/family-active.svg';
import logoutIcon from '@/assets/icons/logout.svg';
import logoutActiveIcon from '@/assets/icons/logout-active.svg';
import { TabItem } from './Tabs/TabItem';
import type { validTabNames } from './Dashboard';

interface SideNavProps {
    activeTab: string;
    onTabChange: (tabName: validTabNames) => void;
}
export function SideNav(props: SideNavProps) {
    const userEmail = useAppSelector((state) => state.user.email);
    return (
        <div className='flex flex-col flex-grow w-[80%] md:w-[20%] h-full py-[12px] px-[16px] gap-[24px] side-nav'>
            <div className='flex items-center gap-[10px]'>
                <img src={logo} className='w-[60px]' />
                <span className='text-[14px] font-semibold'>Choreflow</span>
            </div>
            <div className='flex items-center gap-[16px] px-[16px] pt-[20px] pb-[12px] border-b-1 border-b-[#E2E8F0] overflow-hidden text-ellipsis whitespace-nowrap'>
                <Avatar className='w-[50px] h-[50px]'>
                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                </Avatar>
                <span className='text-[16px]'>{userEmail}</span>
            </div>
            <nav className='flex flex-col w-full gap-3'>
                <TabItem
                    onTabChange={props.onTabChange}
                    name='Dashboard'
                    image={dashboardIcon}
                    imageActive={dashboardActiveIcon}
                    isActive={props.activeTab === 'Dashboard'}
                />
                <TabItem
                    onTabChange={props.onTabChange}
                    name='Chores'
                    image={taskIcon}
                    imageActive={taskActiveIcon}
                    isActive={props.activeTab === 'Chores'}
                />
                <TabItem
                    onTabChange={props.onTabChange}
                    name='Family'
                    image={familyIcon}
                    imageActive={familyActiveIcon}
                    isActive={props.activeTab === 'Family'}
                />
                <TabItem
                    onTabChange={props.onTabChange}
                    name='Logout'
                    image={logoutIcon}
                    imageActive={logoutActiveIcon}
                    isActive={false}
                />
            </nav>
        </div>
    );
}
