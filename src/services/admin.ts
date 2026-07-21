import { api, type ApiResponse } from "./api";

interface AdminStats {
	total_users: number;
	total_jobs: number;
	total_chats: number;
	total_messages: number;
}

interface AdminUser {
	user_id: number;
	username: string;
	email: string | null;
	phone_number: string | null;
	role: string;
	created_at: string;
	updated_at: string;
}

interface AdminUsersReturn {
	users: AdminUser[];
	total: number;
	page: number;
	pages: number;
}

interface AdminJob {
	job_id: number;
	job_url: string;
	source_site: string | null;
	job_title: string | null;
	company_name: string | null;
	location: string | null;
	paycheck: string | null;
	requirements: string[] | Record<string, unknown> | null;
	has_embedding: boolean;
}

interface AdminJobsReturn {
	jobs: AdminJob[];
	total: number;
	page: number;
	pages: number;
}

interface AdminJobDetail extends AdminJob {
	raw_text: string;
}

interface UpdateJobPayload {
	job_title?: string;
	company_name?: string;
	location?: string;
	paycheck?: string;
	requirements?: string[];
	raw_text?: string;
	source_site?: string;
}

interface UsersQuery {
	q?: string;
	page?: number;
	per_page?: number;
}

interface JobsQuery {
	q?: string;
	source_site?: string;
	location?: string;
	page?: number;
	per_page?: number;
}

const adminAPI = {
	stats: () => api.get<ApiResponse<AdminStats>>("/admin/stats"),

	users: (params: UsersQuery) =>
		api.get<ApiResponse<AdminUsersReturn>>("/admin/users", { params }),

	deleteUser: (user_id: number) =>
		api.delete<ApiResponse<null>>(`/admin/users/${user_id}`),

	jobs: (params: JobsQuery) =>
		api.get<ApiResponse<AdminJobsReturn>>("/admin/jobs", { params }),

	job: (job_id: number) =>
		api.get<ApiResponse<AdminJobDetail>>(`/admin/jobs/${job_id}`),

	updateJob: ({ job_id, payload }: { job_id: number; payload: UpdateJobPayload }) =>
		api.patch<ApiResponse<AdminJob>>(`/admin/jobs/${job_id}`, payload),

	deleteJob: (job_id: number) =>
		api.delete<ApiResponse<null>>(`/admin/jobs/${job_id}`),
};

export type {
	AdminStats,
	AdminUser,
	AdminUsersReturn,
	AdminJob,
	AdminJobDetail,
	UpdateJobPayload,
	UsersQuery,
	JobsQuery,
};
export { adminAPI };