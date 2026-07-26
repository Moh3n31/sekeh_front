import { useDialogContext } from "@/app/contexts/useDialogContext";
import { authAPI } from "@/features/auth/api/authApi";
import Button from "@/shared/components/ui/Button";
import Dialog from "@/shared/components/ui/Dialog";
import PasswordInput from "@/shared/components/ui/PasswordInput";
import PasswordRequirements from "@/shared/components/ui/PasswordRequirements";
import { useCustomMutation } from "@/shared/hooks/useCustomMutation";
import { getPasswordError } from "@/shared/lib/formValidation";
import { toast } from "@/shared/lib/toast";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useState } from "react";

interface PasswordForm {
	current: string;
	new: string;
	confirm: string;
}

type TouchedFields = Partial<Record<keyof PasswordForm, boolean>>;

const initialForm: PasswordForm = {
	current: "",
	new: "",
	confirm: "",
};

const getFormErrors = (form: PasswordForm) => ({
	current: form.current ? "" : "رمز عبور فعلی الزامی است.",
	new: getPasswordError(form.new),
	confirm: !form.confirm
		? "تکرار رمز عبور جدید الزامی است."
		: form.new !== form.confirm
			? "رمز عبور جدید و تکرار آن یکسان نیست."
			: "",
});

export default function ChangePasswordDialog() {
	const [form, setForm] = useState<PasswordForm>(initialForm);
	const [touched, setTouched] = useState<TouchedFields>({});
	const dialog = useDialogContext();
	const { mutate, isPending } = useCustomMutation(authAPI.changePassword);

	const validationErrors = getFormErrors(form);
	const isFormValid = Object.values(validationErrors).every((error) => !error);

	const handleChange = <K extends keyof PasswordForm>(
		key: K,
		value: PasswordForm[K],
	) => {
		setForm((current) => ({ ...current, [key]: value }));
	};

	const markTouched = (key: keyof PasswordForm) => {
		setTouched((current) => ({ ...current, [key]: true }));
	};

	const handleSubmit = () => {
		setTouched({ current: true, new: true, confirm: true });
		if (!isFormValid || isPending) return;

		mutate(
			{ current_password: form.current, new_password: form.new },
			{
				onSuccess: () => {
					toast.success("رمز عبور شما با موفقیت به‌روزرسانی شد.");
					setForm(initialForm);
					setTouched({});
					dialog.closeDialog();
				},
			},
		);
	};

	return (
		<>
			<Dialog
				trigger={
					<Button aria-haspopup="dialog" aria-expanded={dialog.isOpen}>
						<KeyRound className="size-5" strokeWidth={1.5} />
						<span className="pb-1">تغییر رمز عبور</span>
					</Button>
				}
				variant="fullscreen"
				title="تغییر رمز عبور"
				footer={
					<>
						<Button
							variant="outline"
							onClick={() => {
								dialog.closeDialog();
								setTouched({});
							}}
							disabled={isPending}>
							بازگشت
						</Button>
						<Button
							type="submit"
							form="change-password-form"
							disabled={!isFormValid || isPending}>
							{isPending ? (
								<>
									<LoaderCircle className="size-4 animate-spin" />
									<span>در حال ثبت</span>
								</>
							) : (
								"ثبت"
							)}
						</Button>
					</>
				}>
				<form
					id="change-password-form"
					noValidate
					onSubmit={(event) => {
						event.preventDefault();
						handleSubmit();
					}}
					className="flex min-w-0 flex-col gap-5 md:min-w-96">
					<PasswordInput
						label="رمز عبور فعلی"
						value={form.current}
						onChange={(event) => handleChange("current", event.target.value)}
						onBlur={() => markTouched("current")}
						autoComplete="current-password"
						maxLength={64}
						required
						error={touched.current ? validationErrors.current : undefined}
					/>

					<div className="space-y-2">
						<PasswordInput
							label="رمز عبور جدید"
							value={form.new}
							onChange={(event) => handleChange("new", event.target.value)}
							onBlur={() => markTouched("new")}
							autoComplete="new-password"
							maxLength={64}
							required
							error={touched.new ? validationErrors.new : undefined}
						/>
						<PasswordRequirements value={form.new} />
					</div>

					<PasswordInput
						label="تکرار رمز عبور جدید"
						value={form.confirm}
						onChange={(event) => handleChange("confirm", event.target.value)}
						onBlur={() => markTouched("confirm")}
						autoComplete="new-password"
						maxLength={64}
						required
						error={touched.confirm ? validationErrors.confirm : undefined}
					/>
				</form>
			</Dialog>
		</>
	);
}
