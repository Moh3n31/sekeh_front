export const sanitizeText = (value: string) => value.trim();

export const isEmail = (value: string) => {
	const normalized = sanitizeText(value);
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
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

export const getPasswordError = (value: string) => {
	const normalized = sanitizeText(value);
	if (!normalized) return "رمز عبور الزامی است.";
	if (normalized.length < 8) return "رمز عبور باید حداقل 8 کاراکتر باشد.";
	if (!/[A-Za-z]/.test(normalized) || !/\d/.test(normalized)) {
		return "رمز عبور باید شامل حروف و عدد باشد.";
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

export const parsePhoneNumber = (value: string): number | null => {
	const sanitized = sanitizePhoneInput(value);
	if (!sanitized) return null;

	const digitsOnly = sanitized.replace(/^\+/, "");
	if (digitsOnly.length < 7 || digitsOnly.length > 15) return null;

	const parsed = Number(sanitized);
	return Number.isFinite(parsed) ? parsed : null;
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
