import type { validTabNames } from '../Dashboard';

interface TabItemProps {
    image: string;
    imageActive: string;
    name: string;
    isActive: boolean;
    onTabChange: (tabName: validTabNames) => void;
}

export function TabItem(props: TabItemProps) {
    return (
        <div
            onClick={() => props.onTabChange(props.name as any)}
            className={`cursor-pointer flex py-[12px] px-[16px] items-center gap-4 rounded-[6px] hover:bg-(--primary-light) hover:text-(--primary-300) ${
                props.isActive ? 'bg-(--primary-light) text-(--primary-300)' : ''
            }`}>
            <img className='w-[32px]' src={props.isActive ? props.imageActive : props.image} />
            <span className='text-[14px] xl:text-[16px]'>{props.name}</span>
        </div>
    );
}
