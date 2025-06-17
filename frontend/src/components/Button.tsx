interface ButtonProps {
    text: string;
    onClick?: () => void;
    additionalClasses?: string;
    size: 'default' | 'large';
    disabled?: boolean;
}
export function Button(props: ButtonProps) {
    const sizeClass = props.size === 'large' ? 'py-[10px] md:py-[14px] px-[50px]' : 'py-[8px] md:py-[10px] px-[38px]';
    const buttonClass = `cursor-pointer w-full md:w-fit ${sizeClass} bg-(--primary-100) text-white text-[14px] md:text-[16px] xl:text-[20px] rounded-md hover:bg-(--primary-200) transition-colors ${
        props.additionalClasses || ''
    }`;

    return (
        <button className={buttonClass} onClick={props.onClick} disabled={props.disabled}>
            {props.text}
        </button>
    );
}
