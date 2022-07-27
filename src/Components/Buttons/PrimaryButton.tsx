interface PrimaryButtonProps {
    className?: string,
    type?: "button" | "submit" | "reset",
    onClick?: any,
    children?: React.ReactNode,
}

const PrimaryButton:React.FC<PrimaryButtonProps> = ({className, type, children, onClick}) => {
    return (
        <button id="button" type={type} onClick={onClick} className={"justify-center flex items-center focus:outline-none px-4 py-1.5 rounded-xl focus:shadow-outline bg-blue-600 hover:bg-blue-700 transition duration-150 " + className}>
            {children}
        </button>
    )
}

export default PrimaryButton;
