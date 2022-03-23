import { ipcRenderer } from 'electron';
import { IconArrowDownRight, IconTrash, IconX } from '@tabler/icons';
import axios from 'axios';

function ActionBar() {

	const closeWindow = () => {
		ipcRenderer.send('closeApp');
	}

	const minimizeWindow = () => {
		ipcRenderer.send('minimizeApp');
	}

	const deleteToken = async () => {
		let token: string;

		await ipcRenderer.invoke('get-token').then((result) => {
			token = result;
		});

		const req = axios.post('http://api.foxsys.test/logout', null, {
			headers: {
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then(() => {
			console.log('Logged Out!');
			ipcRenderer.send('delete-token');
		})
		.catch(function (error) {
			if (error.response) {
				// Request made and server responded
				console.log(error.response.data);
				console.log(error.response.status);
			} else if (error.request) {
				// The request was made but no response was received
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error', error.message);
			};
		});
	}

	return (
		<div className="z-40 w-full absolute top-0 flex items-center justify-end px-10 py-5 text-white drag">
			<div className="flex items-center gap-3 no-drag">
				<IconTrash onClick={deleteToken} className="w-4 hover:text-gray-300 transition duration-500 cursor-pointer" stroke={2} />
				<IconArrowDownRight onClick={minimizeWindow} className="w-5 hover:text-gray-300 transition duration-500 cursor-pointer" stroke={2} />
				<IconX onClick={closeWindow} className="w-5 hover:text-gray-300 transition duration-500 cursor-pointer" stroke={2} />
			</div>
		</div>
	);
}

export default ActionBar;
