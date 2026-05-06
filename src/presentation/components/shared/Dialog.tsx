import type { ReactNode } from "react";

interface DialogProps {
	id: string;
	trigger: ReactNode;
	title: string;
	children: ReactNode;
	footer: ReactNode;
	triggerClass?: string;
}

export default function Dialog({
	id,
	trigger,
	title,
	children,
	footer,
	triggerClass,
}: DialogProps) {
	return (
		<>
			<button
				popoverTarget={id}
				className={`cursor-pointer ${triggerClass}`}>
				{trigger}
			</button>

			<div
				id={id}
				popover="auto"
				className="
          fixed inset-0 m-auto translate-y-20 opacity-0 transition-[transform,opacity,display] duration-300 allow-discrete
          open:translate-y-0 open:opacity-100
          w-[calc(100%-2rem)] md:max-w-130 h-fit max-h-[90vh]
          max-md:w-full max-md:h-full max-md:max-h-none max-md:m-0
          border-2 border-border rounded-lg bg-background shadow-2xl p-0
          backdrop:backdrop-blur-xs backdrop:bg-accent/5 backdrop:transition-opacity backdrop:duration-300
          backdrop:opacity-0 open:backdrop:opacity-100
        ">
				<div className="flex flex-col h-full overflow-hidden">
					<header className="flex items-center justify-between p-5 border-b border-border font-semibold text-lg">
						{title}
					</header>

					<main className="flex-1 overflow-y-auto p-5">{children}</main>

					<footer className="p-5 flex justify-end gap-3">{footer}</footer>
				</div>
			</div>
		</>
	);
}
