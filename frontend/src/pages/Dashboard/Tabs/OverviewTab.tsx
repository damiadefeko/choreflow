import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useAppSelector } from '@/store/hooks';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export function OverviewTab() {
    const chartData = useAppSelector((state) => state.family.members);
    console.log('chartData', chartData);
    const chartConfig = {
        score: {
            label: 'Score',
            color: '#4eb6a9',
        },
    } satisfies ChartConfig;
    return (
        <div className='flex gap-4 w-full'>
            <div className='flex flex-col w-[70%] gap-4 flex-grow h-full'>
                <h3 className='text-[16px] md:text-[20px] xl:text-[24px]'>Weekly Scoreboard 📈</h3>
                {chartData.length > 0 && (
                    <ChartContainer config={chartConfig} className='min-h-[50%] w-full'>
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
        </div>
    );
}
