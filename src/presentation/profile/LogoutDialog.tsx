import { useNavigate } from "react-router";
import Dialog from "../components/shared/Dialog";

export default function LogoutDialog() {
	const navigate = useNavigate();

	function handleLogout() {
		navigate("auth/login");
	}
	return (
		<Dialog
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
