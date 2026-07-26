import { useCallback, useEffect, useId, useMemo, type ReactNode } from "react";
import { X } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/cn";
import { useDialogContext } from "@/app/contexts/useDialogContext";

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
	onOpenChange?: (open: boolean) => void;
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
	onOpenChange,
	variant = "bottom",
}: DialogProps) {
	const titleId = useId();

	const { isOpen, DialogContent, setContent, openDialog, closeDialog } =
		useDialogContext();

	const sharedStyles = "fixed z-6 border-2 border-border bg-background";
	const desktop =
		"md:top-1/2 md:end-1/2 md:-translate-1/2 md:min-w-1/3 md:w-fit md:max-w-3/5 md:rounded-lg";
	const mobileFullscreen =
		"max-md:inset-0 max-md:rounded-none max-md:inset-x-0";
	const mobileWindow =
		"max-md:top-auto max-md:bottom-0 max-md:rounded-b-0 max-md:inset-x-0";

	const dialogContent = useMemo(
		() => (
			<div
				id="dialog-content"
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				className={cn(
					sharedStyles,
					desktop,
					variant === "fullscreen" ? mobileFullscreen : mobileWindow,
				)}>
				<header className="flex items-center justify-between border-b border-border p-5">
					<h2 id={titleId} className="text-lg font-semibold">
						{title}
					</h2>

					<Button
						type="button"
						onClick={closeDialog}
						variant="ghost"
						size="icon"
						aria-label="بستن پنجره">
						<X className="size-5" />
					</Button>
				</header>

				<main className="h-full overflow-y-auto p-5 scrollbar-white">
					{children}
				</main>

				{(footer || closeButton) && (
					<footer className="flex justify-end gap-3 border-t border-border p-5">
						{footer}

						{closeButton && <div onClick={closeDialog}>{closeButton}</div>}
					</footer>
				)}
			</div>
		),
		[children, closeButton, closeDialog, footer, title, titleId, variant],
	);

	const handleOpen = useCallback(() => {
		setContent(dialogContent);
		openDialog();

		onOpenChange?.(true);
		onOpen?.();
	}, [dialogContent, setContent, openDialog, onOpenChange, onOpen]);

	const handleClose = useCallback(() => {
		closeDialog();

		onOpenChange?.(false);
		onClose?.();
	}, [closeDialog, onOpenChange, onClose]);

	useEffect(() => {
		if (open === undefined) return;

		if (open && (!isOpen || !DialogContent)) {
			// open isn't think or content isn't set properly
			handleOpen();
		}

		if (!open && isOpen) {
			handleClose();
		}
	}, [open, isOpen, DialogContent, handleOpen, handleClose]);

	if (!trigger) {
		return null;
	}

	return (
		<span
			onClick={handleOpen}
			aria-haspopup="dialog"
			aria-expanded={isOpen}
			className={cn("cursor-pointer focus-visible:outline-none", triggerClass)}>
			{trigger}
		</span>
	);
}
