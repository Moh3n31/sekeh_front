import {
	PASSWORD_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	getPasswordRuleState,
} from "@/shared/lib/formValidation";
import { Check, Circle } from "lucide-react";

interface PasswordRequirementsProps {
	value: string;
}

export default function PasswordRequirements({
	value,
}: PasswordRequirementsProps) {
	const rules = getPasswordRuleState(value);
	const requirements = [
		{
			label: `بین ${PASSWORD_MIN_LENGTH} تا ${PASSWORD_MAX_LENGTH} کاراکتر`,
			isMet: rules.hasValidLength,
		},
		{ label: "حداقل یک حرف", isMet: rules.hasLetter },
		{ label: "حداقل یک عدد", isMet: rules.hasNumber },
		{ label: "بدون فاصله", isMet: rules.hasNoWhitespace },
	];

	return (
		<ul
			className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2"
			aria-label="قوانین رمز عبور">
			{requirements.map((requirement) => (
				<li
					key={requirement.label}
					className={
						requirement.isMet ? "text-informational" : "text-text-muted"
					}>
					<span className="flex items-center gap-1.5">
						{requirement.isMet ? (
							<Check className="size-3.5" aria-hidden="true" />
						) : (
							<Circle className="size-3.5" aria-hidden="true" />
						)}
						{requirement.label}
					</span>
				</li>
			))}
		</ul>
	);
}
