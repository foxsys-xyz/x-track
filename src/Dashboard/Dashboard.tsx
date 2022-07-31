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

type BookingDataTypes = {
	active: boolean,
	departure_at: any,
	duration: any,
	arrival_at: any,
};

type DepAirportTypes = {
    icao: string,
    iata: string,
    airport_name: string,
    city_name: string,
    country: string,
    continent: string,
    elevation: number,
    lat: number,
    lng: number,
    hub: boolean,
};

type ArrAirportTypes = {
    icao: string,
    iata: string,
    airport_name: string,
    city_name: string,
    country: string,
    continent: string,
    elevation: number,
    lat: number,
    lng: number,
    hub: boolean,
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
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);
    const [zoom, setZoom] = useState(2.5);

    let [profileData, setProfileData] = useState({} as ProfileDataTypes);
    let [flightData, setFlightData] = useState({} as FlightDataTypes);
    let [depAirportData, setDepAirportData] = useState({} as DepAirportTypes);
    let [arrAirportData, setArrAirportData] = useState({} as ArrAirportTypes);
    let [bookingData, setBookingData] = useState({} as BookingDataTypes);

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
            setProfileData(res.data[0]);
            setBookingData(res.data[1]);
            setFlightData(res.data[2]);
            setDepAirportData(res.data[3]);
            setArrAirportData(res.data[4]);
            setSpinner(false);
            setMap(res.data[3].lng, res.data[3].lat);
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
        await loadData(token);
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
    }, []);

    const setMap = async (lng: any, lat: any) => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('load', () => {
            map.current.flyTo({
                center: [lng, lat],
                zoom: 12.5,
                offset: [325, 0],
            });
        });
    }

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
            data: {
                booking: bookingData,
                flight: flightData, 
                departure: depAirportData,
                arrival: arrAirportData,
            },
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
