import { Link, useNavigate } from "react-router";
import LoadingIcon from "../../assets/icons/LoadingIcon";
import { useState } from "react";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { authAPI } from "../../services/authentication";
import useProfile from "../../services/profileStorage";
import { addTokens } from "../../utils/authTokens";

interface Form {
	username: string;
	password: string;
}

export default function Login() {
	const [formData, setFormData] = useState<Form>({
		username: "",
		password: "",
	});
	const { setProfile } = useProfile();
	const navigate = useNavigate();
	const { mutate, isPending } = useCustomMutation(authAPI.login);

	const handleSubmit = () => {
		mutate(formData, {
			onSuccess: (res) => {
				const { access_token, refresh_token, user } = res.data;
				addTokens({ access: access_token, refresh: refresh_token });
				setProfile(user);

				navigate("/chats");
			},
			onError: (err) => alert(err.message),
		});
	};

	const validate = !!(formData.username && formData.password);

	const handleChange = <K extends keyof Form>(key: K, value: Form[K]) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<div className="flex flex-col gap-10 justify-center h-full">
			<p className="text-4xl font-bold text-primary-text text-center">Login</p>
			<form
				id="login-form"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="text-primary-text flex flex-col gap-7">
				<div className="flex flex-col gap-2">
					<label className="font-semibold">Username</label>
					<input
						value={formData.username}
						onChange={(e) => handleChange("username", e.target.value)}
						className="px-2 border-2 border-border rounded-md h-10 placeholder:text-text-muted text-[16px]
            outline-0 focus:border-accent transition-all duration-150"
						placeholder="username or email"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-semibold">Password</label>
					<input
						value={formData.password}
						onChange={(e) => handleChange("password", e.target.value)}
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
				{isPending ? <LoadingIcon color="white" /> : "Login"}
			</button>
			<footer className="flex flex-col items-center">
				<p className="text-primary-action">Don't have an account?</p>
				<Link to="../signup" className="font-semibold text-accent">
					Signup
				</Link>
			</footer>
		</div>
	);
}
