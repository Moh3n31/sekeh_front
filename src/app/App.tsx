import AppProviders from "@/app/providers/AppProviders";
import AppRouter from "@/app/router/AppRouter";
import ToastContainer from "@/shared/components/feedback/ToastContainer";
import DialogProvider from "./providers/DialogProvider";

export default function App() {
	return (
		<AppProviders>
			<div dir="rtl">
				<DialogProvider>
					<AppRouter />
				</DialogProvider>
				<ToastContainer />
			</div>
		</AppProviders>
	);
}
