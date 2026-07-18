import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ToastPayload } from "../../../services/toast";

export default function ToastContainer() {
	const [toasts, setToasts] = useState<ToastPayload[]>([]);

	useEffect(() => {
		const handler = (event: Event) => {
			const customEvent = event as CustomEvent<ToastPayload>;
			const toast = customEvent.detail;

			setToasts((prev) => [...prev, toast]);

			setTimeout(() => {
				setToasts((prev) => prev.filter((item) => item.id !== toast.id));
			}, toast.duration ?? 4000);
		};

		window.addEventListener("app-toast", handler);

		return () => {
			window.removeEventListener("app-toast", handler);
		};
	}, []);

	const getStyles = (type: ToastPayload["type"]) => {
		switch (type) {
			case "success":
				return "border-informational bg-informational/10 text-informational";

			case "error":
				return "border-primary-red bg-primary-red/10 text-primary-red";

			case "warning":
				return "border-primary-action bg-primary-action/10 text-primary-action";

			default:
				return "border-accent bg-accent/10 text-accent";
		}
	};

	return (
		<div
			dir="rtl"
			className="pointer-events-none fixed end-4 bottom-4 z-1000 flex w-full max-w-sm flex-col gap-3">
			<AnimatePresence>
				{toasts.map((toast) => (
					<motion.div
						key={toast.id}
						initial={{
							opacity: 0,
							x: 100,
						}}
						animate={{
							opacity: 1,
							x: 0,
						}}
						exit={{
							opacity: 0,
							x: 100,
						}}
						transition={{
							duration: 0.25,
						}}
						className={`pointer-events-auto rounded-xl border-2 px-4 py-3 backdrop-blur-md ${getStyles(
							toast.type,
						)}`}>
						<p className="text-sm text-start font-medium">{toast.message}</p>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
