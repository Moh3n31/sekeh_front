import { useState } from "react";
import PasswordIcon from "../../assets/icons/PasswordIcon";
import { authAPI } from "../../services/authentication";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import Dialog from "../components/shared/Dialog";
import GrowableButton from "../components/shared/GrowableButton";
import { toast } from "../../services/toast";

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
				onSuccess: () =>
					toast.success("رمز عبور شما با موفقیت بروزرسانی شد."),
				onError: (e) => toast.error(e.message),
			},
		);
	}

	const doesMatch = form.new === form.confirm;
	const isValid = !!(form.new && doesMatch && form.current);

	return (
		<Dialog
			trigger={
				<GrowableButton
					fullWidth="47"
					variant="primary"
					label="تغییر رمز عبور"
					icon={
						<PasswordIcon
							className="w-5 h-5 transition-colors duration-200
							[&>g>path]:first:stroke-primary-action [&>g>path]:not-first:fill-primary-action
							group-hover:[&>g>path]:first:stroke-white group-hover:[&>g>path]:not-first:fill-white"
						/>
					}
				/>
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
