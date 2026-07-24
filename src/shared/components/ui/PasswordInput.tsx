import { cn } from "@/shared/lib/cn";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type ComponentProps } from "react";

export interface PasswordInputProps
	extends Omit<ComponentProps<"input">, "type"> {
	label: string;
	error?: string;
	hint?: string;
}

export default function PasswordInput({
	id,
	label,
	error,
	hint,
	className,
	required,
	...props
}: PasswordInputProps) {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const descriptionId = `${inputId}-description`;
	const [isVisible, setIsVisible] = useState(false);

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

			<div className="relative">
				<input
					id={inputId}
					type={isVisible ? "text" : "password"}
					required={required}
					aria-invalid={Boolean(error)}
					aria-describedby={error || hint ? descriptionId : undefined}
					className={cn(
						"h-10 w-full rounded-md border-2 bg-background px-3 pe-11 text-base text-primary-text outline-none transition-colors placeholder:text-text-muted focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50",
						error ? "border-primary-red" : "border-border",
						className,
					)}
					{...props}
				/>
				<button
					type="button"
					onClick={() => setIsVisible((visible) => !visible)}
					aria-label={isVisible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
					aria-pressed={isVisible}
					className="absolute inset-y-0 end-0 flex w-10 cursor-pointer items-center justify-center rounded-e-md text-text-muted transition-colors hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent">
					{isVisible ? (
						<EyeOff className="size-5" aria-hidden="true" />
					) : (
						<Eye className="size-5" aria-hidden="true" />
					)}
				</button>
			</div>

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
