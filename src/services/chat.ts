import { api, type ApiResponse } from "./api";

export type MessageRole = "user" | "assistant";

/**
 * UI lifecycle of a message.
 *
 * Server messages do not need to return this field.
 * When status is missing, the UI treats the message as successfully completed.
 */
export type MessageStatus =
	| "sending"
	| "sent"
	| "waiting"
	| "streaming"
	| "failed"
	| "stopped";

export interface CompanyReviews {
	rating: number;
	count: number;
}

export interface Job {
	job_title: string;
	company_name: string;
	match_percent: number;
	requirements: string[];
	job_url: string;
	source_site: string;
	company_reviews?: CompanyReviews | null;
	paycheck?: string | null;
}

export interface MessageObject {
	message_id: string;
	created_at: string;
	content: string;
	role: MessageRole;
	job_cards?: Job[];

	/**
	 * Local UI state.
	 *
	 * This property is optional because messages loaded from the API may not
	 * contain a status. Existing server messages are considered completed.
	 */
	status?: MessageStatus;

	/**
	 * Optional error belonging specifically to this message.
	 */
	error?: string;
}

export interface ChatObject {
	chat_id: number;
	created_at: string;
	title: string;
	updated_at: string;
}

export interface AllChatsReturn {
	chats: ChatObject[];
}

export interface ChatReturn {
	chat: ChatObject;
}

export interface MessagesReturn {
	chat: ChatObject;
	messages: MessageObject[];
}

const chatAPI = {
	chatHistory: () => api.get<ApiResponse<AllChatsReturn>>("/chats"),

	newChat: () => api.post<ApiResponse<ChatReturn>>("/chats"),

	deleteChat: (chatId: number) =>
		api.delete<ApiResponse<string>>(`/chats/${chatId}`),

	editTitle: ({ chat_id, payload }: { chat_id: number; payload: string }) =>
		api.patch<ApiResponse<ChatReturn>>(`/chats/${chat_id}/title`, {
			title: payload,
		}),

	allMessages: (chatId: string) =>
		api.get<ApiResponse<MessagesReturn>>(`/chats/${chatId}/messages`),
};

export { chatAPI };
