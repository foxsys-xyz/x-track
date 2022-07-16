import { useRef, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import axios from 'axios';
import { IconInfoCircle, IconPlane, IconPoint, IconSmartHome } from '@tabler/icons';
import mapboxgl from 'mapbox-gl';
import Tabs from '../Components/Tab';
import Profile from './Tabs/Profile';
import Flight from './Tabs/Flight';
import About from './Tabs/About';

type ProfileDataTypes = {
    username: string,
    fname: string,
    lname: string,
    email: string,
    avatar: string,
    rwp: boolean,
    hub: string,
};

type FlightDataTypes = {
    airline_icao: string,
    flightnum: string,
    departure: string,
    arrival: string,
    type: string,
    aircraft_icao: string,
};

type TabsType = {
    label: any,
    index: number,
    data: any,
    Component: React.FC<any>,
} [];

function Dashboard() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGlhYXJ5YW4iLCJhIjoiY2tzZTl0ajJjMGgydjJwbnVuMG5tOXMxbiJ9.r5-7_9QXjVfz4hcg-yYM4w';
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    let [profileData, setProfileData] = useState({} as ProfileDataTypes);
    let [flightData, setFlightData] = useState({} as FlightDataTypes);

    const [spinner, setSpinner] = useState(false);

    const loadData = async (token: string) => {
        await axios.get('http://api.foxsys.test/dashboard', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
        })
            .then(res => {
                setProfileData(res.data[0]);
                setFlightData(res.data[2]);
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
        // init();

        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current, // container ID
            style: 'mapbox://styles/hiaaryan/ckwatwod05wdw14mvtj34e8nk', // style URL
            center: [lng, lat], // starting position [lng, lat]
            zoom: zoom, // starting zoom
            attributionControl: false,
        });

        ipcRenderer.invoke('start-recording');

        let tlat: any;
        let tlng: any;
        let title: string;

        ipcRenderer.on('mainprocess-response', (event, arg) => {
            const objectConstructor = ({}).constructor;

            if (arg.constructor === objectConstructor) {
                const calcDegreeLat =
                    (arg.latitude) *
                    (90.0 / (10001750.0 * 65536.0 * 65536.0));

                const calcDegreeLng =
                    (arg.longitude) *
                    (360.0 / (65536.0 * 65536.0 * 65536.0 * 65536.0));

                tlat = calcDegreeLat;
                tlng = calcDegreeLng;

                return console.log('Latitude: ' + calcDegreeLat + ' Longitude: ' + calcDegreeLng);
            }

            console.log(arg);
        });
    }, []);

    const tabs: TabsType = [
        {
            label: <IconSmartHome className="inline-block w-6" stroke={2} />,
            index: 1,
            data: profileData,
            Component: Profile,
        },
        {
            label: <IconPlane className="inline-block w-6" stroke={2} />,
            index: 2,
            data: flightData,
            Component: Flight,
        },
        {
            label: <IconInfoCircle className="inline-block w-6" stroke={2} />,
            index: 3,
            data: null,
            Component: About,
        }
    ];

    const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);

    return (
        <div className="relative font-mono h-screen flex items-center justify-center bg-gray-500 overflow-hidden">
            {spinner && (
                <div className="absolute h-screen w-screen flex items-center justify-center bg-black z-40">
                    <IconPoint className="text-white w-5 animate-ping" stroke={2} />
                </div>
            )}

            <div className="h-screen w-screen flex items-center justify-center z-30">
                <div ref={mapContainer} className="h-full w-full"></div>
            </div>

            <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />

        </div>
    );
}

export default Dashboard;
