import { useState } from "react";
import type { ComponentProps, ChangeEvent } from "react";

interface InputProps extends ComponentProps<"input"> {
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
	...rest
}: InputProps) {
	const [isValid, setIsValid] = useState<boolean>(true);

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
					<label>{label}</label>
					{required && <span className="text-red-2">*</span>}
				</div>
			)}

			<input
				{...rest}
				type={type}
				required={required}
				onChange={handleChange}
				pattern={pattern}
				className={`border-2 outline-0 ${!isValid? "border-red-2" : ""}`}
			/>

			{!isValid && validation && (
				<span className="text-red-2 font-sm">{validation}</span>
			)}
		</div>
	);
}
