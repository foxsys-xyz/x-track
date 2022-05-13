interface PrimaryButtonProps {
    className?: string,
    type?: "button" | "submit" | "reset",
    children?: React.ReactNode,
}

const PrimaryButton:React.FC<PrimaryButtonProps> = ({className, type, children}) => {
    return (
        <button id="button" type={type} className={"justify-center w-full lg:w-auto flex items-center focus:outline-none px-4 py-1.5 rounded-xl focus:shadow-outline bg-blue-600 hover:bg-blue-700 transition duration-150 " + className}>
            {children}
        </button>
    )
}

export default PrimaryButton;
