import { useState } from "react";
import type { ComponentProps, ChangeEvent } from "react";
import { cn } from "@/shared/lib/cn";

export interface InputProps extends ComponentProps<"input"> {
	label?: string;
	validation?: string;
}

export default function Input({
	type = "text",
	required = false,
	label = "",
	validation = "",
	pattern,
	onChange,
	className,
	id,
	...rest
}: InputProps) {
	const [isValid, setIsValid] = useState<boolean>(true);
	const inputId = id ?? rest.name;

	const validate = (value: string) => {
		if (!pattern) return;

		let regex: RegExp;
		try {
			regex = new RegExp(pattern);
		} catch {
			console.warn("Invalid RegExp pattern:", pattern);
			return;
		}

		setIsValid(regex.test(value));
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		validate(event.target.value);
		onChange?.(event);
	};

	return (
		<div className="flex flex-col gap-2">
			{label && (
				<div className="flex gap-3">
					<label htmlFor={inputId}>{label}</label>
					{required && <span className="text-primary-red">*</span>}
				</div>
			)}

			<input
				{...rest}
				id={inputId}
				type={type}
				required={required}
				onChange={handleChange}
				pattern={pattern}
				aria-invalid={!isValid}
				className={cn(
					"h-10 w-full rounded-md border-2 border-border bg-background px-3 text-primary-text outline-none transition-colors placeholder:text-text-muted focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
					!isValid && "border-primary-red",
					className,
				)}
			/>

			{!isValid && validation && (
				<span className="text-sm text-primary-red">{validation}</span>
			)}
		</div>
	);
}
