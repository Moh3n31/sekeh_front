import type { ToastProps } from "../shared/ToastContainet";
import Toast from "../shared/ToastContainet";

function popToast({ id, message, type }: ToastProps) {
	const container = document.getElementById("main-container");

	if (container) {
		let body = container.innerHTML;
		body += <Toast id={id} message={message} type={type} />;
		container.innerHTML = body;
	}
}

export default function useToast() {
	return popToast;
}
