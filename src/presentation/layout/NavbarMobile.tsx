// Hooks
import { NavLink, useLocation } from "react-router";
// Components
import LogoutDialog from "../profile/LogoutDialog";
import MenuIcon from "../../assets/icons/MenuIcon";
//Types & data
import { menuItems } from "./navbarRouts";

export default function NavbarMobile() {
	const location = useLocation();

	return (
		<div className=" md:hidden">
			<input type="checkbox" id="navbar-menu" className="peer hidden" />
			<label htmlFor="navbar-menu">
				<MenuIcon className="[&>g>path]:stroke-white bg-accent p-1 size-7 rounded-full" />
			</label>
			<section className="fixed w-1/2 h-full top-17 left-0 animate-slide-in-left hidden peer-checked:block z-20">
				<nav className="flex flex-col items-start gap-5 w-full h-full bg-background p-2">
					{menuItems.map(({ icon: Icon, path, label }) => {
						const isThisPage = location.pathname.includes(path);
						return (
							<NavLink
								to={`/${path}`}
								className={`cursor-pointer ${
									isThisPage ? "bg-accent" : "hover:bg-accent-soft"
								} px-3 md:py-1 max-md:py-2 rounded-lg transition-all duration-150 flex gap-7 items-center w-full`}
								key={`${path}-icon`}
								id={`${path}-icon`}>
								<Icon
									className={`md:size-5 max-md:size-6 ${
										isThisPage
											? "[&>g>*]:stroke-background"
											: "[&>g>*]:stroke-primary-action"
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
					<LogoutDialog />
				</nav>
			</section>
			<label
				htmlFor="navbar-menu"
				className="backdrop-blur-[2px] fixed w-full h-full top-17 left-0 z-19 hidden peer-checked:block"></label>
		</div>
	);
}
