//Types & data
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export default function MobileNavigation() {
	const triggerRef = useRef<HTMLInputElement | null>(null);
	const location = useLocation();

	useEffect(() => {
		if (triggerRef.current) triggerRef.current.checked = false;
	}, [location]);

	return (
		<div className="md:hidden">
			<input
				ref={triggerRef}
				type="checkbox"
				id="navbar-menu"
				className="peer hidden"
			/>
			<label htmlFor="navbar-menu">
				<Menu
					strokeWidth={1.5}
					className="text-white bg-accent p-1 size-7 rounded-full"
				/>
			</label>
			<section
				className="fixed w-1/2 h-dvh top-17 start-0
				translate-x-full peer-checked:translate-x-0 transition-all duration-150 z-20">
				<Sidebar />
			</section>
			<label
				htmlFor="navbar-menu"
				className="backdrop-blur-[2px] fixed w-full h-full top-17 start-0 z-19 hidden peer-checked:block"></label>
		</div>
	);
}
