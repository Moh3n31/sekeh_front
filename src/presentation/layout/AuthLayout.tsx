import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<div className="bg-linear-30 from-accent-hover to-primary-green w-full h-screen flex justify-end overflow-hidden p-7">
			<div className="fixed bottom-7 left-7 flex items-center justify-start gap-2">
				<span className="size-7 shrink-0 rounded-full border-5 border-white mt-1"></span>
				<p className="font-semibold text-4xl text-white">Sekeh</p>
			</div>
			<main className="bg-background py-5 px-10 w-140 rounded-lg">
				<Outlet />
			</main>
		</div>
	);
}
