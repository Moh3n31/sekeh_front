import { useState } from "react";
import NewChatIcon from "../../assets/icons/NewChatIcon";
import { authAPI, type UserInfo } from "../../services/authentication";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import Dialog from "../components/shared/Dialog";
import GrowableButton from "../components/shared/GrowableButton";
import useProfile from "../../services/profileStorage";
import { toast } from "../../services/toast";

export default function ProfileDialog({ refetch }: { refetch: () => void }) {
	const { profile } = useProfile();
	const [form, setForm] = useState<UserInfo>({
		email: profile?.email ?? "",
		phone_number: profile?.phone_number ?? 0,
		username: profile?.username ?? "",
	});
	const { updateProfile } = authAPI;
	const { mutate } = useCustomMutation(updateProfile);

	const hableChange = <K extends keyof UserInfo>(
		key: K,
		value: UserInfo[K],
	) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleUpdate = () => {
		mutate(form, { onSuccess: refetch });
		toast.success("پروفایل شما با موفقیت ثبت شد.");
	};

	return (
		<Dialog
			trigger={
				<GrowableButton
					fullWidth="35"
					variant="primary"
					label="ویرایش پروفایل"
					icon={
						<NewChatIcon
							className="w-5 h-5 transition-colors duration-200
							[&>g>path]:first:stroke-primary-action [&>g>path]:last:fill-primary-action 
							group-hover:[&>g>path]:first:stroke-white group-hover:[&>g>path]:last:fill-white"
						/>
					}
				/>
			}
			title="ویرایش پروفایل"
			footer={
				<button
					type="submit"
					onClick={handleUpdate}
					className="py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
                hover:bg-accent hover:text-white transition-all duration-150">
					ثبت
				</button>
			}
			closeButton={
				<button
					type="button"
					className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
                hover:bg-primary-action hover:text-white transition-all duration-150">
					بازگشت
				</button>
			}>
			<form
				onSubmit={(e) => e.preventDefault()}
				className="flex flex-col items-center gap-10">
				{/* <section className="relative w-fit">
					<div className="flex items-center justify-center rounded-full size-27 shrink-0 bg-linear-30 from-accent-hover to-match">
						<div className="bg-background size-25 rounded-full"></div>
					</div>
					<button
						className="absolute bottom-0 end-0 bg-primary-action size-7 p-1.5 text-white font-semibold text-lg
          flex items-center justify-center rounded-full">
						<NewChatIcon className="size-full [&>g>path]:first:stroke-white [&>g>path]:last:fill-white" />
					</button>
				</section> */}

				<section className="grid grid-cols-2 w-full gap-5">
					<div className="flex flex-col gap-2">
						<label className="text-[16px] text-primary-action">نام کاربی</label>
						<input
							className="border-2 border-border rounded-md py-2 px-2 outline-0"
							placeholder=""
							value={form.username}
							onChange={(e) => hableChange("username", e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label className="text-[16px] text-primary-action">
							شماره تلفن
						</label>
						<input
							className="border-2 border-border rounded-md py-2 px-2 outline-0"
							placeholder="+989876543210"
							value={form.phone_number === 0 ? "" : form.phone_number}
							onChange={(e) =>
								hableChange("phone_number", parseInt(e.target.value))
							}
						/>
					</div>
					<div className="flex flex-col gap-2 col-span-2">
						<label className="text-[16px] text-primary-action">
							آدرس ایمیل
						</label>
						<input
							className="border-2 border-border rounded-md py-2 px-2 outline-0"
							placeholder="example@gmail.com"
							value={form.email}
							onChange={(e) => hableChange("email", e.target.value)}
						/>
					</div>
				</section>
			</form>
		</Dialog>
	);
}
