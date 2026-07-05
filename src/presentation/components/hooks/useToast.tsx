import Toast from "../shared/ToastContainer";

function popToast() {
	const container = document.getElementById("main-container");

	if (container) {
		let body = container.innerHTML;
		body += <Toast />;
		container.innerHTML = body;
	}
}

export default function useToast() {
	return popToast;
}
