import { useState } from "react";
import { authAPI } from "../../services/authentication";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import Dialog from "../components/shared/Dialog";
import { toast } from "../../services/toast";
import { KeyRound } from "lucide-react";

interface PasswordForm {
	current: string;
	new: string;
	confirm: string;
}

export default function ChangePasswordDialog() {
	const [form, setForm] = useState<PasswordForm>({
		current: "",
		new: "",
		confirm: "",
	});

	const { changePassword } = authAPI;
	const { mutate } = useCustomMutation(changePassword);

	function handleChange<K extends keyof PasswordForm>(
		key: K,
		value: PasswordForm[K],
	) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	function handleSubmit() {
		if (!doesMatch) return toast.error("تایید رمز عبور جدید صحیح نمی‌باشد.");
		if (!isValid) return toast.error("لطفا فرم را کامل پر کنید.");

		mutate(
			{ current_password: form.current, new_password: form.new },
			{
				onSuccess: () => toast.success("رمز عبور شما با موفقیت بروزرسانی شد."),
				onError: (e) => toast.error(e.message),
			},
		);
	}

	const doesMatch = form.new === form.confirm;
	const isValid = !!(form.new && doesMatch && form.current);

	return (
		<Dialog
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
				className="flex flex-col items-center gap-5 w-80">
				<div className="flex flex-col gap-2 w-full">
					<label className="text-[16px] text-primary-action">
						رمز عبور قبلی
					</label>
					<input
						value={form.current}
						onChange={(e) => handleChange("current", e.target.value)}
						className="border-2 border-border rounded-md py-2 px-2 outline-0"
						placeholder=""
					/>
				</div>

				<div className="flex flex-col gap-2 w-full">
					<label className="text-[16px] text-primary-action">
						رمز عبور جدید
					</label>
					<input
						value={form.new}
						onChange={(e) => handleChange("new", e.target.value)}
						className="border-2 border-border rounded-md py-2 px-2 outline-0"
						placeholder=""
					/>
				</div>

				<div className="flex flex-col gap-2 w-full">
					<label className="text-[16px] text-primary-action">
						تایید رمز عبور
					</label>
					<input
						value={form.confirm}
						onChange={(e) => handleChange("confirm", e.target.value)}
						className="border-2 border-border rounded-md py-2 px-2 outline-0"
						placeholder=""
					/>
				</div>
			</form>
		</Dialog>
	);
}
