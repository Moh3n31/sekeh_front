import PasswordIcon from "../../assets/icons/PasswordIcon";
import Dialog from "../components/shared/Dialog";
import GrowableButton from "../components/shared/GrowableButton";

export default function ChangePasswordDialog() {
	return (
		<Dialog
			trigger={
				<GrowableButton
					fullWidth="47"
					variant="primary"
					label="Change Password"
					icon={
						<PasswordIcon
							className="w-5 h-5 transition-colors duration-200
							[&>g>path]:first:stroke-primary-action [&>g>path]:not-first:fill-primary-action
							group-hover:[&>g>path]:first:stroke-white group-hover:[&>g>path]:not-first:fill-white"
						/>
					}
				/>
			}
			title="Change Password"
			footer={
				<button
					className="py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
					hover:bg-accent hover:text-white transition-all duration-150">
					Submit
				</button>
			}
			closeButton={
				<button
					className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
					hover:bg-primary-action hover:text-white transition-all duration-150">
					Cancel
				</button>
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
