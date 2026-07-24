export const sanitizeText = (value: string) => value.trim();

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 40;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

export const isEmail = (value: string) => {
	const normalized = sanitizeText(value);
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
};

export const getUsernameError = (
	value: string,
	options: { allowEmail?: boolean } = {},
) => {
	const normalized = sanitizeText(value);
	const { allowEmail = false } = options;

	if (!normalized) return "نام کاربری الزامی است.";
	if (allowEmail && normalized.includes("@")) {
		return isEmail(normalized) ? "" : "لطفاً یک ایمیل معتبر وارد کنید.";
	}
	if (normalized.length < USERNAME_MIN_LENGTH) {
		return `نام کاربری باید حداقل ${USERNAME_MIN_LENGTH} کاراکتر باشد.`;
	}
	if (normalized.length > USERNAME_MAX_LENGTH) {
		return `نام کاربری نمی‌تواند بیشتر از ${USERNAME_MAX_LENGTH} کاراکتر باشد.`;
	}
	if (!/^[\p{L}]/u.test(normalized)) {
		return "نام کاربری باید با یک حرف شروع شود.";
	}
	if (!/[\p{L}\p{N}]$/u.test(normalized)) {
		return "نام کاربری باید با حرف یا عدد پایان یابد.";
	}
	if (!/^[\p{L}\p{N}._-]+$/u.test(normalized)) {
		return "فقط حروف، اعداد، نقطه، خط تیره و زیرخط مجاز هستند.";
	}
	return "";
};

export const getRequiredError = (value: string, label = "این فیلد") => {
	if (!sanitizeText(value)) return `${label} الزامی است.`;
	return "";
};

export const getEmailError = (value: string) => {
	const normalized = sanitizeText(value);
	if (!normalized) return "ایمیل الزامی است.";
	if (!isEmail(normalized)) return "لطفاً یک ایمیل معتبر وارد کنید.";
	return "";
};

export interface PasswordRuleState {
	hasValidLength: boolean;
	hasLetter: boolean;
	hasNumber: boolean;
	hasNoWhitespace: boolean;
}

export const getPasswordRuleState = (value: string): PasswordRuleState => ({
	hasValidLength:
		value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH,
	hasLetter: /\p{L}/u.test(value),
	hasNumber: /\p{N}/u.test(value),
	hasNoWhitespace: !/\s/u.test(value),
});

export const getPasswordError = (value: string) => {
	if (!value) return "رمز عبور الزامی است.";

	const rules = getPasswordRuleState(value);
	if (!rules.hasValidLength) {
		return `رمز عبور باید بین ${PASSWORD_MIN_LENGTH} تا ${PASSWORD_MAX_LENGTH} کاراکتر باشد.`;
	}
	if (!rules.hasNoWhitespace) return "رمز عبور نباید شامل فاصله باشد.";
	if (!rules.hasLetter || !rules.hasNumber) {
		return "رمز عبور باید شامل حروف و اعداد باشد.";
	}
	return "";
};

export const sanitizePhoneInput = (value: string) => {
	const withoutSpaces = value.replace(/\s+/g, "");
	if (!withoutSpaces) return "";

	if (withoutSpaces.startsWith("+")) {
		return "+" + withoutSpaces.slice(1).replace(/\D/g, "");
	}

	return withoutSpaces.replace(/\D/g, "");
};

export const parsePhoneNumber = (value: string): string | null => {
	const sanitized = sanitizePhoneInput(value);
	if (!sanitized) return null;

	const digitsOnly = sanitized.replace(/^\+/, "");
	if (digitsOnly.length < 7 || digitsOnly.length > 15) return null;

	const parsed = Number(sanitized);
	return Number.isFinite(parsed) ? sanitized : null;
};

export const getPhoneError = (value: string) => {
	const normalized = sanitizeText(value);
	if (!normalized) return "شماره تلفن الزامی است.";

	const sanitized = sanitizePhoneInput(normalized);
	if (!sanitized) return "شماره تلفن معتبر وارد کنید.";

	const digitsOnly = sanitized.replace(/^\+/, "");
	if (digitsOnly.length < 7 || digitsOnly.length > 15) {
		return "شماره تلفن باید بین 7 تا 15 رقم باشد.";
	}

	return "";
};
