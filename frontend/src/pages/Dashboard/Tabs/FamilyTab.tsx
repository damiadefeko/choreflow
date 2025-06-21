import { useAppSelector } from '@/store/hooks';
import sideBarIcon from '@/assets/icons/sidebar.svg';
import type { TabProps } from './OverviewTab';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getClientUrl } from '@/utils/helper';
import clipBoardIcon from '@/assets/icons/clipboard.svg';

interface FamilyItemProps {
    name: string;
    points: number;
}

function FamilyItem(props: FamilyItemProps) {
    return (
        <div className='w-full md:w-[30%] flex flex-col chore-item items-start px-[24px] py-[20px]'>
            <span className='font-medium text-[14px] md:text-[16px] xl:text-[20px'>{props.name}</span>
            <div className='flex justify-end w-full gap-6'>
                <span className='text-[10px] md:text-[12px] xl:text-[14px] font-medium'>
                    Points: <span className='text-(--primary-300)'>{props.points}</span>
                </span>
            </div>
        </div>
    );
}

export function FamilyTab(props: TabProps) {
    const isAdmin = useAppSelector((state) => state.user.isAdmin);
    const family = useAppSelector((state) => state.family);
    const inviteLink = `${getClientUrl()}/family/${family.familyId}/join?inviteId=${family.inviteId}`;

    function handleCopy() {
        navigator.clipboard.writeText(inviteLink);
    }
    return (
        <div className='flex flex-col gap-[32px] xl:gap-4 w-full'>
            <header className='flex flex-col md:flex-row xl:items-center justify-between gap-8'>
                <div className='flex gap-[10px]'>
                    <img src={sideBarIcon} onClick={props.onToggleNav} className='block lg:hidden' />
                    <h3 className='text-[16px] md:text-[20px] xl:text-[24px]'>Family Members 🏠 </h3>
                </div>
                {isAdmin && (
                    <div className='grid gap-2 w-full md:w-[30%]'>
                        <div className='flex items-center'>
                            <Label htmlFor='invite-link'>Invite link</Label>
                        </div>
                        <div className='flex justify-between gap-3'>
                            <Input id='invite-link' type='text' value={inviteLink} disabled required />
                            <button onClick={handleCopy} className='cursor-pointer'>
                                <img src={clipBoardIcon} />
                            </button>
                        </div>
                    </div>
                )}
            </header>
            <div className='flex items-start content-start gap-4 flex-wrap w-full'>
                {family.members.length === 0 && <p>No Family Members</p>}
                {family.members.length > 0 &&
                    family.members.map((member) => {
                        return <FamilyItem key={member.id} name={member.email} points={member.score} />;
                    })}
            </div>
        </div>
    );
}
