import { IconSmartHome } from "@tabler/icons";
import { FC } from "react";
import { ipcRenderer } from 'electron';

type TabsProps = {
	data: ProfileDataTypes,
};

type ProfileDataTypes = {
    username: string,
    fname: string,
    lname: string,
    email: string,
    avatar: string,
    rwp: boolean,
    hub: string,
};

const Profile: FC<TabsProps> = (props) => {

	ipcRenderer.send('set-rpc-state', 'grabbing some coffee...');

	return (
		<>
			<h5 className="leading-3 font-medium inline-flex items-center">
				<IconSmartHome className="inline-block w-5 mr-3" stroke={2} />
				Dashboard
			</h5>
			<span className="text-gray-400 flex text-xs">map displays visual location of the airport</span>

			<p className="mt-6 text-xs">
				welcome, {props.data.fname}.
				you are logged in as {props.data.username}.
			</p>
		</>
	);
};

export default Profile;
