import { FC } from "react";

type TabProps = {
	tabs: {
		label: string;
		index: number;
		Component: FC<{ index: number }>;
	}[];
	selectedTab: number;
	onClick: (index: number) => void;
	className?: string;
};

/**
 * Avalible Props
 * @param className string
 * @param tab Array of object
 * @param selectedTab number
 * @param onClick Function to set the active tab
 * @param orientation Tab orientation Vertical | Horizontal
 */
const Tab: FC<TabProps> = ({
	tabs = [],
	selectedTab = 0,
	onClick,
}) => {
	const Panel = tabs && tabs.find((tab) => tab.index === selectedTab);

	return (
		<>
			<div className="absolute left-10 flex items-center z-30 text-white">
				<div className="flex flex-col gap-2 p-4 bg-black bg-opacity-40 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-sm">
					<div role="tablist">
						{tabs.map((tab) => (
							<div className="relative z-30 flex items-center justify-center" key={tab.index}>
								<button
									className={'mt-1 transition duration-150 flex items-center justify-center p-4 rounded-2xl text-sm hover:bg-opacity-60 ' + (selectedTab === tab.index ? 'bg-gray-800' : 'hover:bg-gray-800')}
									onClick={() => onClick(tab.index)}
									type="button"
									role="tab"
									aria-selected={selectedTab === tab.index}
									aria-controls={`tabpanel-${tab.index}`}
									tabIndex={selectedTab === tab.index ? 0 : -1}
									id={`btn-${tab.index}`}
								>
									{tab.label}
								</button>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="absolute left-40 flex items-center z-30 text-white">
				<div className="w-[40rem] p-8 bg-black bg-opacity-40 rounded-3xl shadow-2xl backdrop-filter backdrop-blur-sm">
					{Panel && <Panel.Component index={selectedTab} />}
				</div>
			</div>
		</>
	);
};

export default Tab;
