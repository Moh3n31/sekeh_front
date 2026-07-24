import { Outlet, useLocation, useNavigate } from "react-router";
import NavbarDesktop from "@/shared/components/layout/DesktopNavigation";
import NavbarMobile from "@/shared/components/layout/MobileNavigation";
import { useEffect } from "react";
import { checkTokens } from "@/shared/lib/authTokens";
import { toast } from "@/shared/lib/toast";
import Title from "@/shared/components/ui/PageTitle";

export default function AppLayout() {
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
