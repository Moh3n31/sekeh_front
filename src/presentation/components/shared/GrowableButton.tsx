import type { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"div"> {
	label: string;
	icon: React.ReactNode;
	variant: "destructable" | "primary";
	fullWidth: string;
}

export default function GrowableButton({
	label,
	icon,
	variant = "primary",
	fullWidth,
	...rest
}: Partial<ButtonProps>) {
	const variantColor: Record<ButtonProps["variant"], string> = {
		destructable: "primary-red",
		primary: "primary-action",
	};

	function getButtonClass() {
		const base =
			`group flex items-center justify-end h-10 w-10 hover:w-${fullWidth} cursor-pointer ` +
			`bg-surface hover:bg-${variantColor[variant]} border-2 border-${variantColor[variant]} rounded-full ` +
			"transition-all duration-200 ease-in-out overflow-hidden";
		return base;
	}

	return (
		<div className={getButtonClass()} {...rest}>
			<div className="flex items-center justify-center gap-2 min-w-max px-2">
				<span
					className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
					group-hover:pr-2 text-white transition-all duration-200 ease-in-out whitespace-nowrap font-medium">
					{label}
				</span>
				{icon}
			</div>
		</div>
	);
}
