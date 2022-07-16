import { ipcRenderer } from 'electron';
import { IconAccessPoint, IconActivity, IconArrowDownRight, IconLockOpen, IconPlane, IconPoint } from "@tabler/icons";
import logo from '../Assets/logo.svg';
import valogo from '../Assets/valogo.png';
import background from '../Assets/background.mp4';
import Card from '../Components/Card';
import Label from '../Components/Label';
import Input from '../Components/Input';
import PrimaryButton from '../Components/Buttons/PrimaryButton';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

function Login() {

	const navigate = useNavigate();

	const Y = new Date().getFullYear();

	ipcRenderer.send('set-rpc-state', 'authenticating...');

	const [fetchAnim, setFetchAnim] = useState(false);

	return (
		<div className="bg-black">
			<video autoPlay muted loop className="fixed z-10 w-auto min-w-full min-h-full max-w-none overflow-hidden">
				<source src={background} type="video/mp4" />
			</video>

			<div className="z-10 relative h-screen text-white bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm">
				<div className="flex items-center absolute bottom-0 left-0 px-10 py-5 text-xs">
					<img className="w-4 mr-3" src={logo} />
					<span className="text-xs">foxsys-xyz, {Y}. all rights reserved.</span>
				</div>

				<div className="flex items-center absolute bottom-0 right-0 px-10 py-5 text-xs">
					<IconActivity className="w-4 mr-3 text-yellow-400" stroke={2} />
					<span className="text-xs">x-track v{process.env.npm_package_version}.</span>
				</div>

				<div className="w-screen h-screen mx-auto flex justify-center items-center">
					<Card className="relative w-2/3">
						<div className={(fetchAnim ? 'flex' : 'hidden') + " absolute h-full w-full -m-8 items-center justify-center"}>
							<IconPoint className="text-white w-5 animate-ping" stroke={2} />
						</div>
						<div className={(fetchAnim ? 'invisible' : 'visible')}>
							<img className="h-5" src={valogo} />
							<div className="flex items-center mt-4">
								<IconPlane className="inline-block w-6 mr-3" stroke={2} />
								airline operations
							</div>
							
							<form onSubmit={(e: React.SyntheticEvent) => {
									e.preventDefault();
									setFetchAnim(true);

									const target = e.target as typeof e.target & {
										username: { value: string };
										password: { value: string };
									};

									const data = {
										username: target.username.value,
										password: target.password.value
									};
									
									const options = {
										headers: {
											'Accept': 'application/json',
										},
										withCredentials: true,
									};

									axios.get('http://api.foxsys.test/sanctum/csrf-cookie', options).then(() => {
										axios.post('http://api.foxsys.test/login', data, options)
										.then(res => {
											setFetchAnim(false);
											ipcRenderer.send('set-token', res.data.token);
											navigate('/dashboard');
										})
										.catch(function (error) {
											if (error.response) {
												setFetchAnim(false);
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
									});
								}}>
								<div className="mt-8 flex w-full gap-2">
									<div className="w-full {{ $errors->has('username') ? 'text-red-500' : '' }}">
										<Label name="username">
											<IconArrowDownRight className="inline-block w-4 mr-2" stroke={2} />
										</Label>
										<Input name="username" className="mt-2 focus:ring-blue-500" placeholder="IGO1234" />
									</div>
									
									<div className="w-full {{ $errors->has('password') ? 'text-red-500' : '' }}">
										<Label name="password">
											<IconArrowDownRight className="inline-block w-4 mr-2" stroke={2} />
										</Label>
										<Input name="password" className="mt-2 focus:ring-blue-500" type="password" placeholder="••••••••••" />
									</div>
								</div>

								<div className="mt-8 flex items-center text-sm">
									<IconAccessPoint className="inline-block w-4 mr-2" stroke={2} />
									you'll be logged in through x-crew.
								</div>

								<div className="mt-4 flex items-center">
									<div className="w-auto">
										<PrimaryButton type="submit">
											sign in
											<IconLockOpen className="inline-block w-5 ml-2" stroke={2} />
										</PrimaryButton>
									</div>
								</div>
							</form>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default Login;
