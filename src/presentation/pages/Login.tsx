import { Link } from "react-router";

export default function Login() {
	return (
		<div className="flex flex-col gap-10 justify-center h-full">
			<p className="text-4xl font-bold text-primary-text text-center">Login</p>
			<form
				id="login-form"
				onSubmit={(e) => e.preventDefault()}
				className="text-primary-text flex flex-col gap-7">
				<div className="flex flex-col gap-2">
					<label className="font-semibold">Username</label>
					<input
						className="px-2 border-2 border-border rounded-md h-10 placeholder:text-text-muted text-[16px]
            outline-0 focus:border-accent transition-all duration-150"
						placeholder="username or email"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-semibold">Password</label>
					<input
						className="px-2 border-2 border-border rounded-md h-10 placeholder:text-text-muted text-[16px]
            outline-0 focus:border-accent transition-all duration-150"
					/>
				</div>
			</form>
			<button
				type="submit"
				form="login-form"
				className="px-5 py-2 rounded-full bg-primary-action active:bg-primary-text
        text-white cursor-pointer font-semibold text-xl transition-all duration-150">
				Login
			</button>
			<footer className="flex flex-col items-center">
				<p className="text-primary-action">Don't have an account?</p>
				<Link to="../enter-email" className="font-semibold text-accent">
					Signup
				</Link>
			</footer>
		</div>
	);
}
