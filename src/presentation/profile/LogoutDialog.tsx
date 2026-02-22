import { useNavigate } from "react-router";
import Dialog from "../components/shared/Dialog";
import LogoutIcon from "../../assets/icons/LogoutIcon";

export default function LogoutDialog() {
	const navigate = useNavigate();

	function handleLogout() {
		navigate("auth/login");
	}
	return (
		<Dialog
			trigger={
				<div
					className="group cursor-pointer py-1 px-3 rounded-lg flex gap-7 items-center w-full
					hover:bg-primary-action border-2 border-primary-action transition-all duration-150">
					<LogoutIcon className="size-5 group-hover:[&>g>path]:stroke-background [&>g>path]:stroke-primary-action" />
					<span className="font-semibold group-hover:text-background text-primary-action">
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
						className="py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
						hover:bg-primary-red hover:text-white transition-all duration-150">
						For Now
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
