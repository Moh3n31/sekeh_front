export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastPayload {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
}

const emit = (payload: Omit<ToastPayload, "id">) => {
	window.dispatchEvent(
		new CustomEvent<ToastPayload>("app-toast", {
			detail: {
				id: crypto.randomUUID(),
				duration: 4000,
				...payload,
			},
		}),
	);
};

export const toast = {
	success: (message: string, duration?: number) =>
		emit({ type: "success", message, duration }),

	error: (message: string, duration?: number) =>
		emit({ type: "error", message, duration }),

	warning: (message: string, duration?: number) =>
		emit({ type: "warning", message, duration }),

	info: (message: string, duration?: number) =>
		emit({ type: "info", message, duration }),
};
