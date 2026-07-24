import useProfile from "@/features/profile/store/profileStore";
import ChangePasswordDialog from "@/features/profile/components/ChangePasswordDialog";
import DeleteAccountDialog from "@/features/profile/components/DeleteAccountDialog";
import EditProfileDialog from "@/features/profile/components/EditProfileDialog";
import { authAPI } from "@/features/auth/api/authApi";
import { useCustomQuery } from "@/shared/hooks/useCustomQuery";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { formatDate } from "@/shared/lib/date";

export default function ProfilePage() {
	const { getProfile } = authAPI;
	const { profile, setProfile } = useProfile();

	const { data, refetch } = useCustomQuery({
		key: ["prfoileInfo"],
		func: getProfile,
	});

	useEffect(() => {
		if (data?.data) {
			const p = data.data.user;

			setProfile(p);
		}
	}, [data?.data, setProfile]);

	return (
		<div className="md:p-7 max-md:py-5 max-md:px-6 flex flex-col max-md:items-center gap-10 w-full">
			{/* Profile Actions */}

			<header className="flex max-md:flex-col max-md:items-center gap-5 md:items-center -ms-1">
				<div className="flex items-center justify-center rounded-full size-27 shrink-0 bg-linear-30 from-accent-hover to-match">
					<div className="bg-background flex items-center justify-center size-25 rounded-full">
						<Sparkles className="size-15 text-accent-soft" />
					</div>
				</div>
				<p className="font-semibold text-4xl text-primary-text ">
					{profile?.username}
				</p>
			</header>

			<section className="flex flex-col max-md:items-center gap-5 text-xl text-primary-text rounded-lg py-7 w-fit">
				<div className="flex gap-2">
					<p className="font-semibold shrink-0">آدرس ایمیل :</p>
					<p className="overflow-hidden truncate" dir="ltr">
						{profile?.email}
					</p>
				</div>
				<div className="flex gap-2">
					<p className="font-semibold shrink-0">شماره تلفن :</p>
					<p>{profile?.phone_number}</p>
				</div>
			</section>

			<menu className="flex flex-col items-start gap-3">
				<EditProfileDialog refetch={refetch} />
				<ChangePasswordDialog />
				<DeleteAccountDialog />
			</menu>

			<footer className="flex flex-col gap-1">
				<p className="text-[14px] font-medium text-text-muted">
					تاریخ عضویت : {formatDate(profile?.created_at ?? "")}
				</p>
				{profile?.updated_at && (
					<p className="text-[14px] font-medium text-text-muted">
						آخرین تغییرات : {formatDate(profile.updated_at)}
					</p>
				)}
			</footer>
		</div>
	);
}
