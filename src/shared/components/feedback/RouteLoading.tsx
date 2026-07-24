import { LoaderCircle } from "lucide-react";

export default function RouteLoading() {
	return (
		<div
			className="flex min-h-48 w-full items-center justify-center text-text-muted"
			role="status"
			aria-live="polite">
			<LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
			<span className="sr-only">در حال بارگذاری</span>
		</div>
	);
}
