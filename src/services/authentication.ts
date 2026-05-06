import { api, type ApiResponse } from "./api";
interface AuthVariables {
	username: string;
	password: string;
}

interface UserInfo {
	user_id: number;
	username: string;
}
interface SignupReturn {
	user: UserInfo;
}
interface LoginReturn {
	user: UserInfo;
	access_token: string;
	refresh_token: string;
	token_type: string;
}

export const authAPI = {
	register: (payload: AuthVariables) =>
		api.post<ApiResponse<SignupReturn>>("/auth/register", payload),
	login: (payload: AuthVariables) =>
		api.post<ApiResponse<LoginReturn>>("/auth/login", payload),
	logout: () => api.post<ApiResponse<string>>("/auth/logout"),
};

export type { AuthVariables };
