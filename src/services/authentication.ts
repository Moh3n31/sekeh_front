import { api, type ApiResponse } from "./api";
interface AuthVariables {
	username: string;
	password: string;
}
interface UserInfo {
	phone_number: number | null;
	username: string;
	email: string;
	role: "user" | "admin";
}
type UserForm = Omit<UserInfo, "role">;
interface SignupReturn {
	user: UserInfo;
}
interface LoginReturn {
	user: UserInfo;
	access_token: string;
	refresh_token: string;
	token_type: string;
}
interface PasswordPayload {
	current_password: string;
	new_password: string;
}

const authNameSpace = "/auth";
const meNameSpace = "user/me";

export const authAPI = {
	register: (payload: AuthVariables) =>
		api.post<ApiResponse<SignupReturn>>(`${authNameSpace}/register`, payload),

	login: (payload: AuthVariables) =>
		api.post<ApiResponse<LoginReturn>>(`${authNameSpace}/login`, payload),

	logout: () => api.post<ApiResponse<string>>(`${authNameSpace}/logout`),

	// Profile
	updateProfile: (payload: UserForm) =>
		api.patch<ApiResponse<string>>(meNameSpace, payload),

	getProfile: () => api.get<ApiResponse<UserInfo>>(meNameSpace),

	deleteProfile: () => api.delete<ApiResponse<string>>(meNameSpace),

	changePassword: (payload: PasswordPayload) =>
		api.patch<ApiResponse<string>>(`${meNameSpace}/password`, payload),
};

export type { AuthVariables, UserInfo, UserForm };
