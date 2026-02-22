import NewChatIcon from "../../assets/icons/NewChatIcon";
import Dialog from "../components/shared/Dialog";

export default function ProfileDialog() {
	return (
		<Dialog
			trigger={
				<div
					className="group flex items-center justify-end h-10 w-10 hover:w-35
					bg-surface hover:bg-primary-action border-2 border-primary-action rounded-full 
					transition-all duration-200 ease-in-out overflow-hidden">
					<div className="flex items-center justify-center gap-2 min-w-max px-2">
						<span
							className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
							group-hover:pr-2 text-white transition-all duration-200 ease-in-out whitespace-nowrap font-medium">
							Edit Profile
						</span>
						<NewChatIcon
							className="w-5 h-5 transition-colors duration-200
							[&>g>path]:first:stroke-primary-action [&>g>path]:last:fill-primary-action 
							group-hover:[&>g>path]:first:stroke-white group-hover:[&>g>path]:last:fill-white"
						/>
					</div>
				</div>
			}
			id="profile-dialog"
			title="Edit Profile"
			footer={
				<>
					<button
						className="py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
                hover:bg-accent hover:text-white transition-all duration-150">
						Submit
					</button>
					<button
						popoverTarget="profile-dialog"
						popoverTargetAction="hide"
						className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
                hover:bg-primary-action hover:text-white transition-all duration-150">
						Cancel
					</button>
				</>
			}>
			<div className="flex flex-col items-center gap-10">
				<section className="relative w-fit">
					<div className="flex items-center justify-center rounded-full size-27 shrink-0 bg-linear-30 from-accent-hover to-match">
						<div className="bg-background size-25 rounded-full"></div>
					</div>
					<button
						className="absolute bottom-0 right-0 bg-primary-action size-7 p-1.5 text-white font-semibold text-lg
          flex items-center justify-center rounded-full">
						<NewChatIcon className="size-full [&>g>path]:first:stroke-white [&>g>path]:last:fill-white" />
					</button>
				</section>

				<section className="grid grid-cols-2 gap-5">
					<div className="flex flex-col gap-2">
						<label className="text-[16px] text-primary-action">
							First Name
						</label>
						<input
							className="border-2 border-border rounded-md py-2 px-2 outline-0"
							placeholder=""
							value="Mohsen"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-[16px] text-primary-action">Last Name</label>
						<input
							className="border-2 border-border rounded-md py-2 px-2 outline-0"
							placeholder=""
							value="Mahmoudi"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-[16px] text-primary-action">Username</label>
						<input
							className="border-2 border-border rounded-md py-2 px-2 outline-0"
							placeholder=""
							value="moh3n_mahmoudi"
						/>
					</div>
				</section>

				<section className="flex flex-col w-full gap-5">
					<div className="flex flex-col gap-2">
						<label className="text-[16px] text-primary-action">
							Phone Number
						</label>
						<input
							className="border-2 border-border rounded-md py-2 px-2 outline-0"
							placeholder="+989876543210"
							value="+989217869455"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-[16px] text-primary-action">
							Email Address
						</label>
						<input
							className="border-2 border-border rounded-md py-2 px-2 outline-0"
							placeholder="example@gmail.com"
							value="mohsenmahmoudi82@gmail.com"
						/>
					</div>
				</section>
			</div>
		</Dialog>
	);
}
