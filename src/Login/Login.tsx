import { ipcRenderer } from 'electron';
import { IconActivity, IconChartArcs, IconLockOpen } from "@tabler/icons";
import logo from '../Assets/logo.svg';
import valogo from '../Assets/valogo.png';
import background from '../Assets/background.mp4';

function Login() {

	const Y = new Date().getFullYear();
	const pjson = require('../../package.json');

	ipcRenderer.send('appLogin');

	return (
		<div className="bg-black">
			<video autoPlay muted loop className="fixed z-10 w-auto min-w-full min-h-full max-w-none overflow-hidden">
				<source src={background} type="video/mp4" />
			</video>

			<div className="z-10 relative h-screen text-white backdrop-filter backdrop-blur-md">
				<div className="hidden lg:flex items-center absolute bottom-0 left-0 px-10 py-5 text-xs">
					<img className="w-4 mr-3" src={logo} />
					<span className="text-xs">foxsys-xyz, {Y}. all rights reserved.</span>
				</div>

				<div className="hidden lg:flex items-center absolute bottom-0 right-0 px-10 py-5 text-xs">
					<IconActivity className="w-4 mr-3 text-yellow-400" stroke={2} />
					<span className="text-xs">x-track {pjson.version}.</span>
				</div>

				<div className="w-screen h-screen mx-auto flex justify-center items-center">
					<div className="m-4 p-8 w-full lg:w-1/2 bg-gray-900 bg-opacity-80 rounded-3xl shadow-2xl">
						<img className="h-5" src={valogo} />
						<div className="lg:flex items-center mt-4 mb-12">
							<IconChartArcs className="inline-block w-6 mr-3" stroke={2} />
							ACARS Data Center
						</div>
						<div className="mt-4">
							<div className="w-full">
								<button className="text-sm justify-center lg:text-base w-full flex items-center focus:outline-none px-4 py-2 rounded-full focus:shadow-outline bg-blue-600 hover:bg-blue-700 transition duration-500" placeholder="username">
									sign in with x-crew
									<IconLockOpen className="inline-block w-6 ml-3" stroke={2} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
