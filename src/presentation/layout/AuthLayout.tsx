import { Outlet } from "react-router";
import Title from "../components/shared/Title";

export default function AuthLayout() {
	return (
		<div className="bg-linear-30 from-accent-hover to-primary-green w-full h-screen flex justify-end overflow-hidden p-7">
			<Title
				wrapperClassName="fixed bottom-7 start-7 max-md:hidden"
				subColor="background"
				mianColor="accent"
			/>
			<main className="bg-background py-5 px-10 w-140 rounded-lg">
				<Outlet />
			</main>
		</div>
	);
}
