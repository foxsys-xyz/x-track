import { useRef, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../Assets/logo.svg';
import axios from 'axios';
import { IconInfoCircle, IconPlane, IconPoint, IconSmartHome } from '@tabler/icons';
import mapboxgl from 'mapbox-gl';
import Card from '../Components/Card';

export type DataTypes = {
    username: string,
    fname: string,
    lname: string,
    email: string,
}

function Dashboard() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGlhYXJ5YW4iLCJhIjoiY2tzZTl0ajJjMGgydjJwbnVuMG5tOXMxbiJ9.r5-7_9QXjVfz4hcg-yYM4w';
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);	

    let [data, setData] = useState({} as DataTypes);
    
    const [spinner, setSpinner] = useState(true);  

    const loadData = async (token: string) => {
        await axios.get('http://api.foxsys.test/dashboard', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
        })
        .then(res => {
            setData(res.data[0]);
            console.log(res);
            setSpinner(false);
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

    const init = async () => {
        const token = await ipcRenderer.invoke('get-token');
        loadData(token);
    }

    useEffect(() => {
        init();

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current, // container ID
            style: 'mapbox://styles/hiaaryan/ckwatwod05wdw14mvtj34e8nk', // style URL
            center: [lng, lat], // starting position [lng, lat]
            zoom: zoom, // starting zoom
            attributionControl: false,
        });

        ipcRenderer.send('set-rpc-state', 'in briefing room...');

        ipcRenderer.on('mainprocess-response', (event, arg) => {
            console.log('Got result: ', JSON.stringify(arg));
            console.log(arg.latitude);
            const lat = Number(arg.latitude);
            const lng = Number(arg.longitude);
        });
    }, []);

	return (
		<div className="relative font-mono h-screen flex items-center justify-center bg-black overflow-hidden">
            {spinner && (
                <div className="absolute h-screen w-screen flex items-center justify-center bg-black z-40">
                    <IconPoint className="text-white w-5 animate-ping" stroke={2} />
                </div>
            )}

            <div className="h-screen w-screen flex items-center justify-center z-30">
                <div ref={mapContainer} className="h-full w-full"></div>
            </div>

            <div className="absolute left-10 flex items-center z-30 text-white">
                <div className="flex flex-col gap-2 p-4 bg-black bg-opacity-40 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-sm">
                    <div className="relative z-30 flex items-center justify-center">
                        <a href="#" className="transition duration-150 flex items-center justify-center p-4 rounded-2xl text-sm hover:bg-gray-800 hover:bg-opacity-60">
                            <IconSmartHome className="inline-block w-6" stroke={2} />
                        </a>

                        {/* <div className="relative flex items-center">
                            <div className="whitespace-nowrap ml-8 bg-gray-900 bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-xl absolute z-50 px-4 py-2 text-sm text-white">
                                Dashboard
                            </div>
                        </div> */}
                    </div>

                    <div className="relative z-30 flex items-center justify-center">
                        <a href="#" className="transition duration-150 flex items-center justify-center p-4 rounded-2xl text-sm hover:bg-gray-800 hover:bg-opacity-60">
                            <IconPlane className="inline-block w-6" stroke={2} />
                        </a>

                        {/* <div className="relative flex items-center">
                            <div className="whitespace-nowrap ml-8 bg-gray-900 bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-xl absolute z-50 px-4 py-2 text-sm text-white">
                                Dashboard
                            </div>
                        </div> */}
                    </div>

                    <div className="relative z-30 flex items-center justify-center">
                        <a href="#" className="transition duration-150 flex items-center justify-center p-4 rounded-2xl text-sm hover:bg-gray-800 hover:bg-opacity-60">
                            <IconInfoCircle className="inline-block w-6" stroke={2} />
                        </a>

                        {/* <div className="relative flex items-center">
                            <div className="whitespace-nowrap ml-8 bg-gray-900 bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-xl absolute z-50 px-4 py-2 text-sm text-white">
                                Dashboard
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="absolute left-40 flex items-center z-30 text-white">
                <div className="w-[40rem] p-8 bg-black bg-opacity-40 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-sm">
                    <h5 className="leading-3 font-medium inline-flex items-center">
                        <IconSmartHome className="inline-block w-5 mr-3" stroke={2} />
                        Dashboard
                    </h5>
                    <span className="text-gray-400 flex text-xs">map displays visual location of the airport</span>

                    <p className="mt-6 text-xs">
                        welcome, {data.fname} {data.lname}.
                        you are logged in as {data.username}.
                    </p>
                </div>
            </div>
		</div>
	);
}

export default Dashboard;
