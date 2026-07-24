import {
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { X } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/cn";

export interface DialogProps {
	trigger?: ReactNode;
	title: string;
	children: ReactNode;
	footer?: ReactNode;
	triggerClass?: string;
	closeButton?: ReactNode;
	open?: boolean;
	onClose?: () => void;
	onOpen?: () => void;
	variant?: "bottom" | "fullscreen";
}

export default function Dialog({
	trigger,
	title,
	children,
	footer,
	triggerClass,
	closeButton,
	open,
	onClose,
	onOpen,
	variant = "bottom",
}: DialogProps) {
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const titleId = useId();
	const [internalOpen, setInternalOpen] = useState(false);
	const isFullscreen = variant === "fullscreen";
	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;

	const openDialog = useCallback(() => {
		if (!isControlled) {
			setInternalOpen(true);
		}
		onOpen?.();
	}, [isControlled, onOpen]);

	const closeDialog = useCallback(() => {
		dialogRef.current?.close();
		if (!isControlled) {
			setInternalOpen(false);
		}
		onClose?.();
	}, [isControlled, onClose]);

	useEffect(() => {
		if (!dialogRef.current) return;

		if (isOpen && !dialogRef.current.open) {
			dialogRef.current.showModal();
		}
		if (!isOpen && dialogRef.current.open) {
			dialogRef.current.close();
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeDialog();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen, closeDialog]);

	const handleDialogClose = () => {
		if (!isControlled) {
			setInternalOpen(false);
		}
		onClose?.();
	};

	return (
		<>
			{trigger && (
				<button
					type="button"
					onClick={openDialog}
					aria-haspopup="dialog"
					aria-expanded={isOpen}
					className={cn(
						"cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
						triggerClass,
					)}>
					{trigger}
				</button>
			)}

			<dialog
				ref={dialogRef}
				aria-labelledby={titleId}
				className={cn(
					"fixed inset-0 z-50 overflow-hidden border-2 border-border bg-background p-0 shadow-2xl backdrop:bg-accent/10 backdrop:backdrop-blur-[1px] md:m-auto md:max-h-[75vh] md:min-w-1/3 md:w-fit md:max-w-3/5 md:rounded-lg max-md:mt-auto max-md:rounded-t-lg",
					isFullscreen
						? "max-md:h-screen max-md:max-h-screen max-md:w-screen max-md:rounded-none"
						: "max-md:max-h-[90vh] max-md:w-full",
				)}
				onCancel={(event) => {
					event.preventDefault();
					closeDialog();
				}}
				onClose={handleDialogClose}
				onClick={(e) => {
					if (e.target === dialogRef.current) {
						closeDialog();
					}
				}}>
				<div className="flex flex-col w-full h-full overflow-hidden">
					<header className="flex items-center justify-between border-b border-border p-5">
						<h2 id={titleId} className="text-lg font-semibold">
							{title}
						</h2>
						<Button
							onClick={closeDialog}
							variant="ghost"
							size="icon"
							aria-label="بستن پنجره">
							<X className="size-5" />
						</Button>
					</header>

					<main className="flex-1 overflow-y-auto p-5">{children}</main>

					{(footer || closeButton) && (
						<footer className="flex justify-end gap-3 border-t border-border p-5">
							{footer}
							{closeButton && (
								<div onClick={closeDialog}>{closeButton}</div>
							)}
						</footer>
					)}
				</div>
			</dialog>
		</>
	);
}
