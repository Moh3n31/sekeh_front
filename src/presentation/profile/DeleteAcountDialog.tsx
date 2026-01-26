import Dialog from "../components/shared/Dialog";

export default function DeleteAcountDialog() {
	return (
		<Dialog
			id="delete-acount-dialog"
			title="Are you sure?"
			footer={
				<>
					<button
						className="py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
						hover:bg-primary-red hover:text-white transition-all duration-150">
						Delete
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
