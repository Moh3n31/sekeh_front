import type { LucideIcon } from "lucide-react";

interface Props {
	icon: LucideIcon;
	title: string;
	desc: string;
}

export default function PageTitle({ desc, icon: Icon, title }: Props) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex items-center justify-center shrink-0 rounded-full size-12 bg-linear-30 from-accent-hover to-match">
				<Icon className="size-6 text-background" />
			</div>
			<div>
				<p className="font-semibold text-2xl text-primary-text">{title}</p>
				<p className="text-text-muted">{desc}</p>
			</div>
		</div>
	);
}
