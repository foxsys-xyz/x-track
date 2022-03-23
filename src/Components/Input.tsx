interface InputProps {
    className?: string,
    name?: string,
    placeholder?: string,
    type?: string,
}

const Input:React.FC <InputProps> = ({className, name, placeholder, type}) => {
    return (
        <input
            className={"w-full outline-none border-none px-4 py-1.5 rounded-xl focus:ring bg-gray-800 bg-opacity-60 transition duration-150 " + className}
            name={name} 
            placeholder={placeholder} 
            type={type}
        />
    )
}

export default Input;
