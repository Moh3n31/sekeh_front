import { api, type ApiResponse } from "./api";

interface ResumeFormObject {
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
	createResume: (form: ResumeFormObject) =>
		api.post<ApiResponse<null>>("/resumes", form),
	updateResume: (id: number | string, form: ResumeFormObject) =>
		api.put<ApiResponse<null>>(`/resumes/${id}`, form),
	getResumes: () => api.get<ApiResponse<ResumeItem[]>>("/resumes"),
	getResumeById: (id: number | string) =>
		api.get<ApiResponse<ResumeItem>>(`/resumes/${id}`),
	deleteResume: (id: number | string) =>
		api.delete<ApiResponse<null>>(`/resumes/${id}`),
};

export type { ResumeFormObject, ResumeItem };
export { resumeAPI };
