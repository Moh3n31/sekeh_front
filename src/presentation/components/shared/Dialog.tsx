interface DialogProps {
	id: string;
	footer: React.ReactNode;
	children: React.ReactNode;
	title: string;
}
export default function Dialog({ id, footer, children, title }: DialogProps) {
	return (
		<div
			id={id}
			popover="auto"
			className="backdrop:backdrop-blur-xs md:max-w-130 max-md:w-full border-2 border-border rounded-lg bg-background shadow-lg shadow-border backdrop:bg-accent-soft/20">
			<div className="flex flex-col md:h-full max-md:h-screen">
				<header className="font-semibold text-lg text-primary-text p-5 shadow-accent-soft/30 shadow-md">
					{title}
				</header>
				<main className="flex flex-col md:items-end max-md:items-center gap-8 h-full overflow-auto scrollbar-white p-5">
					{children}
					<footer className="flex items-center justify-end gap-3">{footer}</footer>
				</main>
			</div>
		</div>
	);
}
