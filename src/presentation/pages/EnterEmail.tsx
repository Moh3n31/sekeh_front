import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getEmailError, sanitizeText } from "../../utils/formValidation";

export default function EnterEmail() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");

	function handleSubmit() {
		const normalizedEmail = sanitizeText(email);
		const nextError = getEmailError(normalizedEmail);
		setError(nextError);

		if (nextError) return;
		navigate("../signup");
	}

	return (
		<div className="flex flex-col gap-10 justify-center h-full">
			<p className="text-4xl font-bold text-primary-text text-center">ثبت‌نام</p>
			<form
				id="login-form"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="text-primary-text flex flex-col gap-7">
				<div className="flex flex-col gap-2">
					<label className="font-semibold">ایمیل</label>
					<input
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setError("");
						}}
						maxLength={80}
						aria-invalid={Boolean(error)}
						className={`px-2 border-2 rounded-md h-10 placeholder:text-text-muted text-[16px] outline-0 focus:border-accent transition-all duration-150 ${error ? "border-red-500" : "border-border"}`}
						placeholder="example@gmail.com"
					/>
					{error ? <p className="text-sm text-red-500">{error}</p> : null}
				</div>
			</form>
			<button
				type="submit"
				form="login-form"
				className="px-5 py-2 rounded-full bg-primary-action active:bg-primary-text text-white cursor-pointer font-semibold text-xl transition-all duration-150 disabled:opacity-40"
				disabled={!sanitizeText(email)}>
				ادامه
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
