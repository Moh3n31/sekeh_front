import { useNavigate } from "react-router";

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-5 items-center justify-center h-screen bg-accent-soft">
			<p className="font-semibold text-5xl text-accent">404</p>
			<p className="font-medium text-3xl text-primary-action">Page Not Found</p>
			<button
				onClick={() => navigate("/")}
				className="border-b-2 border-b-accent-hover text-accent-hover
				cursor-pointer">
				Go Back
			</button>
		</div>
	);
}
