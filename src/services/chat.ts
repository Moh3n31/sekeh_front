import type { MutationArgs } from "../presentation/components/hooks/useMutation";

interface MessageObject {
	id: string;
	is_user: boolean;
	time: string;
	content: string;
}
interface MessagesFetch {
	chat: ChatObject;
	messages: MessageObject[];
}

interface ChatObject {
	chat_id: string;
	title: string;
}
interface ChatsFetch {
	chats: ChatObject[];
}

const chatAPI = {
	history: (userId: string) => `users/${userId}/chats`,
	messages: (chatId: string) => `chats/${chatId}/messages`,
	newChat: (userId: string) => ({
		url: `users/${userId}/chats`,
		options: { method: "POST", body: { title: "something" } },
	}),
	sendMessage: (chatId: string, content: string): MutationArgs => ({
		url: `chats/${chatId}/messages`,
		options: { method: "POST", body: { content: content } },
	}),
};

export type { MessageObject, MessagesFetch, ChatObject, ChatsFetch };
export { chatAPI };
