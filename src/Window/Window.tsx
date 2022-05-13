import { useState } from 'react';
import { ipcRenderer } from 'electron';
import Boot from '../Boot/Boot';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';

function Window() {
	const [state, setState] = useState('BOOT');

	switch (state) {
		case 'BOOT':
			setTimeout(() => {
				ipcRenderer.invoke('get-token').then((result) => {					
					if (result) {
						setState('DASHBOARD');
					} else {
						setState('LOGIN');
					}
				});
			}, 1500);

			return <Boot />;
		case 'LOGIN':
			return <Login />;
		case 'DASHBOARD':
			return <Dashboard />;
	}

	return (
		<div>
			app missed the state. please restart.
		</div>
	);
}

export default Window;
