import { Outlet } from "react-router";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

export default function Layout() {
	return (
		<div className="h-screen w-screen bg-surface flex" id="main-container">
			<NavbarDesktop />
			<div className="grid grid-rows-[68px_calc(100vh-68px)] h-full w-full">
				<header className="bg-background h-full md:pr-5 max-md:px-3 flex items-center max-md:gap-7">
					<NavbarMobile />
					<div className="flex items-center justify-start gap-2">
						<span className="size-7 rounded-full border-5 border-accent-hover"></span>
						<p className="font-semibold text-4xl text-accent-hover -mt-1">Sekeh</p>
					</div>
				</header>
				<main className="overflow-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
