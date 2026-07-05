import { Link, useNavigate } from "react-router";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { authAPI } from "../../services/authentication";
import { useState } from "react";
import LoadingIcon from "../../assets/icons/LoadingIcon";

interface Form {
	username: string;
	password: string;
	confirm: string;
}

export default function Signup() {
	const [fomrData, setFormData] = useState<Form>({
		username: "",
		password: "",
		confirm: "",
	});
	const navigate = useNavigate();
	const { mutate, isPending } = useCustomMutation(authAPI.register);

	const handleSubmit = () => {
		mutate(
			{ password: fomrData.password, username: fomrData.username },
			{
				onSuccess: () => navigate("/chats"),
				onError: (err) => alert(err.message),
			},
		);
	};

	const validate = !!(
		fomrData.username &&
		fomrData.password &&
		fomrData.confirm === fomrData.password
	);

	const handleChange = <K extends keyof Form>(key: K, value: Form[K]) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<div className="flex flex-col gap-10 justify-center h-full">
			<p className="text-4xl font-bold text-primary-text text-center">ثبت نام</p>
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
						value={fomrData.username}
						onChange={(e) => handleChange("username", e.target.value)}
						className="px-2 border-2 border-border rounded-md h-10 placeholder:text-text-muted text-[16px]
            outline-0 focus:border-accent transition-all duration-150"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-semibold">رمزعبور</label>
					<input
						value={fomrData.password}
						onChange={(e) => handleChange("password", e.target.value)}
						className="px-2 border-2 border-border rounded-md h-10 placeholder:text-text-muted text-[16px]
            outline-0 focus:border-accent transition-all duration-150"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-semibold">تکرار رمزعبور</label>
					<input
						value={fomrData.confirm}
						onChange={(e) => handleChange("confirm", e.target.value)}
						className="px-2 border-2 border-border rounded-md h-10 placeholder:text-text-muted text-[16px]
            outline-0 focus:border-accent transition-all duration-150"
					/>
				</div>
			</form>
			<button
				disabled={!validate}
				type="submit"
				form="login-form"
				className={`px-5 h-12 rounded-full bg-primary-action active:bg-primary-text
        text-white cursor-pointer font-semibold text-xl transition-all duration-150
				disabled:pointer-events-none disabled:opacity-40 flex justify-center items-center
				${isPending ? "pointer-events-none" : ""}`}>
				{isPending ? <LoadingIcon color="white" /> : "ادامه"}
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
