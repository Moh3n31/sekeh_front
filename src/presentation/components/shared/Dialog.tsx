import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";

interface DialogProps {
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
					className={`cursor-pointer ${triggerClass}`}>
					{trigger}
				</button>
			)}

			<dialog
				ref={dialogRef}
				className={`
					fixed inset-0 z-50 md:m-auto overflow-hidden border-2 border-border bg-background shadow-2xl p-0
					backdrop:bg-accent/10 backdrop:backdrop-blur-[1px]
					md:max-h-[75vh] md:min-w-1/3 md:w-fit md:max-w-3/5 md:rounded-lg max-md:rounded-t-lg
					${
						isFullscreen
							? "max-md:w-screen max-md:h-screen max-md:max-h-screen max-md:rounded-none"
							: "max-md:w-full max-md:max-h-[90vh] mt-auto"
					}`}
				onClose={handleDialogClose}
				onClick={(e) => {
					if (e.target === dialogRef.current) {
						closeDialog();
					}
				}}>
				<div className="flex flex-col w-full h-full overflow-hidden">
					<header className="flex items-center justify-between border-b border-border p-5 font-semibold text-lg">
						{title}
						<button
							onClick={closeDialog}
							className="cursor-pointer text-2xl leading-none text-text-muted transition-colors duration-150 hover:text-primary-text">
							&times;
						</button>
					</header>

					<main className="flex-1 overflow-y-auto p-5">{children}</main>

					<footer className="flex justify-end gap-3 border-t border-border p-5">
						{footer}
						<div onClick={closeDialog}>{closeButton && closeButton}</div>
					</footer>
				</div>
			</dialog>
		</>
	);
}
