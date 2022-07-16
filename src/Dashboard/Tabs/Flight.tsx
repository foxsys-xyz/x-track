import { IconInfoCircle, IconPlane, IconPlaneArrival, IconPlaneDeparture, IconPoint, IconSatellite } from "@tabler/icons";
import { FC, useEffect, useState } from "react";
import { ipcRenderer } from 'electron';
import PrimaryButton from "../../Components/Buttons/PrimaryButton";

type TabsProps = {
	data: FlightDataTypes,
};

type FlightDataTypes = {
	airline_icao: string,
	flightnum: string,
	departure: string,
	arrival: string,
	type: string,
	aircraft_icao: string,
};

const Flight: FC<TabsProps> = (props) => {

	ipcRenderer.send('set-rpc-state', 'briefing with dispatch...');
	
	const [flightProgress, setFlightProgress] = useState(0);

	useEffect(() => {

		const latd = 28.556160;
		const lond = 77.100281;

		const lata = 19.0904;
		const lona = 72.8628;

		const latc = 20.235567;
		const lonc = 74.685167;

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

		distance(latd, lond, lata, lona, latc, lonc);
		
		// if (Object.keys(props.data).length === 0) {
		// 	console.log('empty');
		// }

	}, []);

	return (
		<div>
			<h5 className="leading-3 font-medium inline-flex items-center">
				<IconPlane className="inline-block w-5 mr-3" stroke={2} />
				Flight Information
			</h5>
			<span className="text-gray-400 flex text-xs">your next flight information and acars functions</span>

			<div className="mt-6 flex flex-col">
				<div className="flex items-center">
					<IconPlaneDeparture className="inline-block w-5 mr-3 -mt-1" stroke={2} />
					VIDP
				</div>
				<span className="text-xs text-gray-400">Indira Gandhi International Airport</span>
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
			</div>

			<div className="mt-4 flex flex-col items-end">
				<div className="flex items-center">
					<IconPlaneArrival className="inline-block w-5 mr-3 -mt-1" stroke={2} />
					VABB
				</div>
				<span className="text-xs text-gray-400">Chatrapati Shivaji International Airport</span>
			</div>

			<div className="mt-4 flex items-center">
				<div className="w-auto">
					<PrimaryButton type="submit">
						end acars tracking
						<IconSatellite className="inline-block w-5 ml-2" stroke={2} />
					</PrimaryButton>
				</div>
			</div>

		</div>
	);
};

export default Flight;
