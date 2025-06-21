import { Page } from '@/components/Page';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearFamily, setFamily } from '@/store/slices/familySlice';
import { API_BASE_URL } from '@/utils/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { SideNav } from './SideNav';
import { logout } from '@/utils/helper';
import { clearUser } from '@/store/slices/userSlice';
import { OverviewTab } from './Tabs/OverviewTab';
import { addChore } from '@/store/slices/choresSlice';
import { ChoresTab } from './Tabs/ChoresTab';

export type validTabNames = 'Dashboard' | 'Chores' | 'Family' | 'Logout';

export function Dashboard() {
    const userId = useAppSelector((state) => state.user.userId);
    const familyId = useAppSelector((state) => state.family.familyId);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<validTabNames>('Dashboard');
    const [isNavHidden, setIsNavHidden] = useState(false);

    // Redirect to login or show an error if user is not logged in
    if (!userId) {
        return <Navigate to='/login' replace />;
    }

    async function handleTabChange(tabName: validTabNames) {
        setActiveTab(tabName);
        if (tabName === 'Logout') {
            await logout();
            dispatch(clearUser());
            dispatch(clearFamily());
            navigate('/');
        }
    }

    function handleToggleNav() {
        setIsNavHidden((prevState) => !prevState);
    }

    useEffect(() => {
        if (!familyId) {
            // In this function all the initial data that is needed for the app is fetched and set
            async function setUpInitialState() {
                try {
                    const { data: familyData } = await axios.get(`${API_BASE_URL}/family`, { withCredentials: true });
                    // Extract necessary data from the response and dispatch to store
                    const familyPayload = {
                        familyId: familyData.family._id,
                        inviteId: familyData.family.inviteId,
                        members: familyData.family.familyMembers.map((member: any) => ({
                            id: member._id,
                            email: member.user.email,
                            score: member.score,
                        })),
                    };

                    const { data: choresData } = await axios.get(`${API_BASE_URL}/chores/${familyPayload.familyId}`, {
                        withCredentials: true,
                    });

                    dispatch(setFamily(familyPayload));

                    // @ts-ignore
                    choresData.data.chores.forEach((chore) => {
                        const payload = {
                            id: chore._id,
                            choreName: chore.choreName,
                            choreDescription: chore.choreDescription,
                            choreDeadline: chore.choreDeadline,
                            choreWeek: {
                                family: familyPayload,
                                weekStart: choresData.data.choreWeek.weekStart,
                                weekPrize: choresData.data.choreWeek.weekPrize,
                            },
                            chorePoints: chore.chorePoints,
                            choreStaus: chore.choreStaus,
                            assignees: familyPayload.members,
                        };
                        dispatch(addChore(payload as any));
                    });
                } catch (error) {
                    console.error(error);
                    // @ts-ignore
                    alert(error.response?.data?.message || 'An error occurred while fetching family data');
                }
            }
            setUpInitialState();
        }
    }, [familyId]);
    return (
        <Page hideNavbar={true} additionalStyles='!gap-0'>
            <main className='w-full h-full flex flex-grow py-[40px] px-6 gap-9'>
                {!isNavHidden && <SideNav activeTab={activeTab} onTabChange={handleTabChange} />}

                <div className='w-full p-[32px] tab-container flex flex-grow'>
                    {activeTab === 'Dashboard' && <OverviewTab onToggleNav={handleToggleNav} />}
                    {activeTab === 'Chores' && <ChoresTab onToggleNav={handleToggleNav} />}
                </div>
            </main>
        </Page>
    );
}
