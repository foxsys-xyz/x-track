import { IconArrowsExchange, IconClock, IconExternalLink, IconInfoCircle, IconLink, IconPlane, IconPlaneArrival, IconPlaneDeparture, IconPoint, IconSatellite } from "@tabler/icons";
import { FC, useEffect, useState } from "react";
import { ipcRenderer } from 'electron';
import PrimaryButton from "../../Components/Buttons/PrimaryButton";

type TabsProps = {
	data: {
		booking: BookingDataTypes,
		flight: FlightDataTypes, 
		departure: DepAirportTypes, 
		arrival: ArrAirportTypes,
	}
};

type BookingDataTypes = {
	active: boolean,
	departure_at: any,
	duration: any,
	arrival_at: any,
};

type FlightDataTypes = {
	airline_icao: string,
	flightnum: string,
	departure: string,
	arrival: string,
	type: string,
	aircraft_icao: string,
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

const Flight: FC<TabsProps> = (props) => {

	ipcRenderer.send('set-rpc-state', 'briefing with dispatch...');
	
	const [flightProgress, setFlightProgress] = useState(0);

	console.log(props.data);

	function distance(latd: number, lond: number, lata: number, lona: number, latc: number, lonc: number) {
		const p = Math.PI/180;
		const c = Math.cos;
		const a = 0.5 - c((lata - latd) * p)/2 + 
				c(latd * p) * c(lata * p) * 
				(1 - c((lona - lond) * p))/2;
		
		const b = 0.5 - c((lata - latc) * p)/2 + 
				c(latc * p) * c(lata * p) * 
				(1 - c((lona - lonc) * p))/2;
		
		const totalkm = 12742 * Math.asin(Math.sqrt(a));
		const totalnm = totalkm * 0.539957;

		const remainingkm = 12742 * Math.asin(Math.sqrt(b));
		const remainingnm = remainingkm * 0.539957;

		const progress = Math.max(((totalnm - remainingnm) / totalnm) * 100, 0);

		setFlightProgress(progress);
	}

	function startACARS() {
		ipcRenderer.invoke('init-acars-tracking');

		const latd = props.data.departure.lat;
		const lond = props.data.departure.lng;

		const lata = props.data.arrival.lat;
		const lona = props.data.arrival.lng;

		const latc = props.data.departure.lat;
		const lonc = props.data.departure.lng;
	
		distance(latd, lond, lata, lona, latc, lonc);
	}

	function openCFCDC() {
		require("electron").shell.openExternal('http://cloud.foxsys.test/cfcdc');
	}

	return (
		<div>
			{(() => {
				if (props.data && !!props.data.booking.active) {
					return (
						<div>
							<h5 className="leading-3 inline-flex items-center">
								<IconPlane className="inline-block w-5 mr-3" stroke={2} />
								Flight Information
							</h5>
							<span className="text-gray-400 flex text-xs">your next flight information and acars functions</span>

							<div className="mt-6 flex flex-col">
								<div className="flex items-center">
									<IconPlaneDeparture className="inline-block w-5 mr-3 -mt-1" stroke={2} />
									{props.data.departure.icao} (<div className="text-xs text-gray-400">{props.data.departure.iata}</div>)
								</div>
								<span className="text-xs text-gray-400">{props.data.departure.airport_name}</span>
							</div>	

							<div className="mt-4 flex text-lg items-center">
								<div className="flex relative flex-row w-full h-[0.125rem]">
									<div className="absolute inset-x-0 border-b-2 border-dashed border-gray-600" />

									<div className="relative w-full bg-white rounded-full" style={{ width: `${flightProgress}%` }}>
										{!!flightProgress && (
											<IconPlane className="absolute right-0 w-5 -mt-[0.68rem]" fill="#ffffff" stroke={0.5} />
										)}
									</div>
								</div>

								<div className="absolute left-8 border-l-2 mb-3 ml-3 border-dashed h-3 border-gray-600"/>
								<div className="absolute right-8 border-l-2 mt-3 mr-3 border-dashed h-3 border-gray-600"/>
							</div>

							<div className="mt-4 flex flex-col items-end">
								<div className="flex items-center">
									<IconPlaneArrival className="inline-block w-5 mr-3 -mt-1" stroke={2} />
									{props.data.arrival.icao}  (<div className="text-xs text-gray-400">{props.data.arrival.iata}</div>)
								</div>
								<span className="text-xs text-gray-400">{props.data.arrival.airport_name}</span>
							</div>

							<div className="mt-12 flex items-center text-xs">
								<div className="flex justify-between w-full">
									<div className="flex flex-col">
										<p className="text-green-500">Scheduled Departure: {props.data.booking.departure_at}z</p>
										<p>Actual Departure: --:--z</p>
									</div>
									<div className="flex flex-col text-right">
										<p className="text-green-500">Scheduled Arrival: {props.data.booking.arrival_at}z</p>
										<p>Actual Arrival: --:--z</p>
									</div>
								</div>
							</div>

							<div className="mt-6 w-full">
								<PrimaryButton className="w-full" onClick={startACARS}>
									start acars link
									<IconArrowsExchange className="inline-block w-5 ml-2" stroke={2} />
								</PrimaryButton>
							</div>
						</div>
					)
				} else {
					return (
						<div>
							<h5 className="leading-3 inline-flex items-center">
								<IconPlane className="inline-block w-5 mr-3" stroke={2} />
								Flight Information
							</h5>
							<span className="text-gray-400 flex text-xs">your next flight information and acars functions</span>

							<a onClick={openCFCDC} rel="noopener noreferrer" className="mt-6 w-full flex flex-col items-center px-4 py-4 bg-gray-800 bg-opacity-60 rounded-xl cursor-pointer text-xs">
								<IconExternalLink className="inline-block w-8" stroke={2} />
								<span className="mt-1 leading-normal">click to open CFCDC</span>
								<span className="mt-6 text-center text-gray-400">either no flight is booked or briefing is not generated through CFCDC, please make sure this is done before starting ACARS link</span>
							</a>
						</div>
					)
				}
			}) ()}
		</div>
	);
};

export default Flight;
