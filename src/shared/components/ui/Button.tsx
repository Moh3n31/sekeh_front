import { cn } from "@/shared/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "default" | "outline" | "destructive" | "ghost";
type ButtonSize = "default" | "sm" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
	default:
		"border-transparent bg-primary-action text-background hover:opacity-90",
	outline: "border-border bg-background text-primary-text hover:bg-surface",
	destructive: "border-transparent bg-primary-red text-white hover:opacity-90",
	ghost:
		"border-transparent bg-transparent text-text-muted hover:bg-surface hover:text-primary-text",
};

const sizeClasses: Record<ButtonSize, string> = {
	default: "h-10 px-4 py-2",
	sm: "h-9 px-3",
	icon: "size-9 p-0",
};

export default function Button({
	className,
	variant = "default",
	size = "default",
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={cn(
				"inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 text-sm font-semibold transition-[background-color_color_opacity] duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
				variantClasses[variant],
				sizeClasses[size],
				className,
			)}
			{...props}
		/>
	);
}
