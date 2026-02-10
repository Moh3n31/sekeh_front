import type { ToastProps } from "../shared/Toast";
import Toast from "../shared/Toast";

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
