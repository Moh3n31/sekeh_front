import { useState } from "react";
import { authAPI } from "../../services/authentication";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import Dialog from "../components/shared/Dialog";
import { toast } from "../../services/toast";
import { KeyRound } from "lucide-react";
import { getPasswordError, getRequiredError, sanitizeText } from "../../utils/formValidation";

interface PasswordForm {
	current: string;
	new: string;
	confirm: string;
}

interface PasswordErrors {
	current?: string;
	new?: string;
	confirm?: string;
}

export default function ChangePasswordDialog() {
	const [form, setForm] = useState<PasswordForm>({
		current: "",
		new: "",
		confirm: "",
	});
	const [errors, setErrors] = useState<PasswordErrors>({});

	const { changePassword } = authAPI;
	const { mutate } = useCustomMutation(changePassword);

	function handleChange<K extends keyof PasswordForm>(
		key: K,
		value: PasswordForm[K],
	) {
		setForm((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	}

	function handleSubmit() {
		const nextErrors: PasswordErrors = {};
		const current = sanitizeText(form.current);
		const next = sanitizeText(form.new);
		const confirm = sanitizeText(form.confirm);

		if (!current) nextErrors.current = getRequiredError(form.current, "رمز عبور قبلی");
		if (!next) nextErrors.new = getRequiredError(form.new, "رمز عبور جدید");
		else {
			const passwordError = getPasswordError(next);
			if (passwordError) nextErrors.new = passwordError;
		}
		if (!confirm) nextErrors.confirm = getRequiredError(form.confirm, "تایید رمز عبور");
		else if (next !== confirm) nextErrors.confirm = "رمز عبور و تکرار آن یکسان نیست.";

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) return;

		mutate(
			{ current_password: current, new_password: next },
			{
				onSuccess: () => {
					toast.success("رمز عبور شما با موفقیت بروزرسانی شد.");
					setForm({ current: "", new: "", confirm: "" });
					setErrors({});
				},
				onError: (e) => toast.error(e.message),
			},
		);
	}

	return (
		<Dialog
			variant="fullscreen"
			trigger={
				<div className="flex gap-2 cursor-pointer items-center bg-primary-action py-1.5 px-3 rounded-full">
					<KeyRound
						strokeWidth={1.5}
						className="size-5 transition-colors duration-200 text-white"
					/>
					<span className="align-middle text-white pb-2">تغییر رمز عبور</span>
				</div>
			}
			title="تغییر رمز عبور"
			footer={
				<button
					onClick={handleSubmit}
					className="py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
					hover:bg-accent hover:text-white transition-all duration-150">
					ثبت
				</button>
			}
			closeButton={
				<button
					className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
					hover:bg-primary-action hover:text-white transition-all duration-150">
					بازگشت
				</button>
			}>
			<form
				onSubmit={(e) => e.preventDefault()}
				className="flex flex-col items-center gap-5">
				<div className="flex flex-col gap-2 w-full">
					<label className="text-[16px] text-primary-action">
						رمز عبور قبلی
					</label>
					<input
						type="password"
						value={form.current}
						onChange={(e) => handleChange("current", e.target.value)}
						maxLength={64}
						aria-invalid={Boolean(errors.current)}
						className={`border-2 rounded-md py-2 px-2 outline-0 ${errors.current ? "border-red-500" : "border-border"}`}
					/>
					{errors.current ? <p className="text-sm text-red-500">{errors.current}</p> : null}
				</div>

				<div className="flex flex-col gap-2 w-full">
					<label className="text-[16px] text-primary-action">
						رمز عبور جدید
					</label>
					<input
						type="password"
						value={form.new}
						onChange={(e) => handleChange("new", e.target.value)}
						maxLength={64}
						aria-invalid={Boolean(errors.new)}
						className={`border-2 rounded-md py-2 px-2 outline-0 ${errors.new ? "border-red-500" : "border-border"}`}
					/>
					{errors.new ? <p className="text-sm text-red-500">{errors.new}</p> : null}
				</div>

				<div className="flex flex-col gap-2 w-full">
					<label className="text-[16px] text-primary-action">
						تایید رمز عبور
					</label>
					<input
						type="password"
						value={form.confirm}
						onChange={(e) => handleChange("confirm", e.target.value)}
						maxLength={64}
						aria-invalid={Boolean(errors.confirm)}
						className={`border-2 rounded-md py-2 px-2 outline-0 ${errors.confirm ? "border-red-500" : "border-border"}`}
					/>
					{errors.confirm ? <p className="text-sm text-red-500">{errors.confirm}</p> : null}
				</div>
			</form>
		</Dialog>
	);
}
