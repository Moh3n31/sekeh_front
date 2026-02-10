import type {ComponentProps, ReactNode } from "react";

interface ButtonProps extends ComponentProps<"button"> {
	variant: "primary" | "secondary" | "link";
	children: ReactNode;
}

export default function Button({
	variant = "secondary",
	children,
  className = "",
	...rest
}: Partial<ButtonProps>) {
	const variantStyles: Record<ButtonProps["variant"], string> = {
		primary: "",
		secondary: "",
		link: "",
	};

	return (
		<button {...rest} className={`h-full w-full ${variantStyles[variant]} ${className}`}>
			{children}
		</button>
	);
}
