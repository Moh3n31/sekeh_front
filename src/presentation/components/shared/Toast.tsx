import BalloonIcon from "../../../assets/icons/BalloonIcon";

export interface ToastProps {
	id: string;
	message: string;
	type?: "error" | "success" | "notification";
}

export default function Toast({
	id,
	message,
	type = "notification",
}: ToastProps) {
	function titleStyles() {
		const base = {
			notification: "text-primary-text",
			error: "text-primary-red",
			success: "text-informational-hover",
		};
		return base[type];
	}
	function IconStyles() {
		const base = {
			notification: "[&>g>path]:stroke-primary-text",
			error: "[&>g>path]:stroke-primary-red",
			success: "[&>g>path]:stroke-informational-hover",
		};
		return base[type];
	}

	return (
		<div
			id={id}
			className="fixed top-10 right-0 w-fit border-2 border-border rounded-lg bg-background shadow-sm shadow-border">
			<div className="flex items-center gap-5 size-full px-3 py-2">
				<BalloonIcon className={`size-5.5 ${IconStyles()}`} />
				<p className={`font-semibold text-[16px] ${titleStyles()}`}>
					{message}
				</p>
			</div>
		</div>
	);
}
