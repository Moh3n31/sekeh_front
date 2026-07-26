import { Outlet, useLocation, useNavigate } from "react-router";
import NavbarDesktop from "@/shared/components/layout/DesktopNavigation";
import NavbarMobile from "@/shared/components/layout/MobileNavigation";
import { useEffect } from "react";
import { checkTokens, removeTokens } from "@/shared/lib/authTokens";
import { toast } from "@/shared/lib/toast";
import Title from "@/shared/components/ui/MainTitle";

export default function AppLayout() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!checkTokens() && location.pathname !== "auth/login") {
			window.dispatchEvent(new Event("unauthorized"));
		}
	}, [location.pathname, navigate]);

	useEffect(() => {
		const handler = () => {
			removeTokens();
			toast.error("لطفا وارد حساب کاربری خود شوید.");
			navigate("/auth/login");
		};

		window.addEventListener("unauthorized", handler);

		return () => window.removeEventListener("unauthorized", handler);
	}, [navigate]);

	return (
		<div className="h-dvh w-screen bg-surface flex" id="main-container">
			<NavbarDesktop />
			<div className="flex flex-col h-dvh w-full">
				<header className="bg-background md:pe-5 max-md:px-3 flex h-(--navbar-height) shrink-0 items-center max-md:gap-7">
					<NavbarMobile />
					<Title mianColor="accent" subColor="primary-text" />
				</header>
				<main className="h-(--full-outlet-height) overflow-x-hidden overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
