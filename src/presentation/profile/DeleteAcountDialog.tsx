import BinIcon from "../../assets/icons/BinIcon";
import BrokenHeartIcon from "../../assets/icons/BrokenHeartIcon";
import Dialog from "../components/shared/Dialog";

export default function DeleteAcountDialog() {
	return (
		<Dialog
			trigger={
				<div
					className="group flex items-center justify-end h-10 w-10 hover:w-43
					bg-surface hover:bg-primary-red border-2 border-primary-red rounded-full 
					transition-all duration-200 ease-in-out overflow-hidden">
					<div className="flex items-center justify-center gap-2 min-w-max px-2">
						<span
							className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
							group-hover:pr-2 text-white transition-all duration-200 ease-in-out whitespace-nowrap font-medium">
							Delete Account
						</span>
						<BinIcon
							className="w-5 h-5 transition-colors duration-200
							[&>g>path]:stroke-primary-red group-hover:[&>g>path]:stroke-white"
						/>
					</div>
				</div>
				// <button
				// 	popoverTarget="delete-acount-dialog"
				// 	className="group border-2 border-primary-red rounded-full hover:bg-primary-red overflow-hidden
				// 			transition-all duration-150 p-2 h-10 w-10 hover:w-45 flex justify-between items-center
				// 			cursor-pointer hover:*:[&>g>path]:stroke-white">
				// 	<p className="text-white hidden group-hover:block pl-2">
				// 		Delete Account
				// 	</p>
				// 	<BinIcon
				// 		className="h-full group-hover:bg-primary-red transition-all duration-150
				// 			[&>g>path]:stroke-primary-red "
				// 	/>
				// </button>
			}
			id="delete-acount-dialog"
			title="Are you sure?"
			footer={
				<>
					<button
						className="group py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
						hover:bg-primary-red hover:text-white transition-all duration-150 flex gap-2 items-center">
						<span>Delete</span>
						<BrokenHeartIcon
							className="size-5 [&>g>path]:first:fill-primary-red [&>g>path]:last:stroke-primary-red
						group-hover:[&>g>path]:first:fill-white group-hover:[&>g>path]:last:stroke-white transition-all duration-150"
						/>
					</button>
					<button
						popoverTarget="delete-acount-dialog"
						popoverTargetAction="hide"
						className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
              hover:bg-primary-action hover:text-white transition-all duration-150">
						Cancel
					</button>
				</>
			}>
			<p className="text-primary-action w-90">
				Deleting your account is a{" "}
				<span className="font-semibold">permenant action</span> and{" "}
				<span className="font-semibold">can not</span> be reversed once
				confirmed
			</p>
		</Dialog>
	);
}
