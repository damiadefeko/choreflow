import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useAppSelector } from '@/store/hooks';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import prizeImage from '@/assets/images/prize-placholder.jpg';
import sideBarIcon from '@/assets/icons/sidebar.svg';

interface ChoreItem {
    name: string;
    dueDate: string;
    status?: string;
    onClick?(choreName: string): void;
}

export function ChoreItem(props: ChoreItem) {
    return (
        <div
            // @ts-ignore
            onClick={() => props.onClick(props.name)}
            className={`${props.onClick ? 'cursor-pointer' : ''} flex ${
                props.status ? 'flex-col items-end' : 'flex-row items-center'
            } ${props.status ? 'w-full md:w-[30%]' : 'w-full'} chore-item justify-between gap-4 px-[24px] py-[20px]`}>
            {!props.status && (
                <>
                    <span className='font-medium text-[14px] md:text-[16px] xl:text-[20px]'>{props.name}</span>
                    <span className='text-[12px] md:text-[14px] xl:text-[16px] text-[#ABABAB]'>
                        {new Date(props.dueDate).toISOString().split('T')[0]}
                    </span>
                </>
            )}
            {props.status && (
                <>
                    <div className='flex items-center w-full justify-between gap-6'>
                        <span className='font-medium text-[14px] md:text-[16px] xl:text-[20px'>{props.name}</span>
                        <span className='text-[12px] md:text-[14px] xl:text-[16px] text-[#ABABAB]'>
                            {new Date(props.dueDate).toISOString().split('T')[0]}
                        </span>
                    </div>
                    <span
                        className={`text-[10px] md:text-[12px] xl:text-[14px] font-medium ${
                            props.status === 'rejected' ? 'text-[#DC2626]' : 'text-(--primary-300)'
                        }`}>
                        {props.status}
                    </span>
                </>
            )}
        </div>
    );
}

export interface TabProps {
    onToggleNav: () => void;
}
export function OverviewTab(props: TabProps) {
    const chartData = useAppSelector((state) => state.family.members);
    const isAdmin = useAppSelector((state) => state.user.isAdmin);
    const chores = useAppSelector((state) => state.chores.chores);

    const chartConfig = {
        score: {
            label: 'Score',
            color: '#4eb6a9',
        },
    } satisfies ChartConfig;
    return (
        <div className='flex flex-col xl:flex-row gap-[32px] xl:gap-4 w-full justify-between'>
            <div className='flex flex-col w-full xl:w-[60%] gap-4 h-full'>
                <div className='flex gap-[10px]'>
                    <img src={sideBarIcon} onClick={props.onToggleNav} className='block lg:hidden' />
                    <h3 className='text-[16px] md:text-[20px] xl:text-[24px]'>Weekly Scoreboard 📈</h3>
                </div>
                {chartData.length > 0 && (
                    <ChartContainer config={chartConfig} className='min-h-[400px] xl:min-h-[50%] w-full'>
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <YAxis dataKey='score' />
                            <XAxis dataKey='email' tickLine={false} tickMargin={10} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey='score' fill='var(--primary-100)' radius={4} />
                        </BarChart>
                    </ChartContainer>
                )}
            </div>
            <div className='flex flex-col w-full justify-between items-center xl:items-end'>
                <Card className='w-full max-w-[350px]'>
                    <CardHeader>
                        <CardTitle className='text-center text-[20px]'>Prize of the week 🏅</CardTitle>
                        <CardDescription className='text-center'>Prize Name</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <img src={prizeImage} className='ml-auto mr-auto' />
                    </CardContent>
                </Card>
                {!isAdmin && chores.length > 0 && (
                    <div className='flex flex-col w-auto max-w-[350px] gap-2 mt-5'>
                        <h4 className='font-medium text-[20px] mb-2'>Due Chores 🔔</h4>
                        {chores
                            .map((chore, index) => {
                                return (
                                    <ChoreItem
                                        key={`${chore.choreName}-${index}`}
                                        name={chore.choreName}
                                        dueDate={chore.choreDeadline}
                                    />
                                );
                            })
                            .slice(3)}
                    </div>
                )}
            </div>
        </div>
    );
}
