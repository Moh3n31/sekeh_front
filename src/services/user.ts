import { api, type ApiResponse } from "./api";

interface UserProfile {
	user_id: number;
	username: string;
	email: string | null;
	phone_number: string | null;
	role: string;
	created_at: string;
	updated_at: string;
}

const userAPI = {
	me: () => api.get<ApiResponse<{ user: UserProfile }>>("/user/me"),
};

export type { UserProfile };
export { userAPI };