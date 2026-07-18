import { BrowserRouter } from "react-router";
import AllRoutes from "./presentation/AllRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastContainer from "./presentation/components/shared/ToastContainer";

export default function App() {
	const queryClient = new QueryClient();
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<div dir="rtl">
					<AllRoutes />
				</div>
				<ToastContainer />
			</QueryClientProvider>
		</BrowserRouter>
	);
}
