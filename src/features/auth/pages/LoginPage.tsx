import { authAPI } from "@/features/auth/api/authApi";
import useProfile from "@/features/profile/store/profileStore";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import PasswordInput from "@/shared/components/ui/PasswordInput";
import { useCustomMutation } from "@/shared/hooks/useCustomMutation";
import { addTokens } from "@/shared/lib/authTokens";
import {
	getPasswordError,
	getUsernameError,
	sanitizeText,
} from "@/shared/lib/formValidation";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

interface LoginForm {
	username: string;
	password: string;
}

type TouchedFields = Partial<Record<keyof LoginForm, boolean>>;

const getLoginErrors = (form: LoginForm) => ({
	username: getUsernameError(form.username, { allowEmail: true }),
	password: getPasswordError(form.password),
});

export default function LoginPage() {
	const [form, setForm] = useState<LoginForm>({
		username: "",
		password: "",
	});
	const [touched, setTouched] = useState<TouchedFields>({});
	const { setProfile } = useProfile();
	const navigate = useNavigate();
	const { mutate, isPending } = useCustomMutation(authAPI.login, {
		onSuccess: (response) => {
			const { access_token, refresh_token, user } = response.data;
			addTokens({ access: access_token, refresh: refresh_token });
			setProfile(user);
			navigate("/chats");
		},
	});

	const validationErrors = getLoginErrors(form);
	const isFormValid = Object.values(validationErrors).every((error) => !error);

	const handleChange = <K extends keyof LoginForm>(
		key: K,
		value: LoginForm[K],
	) => {
		setForm((current) => ({ ...current, [key]: value }));
	};

	const markTouched = (key: keyof LoginForm) => {
		setTouched((current) => ({ ...current, [key]: true }));
	};

	const handleSubmit = () => {
		setTouched({ username: true, password: true });
		if (!isFormValid || isPending) return;

		mutate({
			username: sanitizeText(form.username),
			password: form.password,
		});
	};

	return (
		<div className="flex h-full flex-col justify-center gap-8 py-5 px-10">
			<div className="space-y-2 text-center">
				<h1 className="text-4xl font-bold text-primary-text">ورود</h1>
				<p className="text-sm text-text-muted">
					اطلاعات حساب کاربری خود را وارد کنید.
				</p>
			</div>

			<form
				id="login-form"
				noValidate
				onSubmit={(event) => {
					event.preventDefault();
					handleSubmit();
				}}
				className="flex flex-col gap-5 text-primary-text">
				<Input
					label="نام کاربری یا ایمیل"
					value={form.username}
					onChange={(event) => handleChange("username", event.target.value)}
					onBlur={() => markTouched("username")}
					autoComplete="username"
					maxLength={40}
					error={touched.username ? validationErrors.username : undefined}
					placeholder="نام کاربری یا ایمیل"
				/>

				<PasswordInput
					label="رمز عبور"
					value={form.password}
					onChange={(event) => handleChange("password", event.target.value)}
					onBlur={() => markTouched("password")}
					autoComplete="current-password"
					maxLength={64}
					error={touched.password ? validationErrors.password : undefined}
				/>
			</form>

			<Button
				disabled={!isFormValid || isPending}
				type="submit"
				form="login-form"
				className="h-12 rounded-full text-xl">
				{isPending ? (
					<>
						<LoaderCircle className="size-5 animate-spin" />
						<span>در حال ورود</span>
					</>
				) : (
					"ورود"
				)}
			</Button>

			<footer className="flex flex-col items-center">
				<p className="text-primary-action">هنوز حساب کاربری نساخته‌اید؟</p>
				<Link to="../signup" className="font-semibold text-accent">
					ثبت نام
				</Link>
			</footer>
		</div>
	);
}
