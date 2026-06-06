import { BrowserRouter } from "react-router";
import AllRoutes from "./presentation/AllRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastContainer from "./presentation/components/shared/ToastContainet";

export default function App() {
	const queryClient = new QueryClient();
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<AllRoutes />
				<ToastContainer />
			</QueryClientProvider>
		</BrowserRouter>
	);
}
