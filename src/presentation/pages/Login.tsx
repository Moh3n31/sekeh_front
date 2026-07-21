import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { authAPI } from "../../services/authentication";
import useProfile from "../../services/profileStorage";
import { addTokens } from "../../utils/authTokens";
import { LoaderCircle } from "lucide-react";
import { getRequiredError, sanitizeText } from "../../utils/formValidation";

interface Form {
	username: string;
	password: string;
}

interface FormErrors {
	username?: string;
	password?: string;
}

export default function Login() {
	const [formData, setFormData] = useState<Form>({
		username: "",
		password: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const { setProfile } = useProfile();
	const navigate = useNavigate();
	const { mutate, isPending } = useCustomMutation(authAPI.login, {
		onSuccess: (res) => {
			const { access_token, refresh_token, user } = res.data;
			addTokens({ access: access_token, refresh: refresh_token });
			setProfile(user);

			navigate("/chats");
		},
	});

	const validateForm = () => {
		const nextErrors: FormErrors = {};
		const username = sanitizeText(formData.username);
		const password = sanitizeText(formData.password);

		if (!username)
			nextErrors.username = getRequiredError(formData.username, "نام کاربری");
		if (!password)
			nextErrors.password = getRequiredError(formData.password, "رمز عبور");

		setErrors(nextErrors);
		return !nextErrors.username && !nextErrors.password;
	};

	const handleSubmit = () => {
		if (!validateForm()) return;

		const payload = {
			username: sanitizeText(formData.username),
			password: sanitizeText(formData.password),
		};

		mutate(payload);
	};

	const isFormFilled =
		!!sanitizeText(formData.username) && !!sanitizeText(formData.password);

	const handleChange = <K extends keyof Form>(key: K, value: Form[K]) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	return (
		<div className="flex flex-col gap-10 justify-center h-full">
			<p className="text-4xl font-bold text-primary-text text-center">ورود</p>
			<form
				id="login-form"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="text-primary-text flex flex-col gap-7">
				<div className="flex flex-col gap-2">
					<label className="font-semibold">نام کاربری</label>
					<input
						value={formData.username}
						onChange={(e) => handleChange("username", e.target.value)}
						autoComplete="username"
						maxLength={40}
						aria-invalid={Boolean(errors.username)}
						className={`px-2 border-2 rounded-md h-10 placeholder:text-text-muted text-[16px] outline-0 focus:border-accent transition-all duration-150 ${errors.username ? "border-red-500" : "border-border"}`}
						placeholder="نام کاربری یا ایمیل"
					/>
					{errors.username ? (
						<p className="text-sm text-red-500">{errors.username}</p>
					) : null}
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-semibold">رمز عبور</label>
					<input
						type="password"
						value={formData.password}
						onChange={(e) => handleChange("password", e.target.value)}
						autoComplete="current-password"
						maxLength={64}
						aria-invalid={Boolean(errors.password)}
						className={`px-2 border-2 rounded-md h-10 placeholder:text-text-muted text-[16px] outline-0 focus:border-accent transition-all duration-150 ${errors.password ? "border-red-500" : "border-border"}`}
					/>
					{errors.password ? (
						<p className="text-sm text-red-500">{errors.password}</p>
					) : null}
				</div>
			</form>
			<button
				disabled={!isFormFilled}
				type="submit"
				form="login-form"
				className={`px-5 h-12 rounded-full bg-primary-action active:bg-primary-text
				text-white cursor-pointer font-semibold text-xl transition-all duration-150
				disabled:pointer-events-none disabled:opacity-40 flex justify-center items-center
				${isPending ? "pointer-events-none" : ""}`}>
				{isPending ? (
					<LoaderCircle className="text-white animate-spin" />
				) : (
					"ورود"
				)}
			</button>
			<footer className="flex flex-col items-center">
				<p className="text-primary-action">قبلا حساب کاربری نساخته‌اید؟</p>
				<Link to="../signup" className="font-semibold text-accent">
					ثبت نام
				</Link>
			</footer>
		</div>
	);
}
