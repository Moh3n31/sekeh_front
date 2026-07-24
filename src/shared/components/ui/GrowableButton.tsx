import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

interface GrowableButtonProps extends ComponentProps<"button"> {
	label: string;
	icon: React.ReactNode;
	variant?: "destructive" | "primary";
}

export default function GrowableButton({
	label,
	icon,
	variant = "primary",
	className,
	type = "button",
	...rest
}: GrowableButtonProps) {
	return (
		<button
			type={type}
			className={cn(
				"group flex h-10 w-10 cursor-pointer items-center justify-end overflow-hidden rounded-full border-2 bg-surface transition-all duration-200 ease-in-out hover:w-36 focus-visible:w-36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
				variant === "destructive"
					? "border-primary-red hover:bg-primary-red"
					: "border-primary-action hover:bg-primary-action",
				className,
			)}
			{...rest}>
			<div className="flex items-center justify-center gap-2 min-w-max px-2">
				<span
					className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
					group-hover:pe-2 group-focus-visible:max-w-xs group-focus-visible:pe-2 group-focus-visible:opacity-100 text-white transition-all duration-200 ease-in-out whitespace-nowrap font-medium">
					{label}
				</span>
				{icon}
			</div>
		</button>
	);
}
