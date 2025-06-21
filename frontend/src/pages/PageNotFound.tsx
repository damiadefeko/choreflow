import { Page } from '@/components/Page';

export function PageNotFound() {
    return (
        <Page>
            <main className='flex justify-center items-center'>
                <h1 className='text-[32px] md:text-[38px] xl:text-[64px] font-semibold'>404 Page Not Found</h1>
            </main>
        </Page>
    );
}
