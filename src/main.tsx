import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/styles/index.css";
import App from "@/app/App";

async function enableMocking() {
	if (import.meta.env.VITE_USE_MOCKS !== "true") return;

	const { worker } = await import("@/mocks/browser");
	await worker.start({
		onUnhandledRequest: "bypass",
		serviceWorker: {
			url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
		},
	});
}

void enableMocking().then(() => {
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
});
