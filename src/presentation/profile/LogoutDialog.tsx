import { useNavigate } from "react-router";
import Dialog from "../components/shared/Dialog";
import LogoutIcon from "../../assets/icons/LogoutIcon";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { authAPI } from "../../services/authentication";
import type { Exceptions } from "../../services/api";
import LoadingIcon from "../../assets/icons/LoadingIcon";

export default function LogoutDialog() {
	const { mutate, isPending } = useCustomMutation(authAPI.logout);
	const navigate = useNavigate();

	function handleLogout() {
		mutate({
			onSuccess: () => {
				navigate("auth/login");
			},
			onError: (err: Exceptions) => alert(err.error),
		});
	}

	return (
		<Dialog
			triggerClass="w-full"
			trigger={
				<div
					className="group cursor-pointer py-1 px-3 rounded-lg flex gap-7 items-center w-full
					hover:bg-primary-action border-2 border-primary-action transition-all duration-150
					max-md:bg-primary-action">
					<LogoutIcon className="size-5 group-hover:[&>g>path]:stroke-background [&>g>path]:stroke-primary-action max-md:[&>g>path]:stroke-background" />
					<span className="font-semibold group-hover:text-background text-primary-action max-md:text-background">
						Log out
					</span>
				</div>
			}
			id="logout-dialog"
			title="Leaving Already?"
			footer={
				<>
					<button
						onClick={handleLogout}
						className={`group py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
						hover:bg-primary-red hover:text-white transition-all duration-150 w-25 flex items-center justify-center
						${isPending ? "pointer-events-none" : ""}`}>
						{isPending ? <LoadingIcon color="primary-red" /> : "For Now"}
					</button>
					<button
						popoverTarget="logout-dialog"
						popoverTargetAction="hide"
						className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
              hover:bg-primary-action hover:text-white transition-all duration-150">
						I'll Stay
					</button>
				</>
			}>
			<div className="w-65">
				<p>You know you don't have to leave so soon... right?</p>
			</div>
		</Dialog>
	);
}
