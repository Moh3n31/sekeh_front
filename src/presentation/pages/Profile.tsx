import ChangePasswordDialog from "../profile/ChangePasswordDialog";
import DeleteAcountDialog from "../profile/DeleteAcountDialog";
import ProfileDialog from "../profile/ProfileDialog";

export default function Profile() {
	return (
		<div className="relative md:p-7 max-md:py-5 max-md:px-6 flex flex-col gap-10 w-full">
			{/* Profile Actions */}
			<menu className="absolute top-4 right-5 flex flex-col items-end gap-3">
				<ProfileDialog />
				<ChangePasswordDialog />
				<DeleteAcountDialog />
			</menu>

			<header className="flex gap-5 items-center -ml-1">
				<div className="flex items-center justify-center rounded-full size-27 shrink-0 bg-linear-30 from-accent-hover to-match">
					<div className="bg-background size-25 rounded-full"></div>
				</div>
				<div className="flex flex-col gap-2 w-3/4">
					<p className="font-semibold text-4xl text-primary-text">
						Mohsen Mahmoudi
					</p>
					<p className="text-xl text-primary-action">@moh3n_mahmoudi</p>
				</div>
			</header>

			<section className="flex flex-col gap-5 text-xl text-primary-text rounded-lg py-7 w-fit">
				<div className="flex gap-2">
					<p className="font-semibold shrink-0">Email :</p>
					<p>mohsenmahmudi82@gmail.com</p>
				</div>
				<div className="flex gap-2">
					<p className="font-semibold shrink-0">Phone :</p>
					<p>+989217869455</p>
				</div>
			</section>
			<section className="flex flex-col gap-5 text-xl text-primary-text rounded-lg py-7 w-fit">
				<div className="flex gap-2">
					<p className="font-semibold shrink-0">Total Chats :</p>
					<p>5</p>
				</div>
				<div className="flex gap-2">
					<p className="font-semibold shrink-0">3K Age:</p>
					<p>95d</p>
				</div>
			</section>
		</div>
	);
}
