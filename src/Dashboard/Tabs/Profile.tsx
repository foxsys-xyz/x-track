import { IconSmartHome } from "@tabler/icons";
import { FC } from "react";

const Profile: FC<{}> = () => {
	return (
		<>
			<h5 className="leading-3 font-medium inline-flex items-center">
				<IconSmartHome className="inline-block w-5 mr-3" stroke={2} />
				Dashboard
			</h5>
			<span className="text-gray-400 flex text-xs">map displays visual location of the airport</span>

			<p className="mt-6 text-xs">
				welcome, Aaryan Kapoor.
				you are logged in as IGO1.
			</p>
		</>
	);
};

export default Profile;
