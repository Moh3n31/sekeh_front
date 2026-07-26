//Types & data
import Sidebar from "./Sidebar";

export default function DesktopNavigation() {
	return (
		<div className="pt-17 pb-8 w-45 flex flex-col justify-between h-full bg-background shrink-0 max-md:hidden">
			<Sidebar />
		</div>
	);
}
