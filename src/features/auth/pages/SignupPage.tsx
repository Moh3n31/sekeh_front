import { authAPI } from "@/features/auth/api/authApi";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import PasswordInput from "@/shared/components/ui/PasswordInput";
import PasswordRequirements from "@/shared/components/ui/PasswordRequirements";
import { useCustomMutation } from "@/shared/hooks/useCustomMutation";
import {
	getPasswordError,
	getUsernameError,
	sanitizeText,
} from "@/shared/lib/formValidation";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

interface SignupForm {
	username: string;
	password: string;
	confirm: string;
}

type TouchedFields = Partial<Record<keyof SignupForm, boolean>>;

const getSignupErrors = (form: SignupForm) => ({
	username: getUsernameError(form.username),
	password: getPasswordError(form.password),
	confirm: !form.confirm
		? "تکرار رمز عبور الزامی است."
		: form.password !== form.confirm
			? "رمز عبور و تکرار آن یکسان نیست."
			: "",
});

export default function SignupPage() {
	const [form, setForm] = useState<SignupForm>({
		username: "",
		password: "",
		confirm: "",
	});
	const [touched, setTouched] = useState<TouchedFields>({});
	const navigate = useNavigate();
	const { mutate, isPending } = useCustomMutation(authAPI.register, {
		onSuccess: () => navigate("/chats"),
	});

	const validationErrors = getSignupErrors(form);
	const isFormValid = Object.values(validationErrors).every((error) => !error);

	const handleChange = <K extends keyof SignupForm>(
		key: K,
		value: SignupForm[K],
	) => {
		setForm((current) => ({ ...current, [key]: value }));
	};

	const markTouched = (key: keyof SignupForm) => {
		setTouched((current) => ({ ...current, [key]: true }));
	};

	const handleSubmit = () => {
		setTouched({ username: true, password: true, confirm: true });
		if (!isFormValid || isPending) return;

		mutate({
			username: sanitizeText(form.username),
			password: form.password,
		});
	};

	return (
		<div className="flex h-full flex-col justify-center gap-7 py-5 ">
			<div className="space-y-2 text-center">
				<h1 className="text-4xl font-bold text-primary-text">ثبت نام</h1>
				<p className="text-sm text-text-muted">
					یک نام کاربری و رمز عبور امن انتخاب کنید.
				</p>
			</div>

			<section className="relative">
				<form
					id="signup-form"
					noValidate
					onSubmit={(event) => {
						event.preventDefault();
						handleSubmit();
					}}
					className="flex flex-col gap-4 px-10 pb-6 text-primary-text overflow-y-auto max-md:max-h-[300px] md:max-h-[400px]">
					<Input
						label="نام کاربری"
						value={form.username}
						onChange={(event) => handleChange("username", event.target.value)}
						onBlur={() => markTouched("username")}
						autoComplete="username"
						maxLength={40}
						error={touched.username ? validationErrors.username : undefined}
						hint="۳ تا ۴۰ کاراکتر؛ شروع با حرف و استفاده از حروف، اعداد، نقطه، خط تیره یا زیرخط"
					/>

					<div className="space-y-2">
						<PasswordInput
							label="رمز عبور"
							value={form.password}
							onChange={(event) => handleChange("password", event.target.value)}
							onBlur={() => markTouched("password")}
							autoComplete="new-password"
							maxLength={64}
							error={touched.password ? validationErrors.password : undefined}
						/>
						<PasswordRequirements value={form.password} />
					</div>

					<PasswordInput
						label="تکرار رمز عبور"
						value={form.confirm}
						onChange={(event) => handleChange("confirm", event.target.value)}
						onBlur={() => markTouched("confirm")}
						autoComplete="new-password"
						maxLength={64}
						error={touched.confirm ? validationErrors.confirm : undefined}
					/>
				</form>
				<div className="md:hidden pointer-events-none absolute bottom-0 left-0 h-10 w-full bg-linear-to-t from-background to-transparent" />
			</section>

			<Button
				disabled={!isFormValid || isPending}
				type="submit"
				form="signup-form"
				className="h-12 rounded-full text-xl mx-10">
				{isPending ? (
					<>
						<LoaderCircle className="size-5 animate-spin" />
						<span>در حال ثبت نام</span>
					</>
				) : (
					"ادامه"
				)}
			</Button>

			<footer className="flex flex-col items-center">
				<p className="text-primary-action">قبلاً حساب کاربری ساخته‌اید؟</p>
				<Link to="../login" className="font-semibold text-accent">
					ورود
				</Link>
			</footer>
		</div>
	);
}
