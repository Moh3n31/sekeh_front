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
		api.post<ApiResponse<ResumeItem>>("/resume", form),
	updateResume: (id: number | string, form: ResumeForm) =>
		api.put<ApiResponse<ResumeItem>>(`/resume/${id}`, form),
	getResumes: () => api.get<ApiResponse<ResumeItem[]>>("/resume"),
	getResumeById: (id: number | string) =>
		api.get<ApiResponse<ResumeItem>>(`/resume/${id}`),
	deleteResume: (id: number | string) =>
		api.delete<ApiResponse<string>>(`/resume/${id}`),
};

export type { ResumeForm, ResumeItem };
export { resumeAPI };
