import { Outlet, useLocation, useNavigate } from "react-router";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import { useEffect } from "react";
import { checkTokens } from "../../utils/authTokens";
import { toast } from "../../services/toast";
import Title from "../components/shared/Title";

export default function Layout() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!checkTokens() && location.pathname !== "auth/login") {
			navigate("/auth/login");
			toast.error("لطفا وارد حساب کاربری خود شوید.");
		}
	}, [location.pathname, navigate]);

	return (
		<div className="h-screen w-screen bg-surface flex" id="main-container">
			<NavbarDesktop />
			<div className="grid grid-rows-[68px_calc(100vh-68px)] h-full w-full">
				<header className="bg-background h-full md:pe-5 max-md:px-3 flex items-center max-md:gap-7">
					<NavbarMobile />
					<Title mianColor="accent" subColor="primary-text" />
				</header>
				<main className="overflow-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
