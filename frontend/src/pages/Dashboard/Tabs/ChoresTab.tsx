import { Button } from '@/components/Button';
import { ChoreItem, type TabProps } from './OverviewTab';
import { useAppSelector } from '@/store/hooks';
import sideBarIcon from '@/assets/icons/sidebar.svg';
import { ChoreModal } from '@/components/ChoreModal';
import { useState } from 'react';

export function ChoresTab(props: TabProps) {
    const chores = useAppSelector((state) => state.chores.chores);
    const isAdmin = useAppSelector((state) => state.user.isAdmin);
    const [selectedChore, setSelectedChore] = useState(undefined);

    function showModal(choreName: string) {
        const foundChore = chores.find((chore) => chore.choreName === choreName);
        setSelectedChore(foundChore as any);
    }

    function closeModal() {
        setSelectedChore(undefined);
    }

    return (
        <>
            {selectedChore && <ChoreModal chore={selectedChore} isAdmin={isAdmin} onClose={closeModal} />}
            <div className='flex flex-col gap-[32px] xl:gap-4 w-full'>
                <header className='flex items-center justify-between'>
                    <div className='flex gap-[10px]'>
                        <img src={sideBarIcon} onClick={props.onToggleNav} className='block lg:hidden' />
                        <h3 className='text-[16px] md:text-[20px] xl:text-[24px]'>Chores 🧹 </h3>
                    </div>
                    {isAdmin && <Button text='New Chore' size='default' />}
                </header>
                <div className='flex items-start content-start gap-4 flex-wrap w-full'>
                    {chores.length === 0 && <p>No Chores</p>}
                    {chores.length > 0 &&
                        chores.map((chore, index) => {
                            return (
                                <ChoreItem
                                    key={`${chore.choreName}-${index}`}
                                    name={chore.choreName}
                                    dueDate={chore.choreDeadline}
                                    status={chore.choreStaus}
                                    onClick={showModal}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
}
