import { api, type ApiResponse } from "./api";

interface ResumeForm {
	title: string;
	content: string;
}

interface ResumeItem {
	id: number | string;
	title: string;
	content: string;
	created_at?: string;
	updated_at?: string;
}

const resumeAPI = {
	createResume: (form: ResumeForm) =>
		api.post<ApiResponse<null>>("/resume", form),
	updateResume: (id: number | string, form: ResumeForm) =>
		api.put<ApiResponse<null>>(`/resume/${id}`, form),
	getResumes: () => api.get<ApiResponse<ResumeItem[]>>("/resume"),
	getResumeById: (id: number | string) =>
		api.get<ApiResponse<ResumeItem>>(`/resume/${id}`),
	deleteResume: (id: number | string) =>
		api.delete<ApiResponse<null>>(`/resume/${id}`),
};

export type { ResumeForm, ResumeItem };
export { resumeAPI };
