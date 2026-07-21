interface PaginationProps {
	page: number;
	pages: number;
	onChange: (page: number) => void;
}

export default function Pagination({ page, pages, onChange }: PaginationProps) {
	if (pages <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-2 pt-4">
			<button
				disabled={page <= 1}
				onClick={() => onChange(page - 1)}
				className="size-8 rounded-full border-2 border-border text-primary-action disabled:opacity-30 disabled:pointer-events-none
				hover:bg-accent-soft transition-all duration-150 cursor-pointer">
				‹
			</button>

			<span className="text-[14px] text-text-muted font-medium px-2">
				{page} / {pages}
			</span>

			<button
				disabled={page >= pages}
				onClick={() => onChange(page + 1)}
				className="size-8 rounded-full border-2 border-border text-primary-action disabled:opacity-30 disabled:pointer-events-none
				hover:bg-accent-soft transition-all duration-150 cursor-pointer">
				›
			</button>
		</div>
	);
}