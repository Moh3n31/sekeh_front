import { useState } from "react";
import { authAPI, type UserInfo } from "../../services/authentication";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import Dialog from "../components/shared/Dialog";
import useProfile from "../../services/profileStorage";
import { toast } from "../../services/toast";
import { PenBoxIcon } from "lucide-react";
import { getEmailError, getPhoneError, getRequiredError, parsePhoneNumber, sanitizeText } from "../../utils/formValidation";

interface ProfileErrors {
	username?: string;
	phone_number?: string;
	email?: string;
}

export default function ProfileDialog({ refetch }: { refetch: () => void }) {
	const { profile } = useProfile();
	const [form, setForm] = useState<UserInfo>({
		email: profile?.email ?? "",
		phone_number: profile?.phone_number ?? null,
		username: profile?.username ?? "",
	});
	const [phoneInput, setPhoneInput] = useState(
		profile?.phone_number ? String(profile.phone_number) : "",
	);
	const [errors, setErrors] = useState<ProfileErrors>({});
	const { updateProfile } = authAPI;
	const { mutate } = useCustomMutation(updateProfile);

	const hableChange = <K extends keyof UserInfo>(
		key: K,
		value: UserInfo[K],
	) => {
		setForm((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	const handlePhoneChange = (value: string) => {
		setPhoneInput(value);
		setErrors((prev) => ({ ...prev, phone_number: undefined }));
	};

	const handleUpdate = () => {
		const nextErrors: ProfileErrors = {};
		const username = sanitizeText(form.username);
		const email = sanitizeText(form.email);
		const phoneValue = sanitizeText(phoneInput);
		const parsedPhone = phoneValue ? parsePhoneNumber(phoneValue) : null;

		if (!username) nextErrors.username = getRequiredError(form.username, "نام کاربری");
		if (getEmailError(email)) nextErrors.email = getEmailError(email);
		if (phoneValue) {
			const phoneError = getPhoneError(phoneValue);
			if (phoneError) nextErrors.phone_number = phoneError;
		}

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) return;

		const payload = {
			...form,
			username,
			email,
			phone_number: parsedPhone,
		};

		mutate(payload, {
			onSuccess: () => {
				toast.success("پروفایل شما با موفقیت ثبت شد.");
				refetch();
			},
		});
	};

	return (
		<Dialog
			variant="fullscreen"
			trigger={
				<div className="flex gap-2 cursor-pointer items-center bg-primary-action py-1.5 px-3 rounded-full w-full">
					<PenBoxIcon
						strokeWidth={1.5}
						className="size-5 transition-colors duration-200 text-white"
					/>
					<span className="align-middle text-white pb-2">ویرایش پروفایل</span>
				</div>
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
				<section className="grid grid-cols-2 w-full gap-5">
					<div className="flex flex-col gap-2">
						<label className="text-[16px] text-primary-action">نام کاربی</label>
						<input
							className={`border-2 rounded-md py-2 px-2 outline-0 ${errors.username ? "border-red-500" : "border-border"}`}
							placeholder=""
							value={form.username}
							onChange={(e) => hableChange("username", e.target.value)}
						/>
						{errors.username ? <p className="text-sm text-red-500">{errors.username}</p> : null}
					</div>
					<div className="flex flex-col gap-2">
						<label className="text-[16px] text-primary-action">
							شماره تلفن
						</label>
						<input
							className={`border-2 rounded-md py-2 px-2 outline-0 ${errors.phone_number ? "border-red-500" : "border-border"}`}
							placeholder="09876543210"
							value={phoneInput}
							onChange={(e) => handlePhoneChange(e.target.value)}
						/>
						{errors.phone_number ? <p className="text-sm text-red-500">{errors.phone_number}</p> : null}
					</div>
					<div className="flex flex-col gap-2 col-span-2">
						<label className="text-[16px] text-primary-action">
							آدرس ایمیل
						</label>
						<input
							className={`border-2 rounded-md py-2 px-2 outline-0 ${errors.email ? "border-red-500" : "border-border"}`}
							placeholder="example@gmail.com"
							value={form.email}
							onChange={(e) => hableChange("email", e.target.value)}
						/>
						{errors.email ? <p className="text-sm text-red-500">{errors.email}</p> : null}
					</div>
				</section>
			</form>
		</Dialog>
	);
}
