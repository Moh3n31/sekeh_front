import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { BrowserRouter } from "react-router";

export default function AppProviders({ children }: PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						retry: 1,
					},
				},
			}),
	);

	return (
		<BrowserRouter basename={import.meta.env.VITE_BASE_FRONT_URL}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</BrowserRouter>
	);
}
