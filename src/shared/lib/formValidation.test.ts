import { describe, expect, it } from "vitest";
import {
	getPasswordError,
	getPasswordRuleState,
	getUsernameError,
} from "@/shared/lib/formValidation";

describe("username validation", () => {
	it("accepts Persian and Latin usernames with supported separators", () => {
		expect(getUsernameError("mohsen.dev")).toBe("");
		expect(getUsernameError("محسن_۱۲۳")).toBe("");
	});

	it("rejects invalid usernames and accepts email only when allowed", () => {
		expect(getUsernameError("1mohsen")).not.toBe("");
		expect(getUsernameError("mo")).not.toBe("");
		expect(getUsernameError("mohsen@site.com")).not.toBe("");
		expect(
			getUsernameError("mohsen@site.com", { allowEmail: true }),
		).toBe("");
	});
});

describe("password validation", () => {
	it("requires valid length, a letter, a number, and no whitespace", () => {
		expect(getPasswordError("secure123")).toBe("");
		expect(getPasswordError("short1")).not.toBe("");
		expect(getPasswordError("onlyletters")).not.toBe("");
		expect(getPasswordError("12345678")).not.toBe("");
		expect(getPasswordError("secure 123")).not.toBe("");
	});

	it("returns rule state for live requirement indicators", () => {
		expect(getPasswordRuleState("secure123")).toEqual({
			hasValidLength: true,
			hasLetter: true,
			hasNumber: true,
			hasNoWhitespace: true,
		});
	});
});
