import { useRef, type ReactNode } from "react";

interface DialogProps {
	trigger: ReactNode;
	title: string;
	children: ReactNode;
	footer: ReactNode;
	triggerClass?: string;
	closeButton?: ReactNode;
}

export default function Dialog({
	trigger,
	title,
	children,
	footer,
	triggerClass,
	closeButton,
}: DialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const open = () => dialogRef.current?.showModal();
	const close = () => dialogRef.current?.close();

	return (
		<>
			<button onClick={open} className={`cursor-pointer ${triggerClass}`}>
				{trigger}
			</button>

			<dialog
				ref={dialogRef}
				onClose={close}
				onClick={(e) => {
					if (e.target === dialogRef.current) close();
				}}
				className="
					fixed inset-0 m-auto z-50
					translate-y-5 opacity-0 transition-[transform,opacity,display] duration-300 allow-discrete
					open:translate-y-0 open:opacity-100
					w-[calc(100%-2rem)] md:max-w-130 h-fit max-h-[90vh]
					max-md:w-full max-md:h-full max-md:max-h-none max-md:m-0
					border-2 border-border rounded-lg bg-background shadow-2xl p-0
					backdrop:fixed backdrop:inset-0 backdrop:z-999!
					backdrop:bg-accent/10
					backdrop:transition-opacity backdrop:duration-300
					backdrop:opacity-0 open:backdrop:opacity-100
				">
				{/* + backdrop:backdrop-blur-xs */}
				<div className="flex flex-col h-full overflow-hidden">
					<header className="flex items-center justify-between p-5 border-b border-border font-semibold text-lg">
						{title}
						<button
							onClick={close}
							className="cursor-pointer text-text-muted hover:text-primary-text transition-colors duration-150 text-2xl leading-none">
							&times;
						</button>
					</header>

					<main className="flex-1 overflow-y-auto p-5">{children}</main>

					<footer className="p-5 flex justify-end gap-3">
						{footer}
						<div onClick={close}>{closeButton && closeButton}</div>
					</footer>
				</div>
			</dialog>
		</>
	);
}
