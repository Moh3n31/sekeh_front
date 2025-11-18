import { Outlet } from "react-router";
import Navbar from "../layout/Navbar";

export default function Main() {
	return (
		<div className="h-screen bg-grey-100 flex flex-row-reverse">
			<Navbar />
			<div className="*:rounded-2xl w-full h-stretch m-3 mr-0">
				<Outlet />
			</div>
		</div>
	);
}
