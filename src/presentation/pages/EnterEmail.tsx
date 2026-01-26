import { Link, useNavigate } from "react-router";

export default function EnterEmail() {
	const navigate = useNavigate();

	function handleSubmit() {
		navigate("../signup");
	}
	return (
		<div className="flex flex-col gap-10 justify-center h-full">
			<p className="text-4xl font-bold text-primary-text text-center">Signup</p>
			<form
				id="login-form"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="text-primary-text flex flex-col gap-7">
				<div className="flex flex-col gap-2">
					<label className="font-semibold">Email</label>
					<input
						className="px-2 border-2 border-border rounded-md h-10 placeholder:text-text-muted text-[16px]
            outline-0 focus:border-accent transition-all duration-150"
						placeholder="example@gmail.com"
					/>
				</div>
			</form>
			<button
				type="submit"
				form="login-form"
				className="px-5 py-2 rounded-full bg-primary-action active:bg-primary-text
        text-white cursor-pointer font-semibold text-xl transition-all duration-150">
				Continue
			</button>
			<footer className="flex flex-col items-center">
				<p className="text-primary-action">Already have an account?</p>
				<Link to="../login" className="font-semibold text-accent">
					Login
				</Link>
			</footer>
		</div>
	);
}
