import type { Job } from "@/features/chat/hooks/useChatStream";
import { api, type ApiResponse } from "@/shared/api/client";

interface MarkedObject {
	bookmarks: Job[];
}

const nameSpace = "/bookmarks";

const MarkAPI = {
	markCard: (payload: Job) =>
		api.post<ApiResponse<{ bookmarked: boolean; job_url: string }>>(
			`${nameSpace}/toggle`,
			payload,
		),
	allMarked: () => api.get<ApiResponse<MarkedObject>>(`${nameSpace}`),
};

export type { MarkedObject };
export { MarkAPI };
