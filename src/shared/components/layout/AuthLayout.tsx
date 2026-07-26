import { Outlet } from "react-router";
import Title from "@/shared/components/ui/MainTitle";

export default function AuthLayout() {
	return (
		<div className="bg-linear-300 from-accent-hover to-primary-green w-full h-dvh flex flex-row-reverse justify-end overflow-hidden p-7">
			<main className="bg-background w-140 rounded-lg">
				<Outlet />
			</main>
			<Title
				wrapperClassName="fixed flex-row-reverse bottom-7 end-7 max-[1030px]:hidden"
				subColor="background"
				mianColor="accent"
				iconClass="md:size-20"
			/>
		</div>
	);
}
