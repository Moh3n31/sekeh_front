import { NavLink, useLocation } from "react-router";
import { menuItems } from "./navigationRoutes";
import LogoutDialog from "@/features/profile/components/LogoutDialog";
import useProfile from "@/features/profile/store/profileStore";

export default function Sidebar() {
	const location = useLocation();
	const { profile } = useProfile();

	return (
		<nav className="flex flex-col items-start gap-5 w-full h-full bg-background p-2">
			{menuItems.map(({ icon: Icon, path, label, admin }) => {
				const isThisPage = location.pathname.includes(path);
				if (!admin || profile?.role == "admin")
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
			<LogoutDialog />
		</nav>
	);
}
