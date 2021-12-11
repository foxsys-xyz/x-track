import { ipcRenderer } from 'electron';
import { IconArrowDownRight, IconX } from '@tabler/icons';

function ActionBar() {

	const closeWindow = () => {
		ipcRenderer.send('closeApp');
	}

	const minimizeWindow = () => {
		ipcRenderer.send('minimizeApp');
	}

	return (
		<div className="z-40 w-full absolute top-0 flex items-center justify-end px-10 py-5 text-white drag">
			<div className="flex items-center gap-3 no-drag">
				<IconArrowDownRight onClick={minimizeWindow} className="w-5 hover:text-gray-300 transition duration-500 cursor-pointer" stroke={2} />
				<IconX onClick={closeWindow} className="w-5 hover:text-gray-300 transition duration-500 cursor-pointer" stroke={2} />
			</div>
		</div>
	);
}

export default ActionBar;
