import { Outlet } from "react-router";
import Navbar from "../layout/Navbar";

export default function Main() {
	return (
		<div className="h-screen bg-gray-1 flex flex-row-reverse">
			<Navbar />
			<div className="*:rounded-2xl w-full h-stretch m-3">
				<Outlet />
			</div>
		</div>
	);
}
