import Dialog from "../components/shared/Dialog";

export default function ChangePasswordDialog() {
	return (
		<Dialog
			id="change-password-dialog"
			title="Change Password"
			footer={
				<>
					<button
						className="py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
                hover:bg-accent hover:text-white transition-all duration-150">
						Submit
					</button>
					<button
						popoverTarget="change-password-dialog"
						popoverTargetAction="hide"
						className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
                hover:bg-primary-action hover:text-white transition-all duration-150">
						Cancel
					</button>
				</>
			}>
			<div className="flex flex-col items-center gap-5 w-80">
				<div className="flex flex-col gap-2 w-full">
					<label className="text-[16px] text-primary-action">
						Old Passwrod
					</label>
					<input
						className="border-2 border-border rounded-md py-2 px-2 outline-0"
						placeholder=""
					/>
				</div>

				<div className="flex flex-col gap-2 w-full">
					<label className="text-[16px] text-primary-action">
						New Password
					</label>
					<input
						className="border-2 border-border rounded-md py-2 px-2 outline-0"
						placeholder=""
					/>
				</div>

				<div className="flex flex-col gap-2 w-full">
					<label className="text-[16px] text-primary-action">
						Confirm Password
					</label>
					<input
						className="border-2 border-border rounded-md py-2 px-2 outline-0"
						placeholder=""
					/>
				</div>
			</div>
		</Dialog>
	);
}
