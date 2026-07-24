import { cn } from "@/shared/lib/cn";
import { useId, type ComponentProps } from "react";

export interface InputProps extends ComponentProps<"input"> {
	label: string;
	error?: string;
	hint?: string;
}

export default function Input({
	id,
	label,
	error,
	hint,
	className,
	required,
	...props
}: InputProps) {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const descriptionId = `${inputId}-description`;

	return (
		<div className="flex w-full flex-col gap-2">
			<label htmlFor={inputId} className="font-semibold text-primary-text">
				{label}
				{required ? (
					<span className="ms-1 text-primary-red" aria-hidden="true">
						*
					</span>
				) : null}
			</label>

			<input
				id={inputId}
				required={required}
				aria-invalid={Boolean(error)}
				aria-describedby={error || hint ? descriptionId : undefined}
				className={cn(
					"h-10 w-full rounded-md border-2 bg-background px-3 text-base text-primary-text outline-none transition-colors placeholder:text-text-muted focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
					error ? "border-primary-red" : "border-border",
					className,
				)}
				{...props}
			/>

			{error || hint ? (
				<p
					id={descriptionId}
					className={cn(
						"text-sm",
						error ? "text-primary-red" : "text-text-muted",
					)}>
					{error ?? hint}
				</p>
			) : null}
		</div>
	);
}
