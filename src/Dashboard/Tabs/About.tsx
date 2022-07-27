import { IconInfoCircle } from "@tabler/icons";
import { FC } from "react";
import logo from '../../Assets/logo.svg';

const About: FC<{}> = () => {

	const Y = new Date().getFullYear();

	return (
		<div>
			<h5 className="leading-3 inline-flex items-center">
				<IconInfoCircle className="inline-block w-5 mr-3" stroke={2} />
				About
			</h5>
			<span className="text-gray-400 flex text-xs">this tracker is powered by x-crew, foxsys-xyz</span>

			<div className="flex items-center mt-6 gap-4">
				<img className="w-8" src={logo} />
				<p className="text-xs">
					foxsys-xyz, {Y}. all rights reserved. <br />
					made with love by your friends at <a href="https://foxsys.xyz" target="_blank" rel="noopener noreferrer">foxsys-xyz</a>. <br />
					app version: v{process.env.npm_package_version}
				</p>
			</div>
		</div>
	);
};

export default About;
