interface ButtonProps {
    text: string;
    onClick?: () => void;
    additionalClasses?: string;
}
export function Button(props: ButtonProps) {
    const buttonClass = `w-full md:w-fit py-[10px] md:py-[14px] px-[50px] bg-(--primary-100) text-white text-[14px] md:text-[16px] xl:text-[20px] rounded-md hover:bg-(--primary-200) transition-colors ${
        props.additionalClasses || ''
    }`;

    return (
        <button className={buttonClass} onClick={props.onClick}>
            {props.text}
        </button>
    );
}
