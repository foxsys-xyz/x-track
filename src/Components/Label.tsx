interface LabelProps {
    className?: string,
    name?: string,
    children?: React.ReactNode,
}

const Label:React.FC <LabelProps> = ({className, name, children}) => {
    return (
        <span className={"text-sm flex items-center " + className}>
           {children} {name}
        </span>
    )
}

export default Label;
