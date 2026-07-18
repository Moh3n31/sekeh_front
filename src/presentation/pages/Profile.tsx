import useProfile from "../../services/profileStorage";
import ChangePasswordDialog from "../profile/ChangePasswordDialog";
import DeleteAcountDialog from "../profile/DeleteAcountDialog";
import ProfileDialog from "../profile/ProfileDialog";
import { authAPI } from "../../services/authentication";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import { Sparkles } from "lucide-react";

export default function Profile() {
	const { getProfile } = authAPI;
	const { profile, setProfile } = useProfile();
	const { refetch } = useCustomQuery({
		key: ["prfoileInfo"],
		func: getProfile,
		options: {
			enabled: false,
			onSuccess: (p) => setProfile(p),
		},
	});

	return (
		<div className="md:p-7 max-md:py-5 max-md:px-6 flex flex-col gap-10 w-full">
			{/* Profile Actions */}

			<header className="flex max-md:flex-col gap-5 md:items-center max-md:items-start -ms-1">
				<div className="flex items-center justify-center rounded-full size-27 shrink-0 bg-linear-30 from-accent-hover to-match">
					<div className="bg-background flex items-center justify-center size-25 rounded-full">
						<Sparkles className="size-15 text-accent-soft" />
					</div>
				</div>
				<p className="font-semibold text-4xl text-primary-text w-3/4">
					{profile?.username}
				</p>
			</header>

			<section className="flex flex-col gap-5 text-xl text-primary-text rounded-lg py-7 w-fit">
				<div className="flex gap-2">
					<p className="font-semibold shrink-0">آدرس ایمیل :</p>
					<p>{profile?.email}</p>
				</div>
				<div className="flex gap-2">
					<p className="font-semibold shrink-0">شماره تلفن :</p>
					<p>{profile?.phone_number}</p>
				</div>
			</section>

			<menu className="flex flex-col items-start gap-3">
				<ProfileDialog refetch={refetch} />
				<ChangePasswordDialog />
				<DeleteAcountDialog />
			</menu>
		</div>
	);
}
