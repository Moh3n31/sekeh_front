import { BrowserRouter } from "react-router";
import AllRoutes from "./presentation/AllRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function App() {
	const queryClient = new QueryClient();
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<div className="">
					<AllRoutes />
				</div>
			</QueryClientProvider>
		</BrowserRouter>
	);
}
