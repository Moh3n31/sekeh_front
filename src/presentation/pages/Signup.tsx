import { Link, useNavigate } from "react-router";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { authAPI } from "../../services/authentication";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import {
	getPasswordError,
	getRequiredError,
	sanitizeText,
} from "../../utils/formValidation";

interface Form {
	username: string;
	password: string;
	confirm: string;
}

interface FormErrors {
	username?: string;
	password?: string;
	confirm?: string;
}

export default function Signup() {
	const [formData, setFormData] = useState<Form>({
		username: "",
		password: "",
		confirm: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const navigate = useNavigate();
	const { mutate, isPending } = useCustomMutation(authAPI.register, {
		onSuccess: () => navigate("/chats"),
	});

	const validateForm = () => {
		const nextErrors: FormErrors = {};
		const username = sanitizeText(formData.username);
		const password = sanitizeText(formData.password);
		const confirm = sanitizeText(formData.confirm);

		if (!username)
			nextErrors.username = getRequiredError(formData.username, "نام کاربری");
		if (!password)
			nextErrors.password = getRequiredError(formData.password, "رمز عبور");
		else if (getPasswordError(password))
			nextErrors.password = getPasswordError(password);
		if (!confirm)
			nextErrors.confirm = getRequiredError(formData.confirm, "تکرار رمز عبور");
		else if (password !== confirm)
			nextErrors.confirm = "رمز عبور و تکرار آن یکسان نیست.";

		setErrors(nextErrors);
		return !nextErrors.username && !nextErrors.password && !nextErrors.confirm;
	};

	const handleSubmit = () => {
		if (!validateForm()) return;

		mutate({
			password: sanitizeText(formData.password),
			username: sanitizeText(formData.username),
		});
	};

	const isFormFilled =
		!!sanitizeText(formData.username) &&
		!!sanitizeText(formData.password) &&
		!!sanitizeText(formData.confirm);

	const handleChange = <K extends keyof Form>(key: K, value: Form[K]) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	return (
		<div className="flex flex-col gap-10 justify-center h-full">
			<p className="text-4xl font-bold text-primary-text text-center">
				ثبت نام
			</p>
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
						maxLength={40}
						aria-invalid={Boolean(errors.username)}
						className={`px-2 border-2 rounded-md h-10 placeholder:text-text-muted text-[16px] outline-0 focus:border-accent transition-all duration-150 ${errors.username ? "border-red-500" : "border-border"}`}
					/>
					{errors.username ? (
						<p className="text-sm text-red-500">{errors.username}</p>
					) : null}
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-semibold">رمزعبور</label>
					<input
						type="password"
						value={formData.password}
						onChange={(e) => handleChange("password", e.target.value)}
						maxLength={64}
						aria-invalid={Boolean(errors.password)}
						className={`px-2 border-2 rounded-md h-10 placeholder:text-text-muted text-[16px] outline-0 focus:border-accent transition-all duration-150 ${errors.password ? "border-red-500" : "border-border"}`}
					/>
					{errors.password ? (
						<p className="text-sm text-red-500">{errors.password}</p>
					) : null}
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-semibold">تکرار رمزعبور</label>
					<input
						type="password"
						value={formData.confirm}
						onChange={(e) => handleChange("confirm", e.target.value)}
						maxLength={64}
						aria-invalid={Boolean(errors.confirm)}
						className={`px-2 border-2 rounded-md h-10 placeholder:text-text-muted text-[16px] outline-0 focus:border-accent transition-all duration-150 ${errors.confirm ? "border-red-500" : "border-border"}`}
					/>
					{errors.confirm ? (
						<p className="text-sm text-red-500">{errors.confirm}</p>
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
					"ادامه"
				)}
			</button>
			<footer className="flex flex-col items-center">
				<p className="text-primary-action">قبلا حساب کاربری ساخته‌اید؟</p>
				<Link to="../login" className="font-semibold text-accent">
					ورود
				</Link>
			</footer>
		</div>
	);
}
