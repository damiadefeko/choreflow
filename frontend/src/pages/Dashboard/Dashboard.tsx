import { Page } from '@/components/Page';
import { useAppSelector } from '@/store/hooks';
import { Navigate } from 'react-router-dom';

export function Dashboard() {
    const userId = useAppSelector((state) => state.user.userId);
    // Redirect to login or show an error if user is not logged in
    if (!userId) {
        return <Navigate to='/login' replace />;
    }
    return (
        <Page hideNavbar={true}>
            <main>
                <h1>Dashboard</h1>
            </main>
        </Page>
    );
}
