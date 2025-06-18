import { Page } from '@/components/Page';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFamily } from '@/store/slices/familySlice';
import { API_BASE_URL } from '@/utils/constants';
import axios from 'axios';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export function Dashboard() {
    const userId = useAppSelector((state) => state.user.userId);
    const familyId = useAppSelector((state) => state.family.familyId);
    const dispatch = useAppDispatch();

    // Redirect to login or show an error if user is not logged in
    if (!userId) {
        return <Navigate to='/login' replace />;
    }

    useEffect(() => {
        if (!familyId) {
            async function setUpInitialState() {
                try {
                    const { data: familyData } = await axios.get(`${API_BASE_URL}/family`, { withCredentials: true });
                    // Extract necessary data from the response and dispatch to store
                    const payload = {
                        familyId: familyData.family._id,
                        inviteId: familyData.family.inviteId,
                        members: familyData.family.familyMembers.map((member: any) => ({
                            email: member.user.email,
                            score: member.score,
                        })),
                    };
                    dispatch(setFamily(payload));
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
        <Page hideNavbar={true}>
            <main>{familyId ? <h1>Welcome to your family dashboard!</h1> : <h1>Loading family data...</h1>}</main>
        </Page>
    );
}
