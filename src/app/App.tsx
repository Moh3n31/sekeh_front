import AppProviders from "@/app/providers/AppProviders";
import AppRouter from "@/app/router/AppRouter";
import ToastContainer from "@/shared/components/feedback/ToastContainer";

export default function App() {
	return (
		<AppProviders>
			<div dir="rtl">
				<AppRouter />
			</div>
			<ToastContainer />
		</AppProviders>
	);
}
