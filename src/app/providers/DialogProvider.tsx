import { useState, useCallback, useRef, useEffect } from "react";
import { DialogContext } from "../contexts/useDialogContext";

export default function DialogProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const dialogRef = useRef<HTMLDivElement | null>(null);

	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState<React.ReactNode | null>(null);

	const openDialog = useCallback(() => setIsOpen(true), []);
	const closeDialog = useCallback(() => {
		setContent(null);
		setIsOpen(false);
	}, []);

	useEffect(() => {
		if (!isOpen) return;

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeDialog();
			}
		};

		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, closeDialog]);

	return (
		<DialogContext.Provider
			value={{
				isOpen,
				openDialog,
				closeDialog,
				setContent,
				DialogContent: content,
			}}>
			{children}

			{isOpen && !!content && (
				<div ref={dialogRef} id="dialog-element" className="fixed inset-0 z-5">
					<div
						onClick={closeDialog}
						className="fixed inset-0 bg-accent/10 backdrop-blur-[2px]"
						aria-hidden="true"
					/>

					<div className="relative z-10">{content}</div>
				</div>
			)}
		</DialogContext.Provider>
	);
}
