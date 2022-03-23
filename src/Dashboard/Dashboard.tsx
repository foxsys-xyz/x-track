import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../Assets/logo.svg';
import axios from 'axios';

export type DataTypes = {
    username: string,
    fname: string,
    lname: string,
    email: string,
}

function Dashboard() {
	ipcRenderer.send('set-rpc-state', 'in briefing room...');

    let token: string;
    
    const options = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
    };

    let [data, setData] = useState({} as DataTypes);

    useEffect(() => {
        const loadData = async () => {
            await axios.get('http://api.foxsys.test/user', options)
            .then(res => {
                setData(res.data);
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
        };
        loadData();
    }, []);

	return (
		<div className="font-mono h-screen flex items-center justify-center bg-black">
			<div className="text-white text-center">
				<img src={logo} className="h-28 flex mb-6 mx-auto" alt="logo" />
				<h3 className="text-3xl">
					Welcome {data ? data.fname : ''}.
				</h3>
				<span>{data ? data.email : ''}</span>
			</div>
		</div>
	);
}

export default Dashboard;
