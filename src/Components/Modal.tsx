interface ModalProps {
    onRequestClose?: any,
    children?: React.ReactNode,
}

const Modal:React.FC<ModalProps> = ({ onRequestClose, children }) => {
    return (
        <div onClick={onRequestClose} className="rounded-3xl absolute top-0 left-0 h-full w-full flex items-center justify-center bg-black bg-opacity-90 z-30 backdrop-filter backdrop-blur-sm">
			<div className="bg-gray-900 bg-opacity-80 p-8 text-left overflow-hidden mx-8 rounded-xl shadow-2xl">
				{children}
			</div>
        </div>
    )
}

export default Modal;
