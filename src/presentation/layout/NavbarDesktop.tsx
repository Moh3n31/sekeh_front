// Hooks
import { NavLink, useLocation } from "react-router";
//Components
import LogoutDialog from "../profile/LogoutDialog";
//Types & data
import { menuItems } from "./navbarRouts";

export default function NavbarDesktop() {
	const location = useLocation();

	return (
		<div className="px-2 pt-19 pb-10 w-45 flex flex-col justify-between h-full bg-background shrink-0 max-md:hidden">
			<nav className="flex flex-col items-start gap-5">
				{/* Navigation Items */}
				{menuItems.map(({ icon: Icon, path, label }) => {
					const isThisPage = location.pathname.includes(path);
					return (
						<NavLink
							to={`/${path}`}
							className={`cursor-pointer ${
								isThisPage ? "bg-accent" : "hover:bg-accent-soft"
							} px-3 py-1 rounded-lg transition-all duration-150 flex gap-7 items-center w-full`}
							key={`${path}-icon`}
							id={`${path}-icon`}>
							<Icon
								className={`size-5 ${
									isThisPage ? "text-background" : "text-primary-action"
								}`}
							/>
							<span
								className={`font-semibold ${
									isThisPage ? "text-background" : "text-primary-text"
								}`}>
								{label}
							</span>
						</NavLink>
					);
				})}
			</nav>

			<LogoutDialog />
		</div>
	);
}
