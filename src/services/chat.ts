interface MessageObject {
	message_id: string;
	// is_user: boolean;
	time: string;
	content: string;
	role: "user" | "assistant";
	job_cards?: Job[];
}

import type { Job } from "../presentation/components/hooks/useChatStream";
import { api, type ApiResponse } from "./api";

interface ChatObject {
	chat_id: number;
	title: string;
	date: string;
	desc: string;
}
interface AllChatsReturn {
	chats: ChatObject[];
}
interface ChatReturn {
	chat: ChatObject;
}
interface MessagesReturn {
	chat: Omit<ChatObject, "date" | "desc">;
	messages: MessageObject[];
}

export const messages: MessageObject[] = [
	{
		message_id: "string",
		time: "string",
		content: "string",
		role: "assistant",
		job_cards: [
			{
				title: "string",
				company_name: "string",
				match_percent: 0,
				requirements: ["string", "string"],
				job_url: "string",
				source_site: "string",
				company_reviews: { score: 0, count: 0 },
			},
		],
	},
];

const chatAPI = {
	chatHistory: () => api.get<ApiResponse<AllChatsReturn>>("/chats"),
	newChat: () => api.post<ApiResponse<ChatReturn>>("/chats"),
	deleteChat: (chat_id: number) =>
		api.delete<ApiResponse<string>>("chats/" + chat_id),
	editTitle: ({ chat_id, payload }: { chat_id: number; payload: string }) =>
		api.patch<ApiResponse<ChatReturn>>(`chats/${chat_id}/title`, {
			title: payload,
		}),
	allMessages: (chat_id: string) =>
		api.get<ApiResponse<MessagesReturn>>(`chats/${chat_id}/messages`),
};

export type { MessageObject, ChatObject };
export { chatAPI };
