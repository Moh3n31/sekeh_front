interface MessageObject {
	message_id: string;
	is_user: boolean;
	time: string;
	content: string;
}
interface HistoryObject {
	id: string;
	title: string;
	desc: string;
	date: string;
}

export const chatHistory: HistoryObject[] = [
	{
		id: "chat_1",
		title: "Python Job",
		desc: "I'm looking for a remote and flexible job that helps me build a good foundation for my university studies",
		date: "11/23/2026",
	},
	{
		id: "chat_2",
		title: "New Chat",
		desc: "Hi",
		date: "11/23/2026",
	},
	{
		id: "chat_3",
		title: "Something here",
		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ex cupiditate vero sed rerum autem temporibus accusantium atque rem optio doloremque repellendus natus cum laboriosam tempore reprehenderit quidem, in aliquam?",
		date: "11/23/2026",
	},
];

export const messages: MessageObject[] = [
	{
		message_id: "1",
		is_user: true,
		time: "09:00 AM",
		content: "Hi there! Can you help me with some Tailwind CSS configuration?",
	},
	{
		message_id: "2",
		is_user: false,
		time: "09:00 AM",
		content: "Of course! I'd be happy to help. What are you looking to set up?",
	},
	{
		message_id: "3",
		is_user: true,
		time: "09:01 AM",
		content:
			"I want to convert my hex codes into CSS variables for a theme switcher.",
	},
	{
		message_id: "4",
		is_user: false,
		time: "09:01 AM",
		content:
			"That's a great approach. It makes dark mode much easier to manage. Do you have a color palette ready?",
	},
	{
		message_id: "5",
		is_user: true,
		time: "09:02 AM",
		content: "Yes, I have background, surface, and primary action colors.",
	},
	{
		message_id: "6",
		is_user: false,
		time: "09:02 AM",
		content:
			"Perfect. You should define them in your global CSS file using the @layer base directive.",
	},
	{
		message_id: "7",
		is_user: true,
		time: "09:03 AM",
		content: "Should I use :root for the light theme variables?",
	},
	{
		message_id: "8",
		is_user: false,
		time: "09:03 AM",
		content:
			"Exactly. Then you can override those variables inside a .dark class selector.",
	},
	{
		message_id: "9",
		is_user: true,
		time: "09:05 AM",
		content: "Got it. How do I reference them in the tailwind.config.js file?",
	},
	{
		message_id: "10",
		is_user: false,
		time: "09:05 AM",
		content:
			"You use the 'var()' syntax, like this: background: 'var(--color-background)'.",
	},
	{
		message_id: "11",
		is_user: true,
		time: "09:10 AM",
		content: "That makes sense. What about the primary text colors?",
	},
	{
		message_id: "12",
		is_user: false,
		time: "09:10 AM",
		content:
			"You can nest them! For example, text: { primary: 'var(--text-main)' }.",
	},
	{
		message_id: "13",
		is_user: true,
		time: "09:12 AM",
		content:
			"I'm seeing a flash of white when I reload the page in dark mode. Why?",
	},
	{
		message_id: "14",
		is_user: false,
		time: "09:12 AM",
		content:
			"That's common. It's because the JS hasn't applied the 'dark' class before the browser paints the UI.",
	},
	{
		message_id: "15",
		is_user: true,
		time: "09:13 AM",
		content: "How do I fix that? I'm using Next.js.",
	},
	{
		message_id: "16",
		is_user: false,
		time: "09:13 AM",
		content:
			"You should use a blocking script in your layout or use a library like 'next-themes'.",
	},
	{
		message_id: "17",
		is_user: true,
		time: "09:15 AM",
		content: "I'll try next-themes. It seems more robust.",
	},
	{
		message_id: "18",
		is_user: false,
		time: "09:15 AM",
		content:
			"Excellent choice. It handles system preferences and hydration automatically.",
	},
	{
		message_id: "19",
		is_user: true,
		time: "09:16 AM",
		content: "Thanks for the help! I'll go implement this now.",
	},
	{
		message_id: "20",
		is_user: false,
		time: "09:16 AM",
		content:
			"You're very welcome! Feel free to reach out if you hit any more snags. Happy coding!",
	},
];

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

const chatAPI = {
	chatHistory: () => api.get<ApiResponse<AllChatsReturn>>("/chats"),
	newChat: () => api.post<ApiResponse<ChatReturn>>("/chats"),
	deleteChat: (chat_id: string) =>
		api.delete<ApiResponse<string>>("chats/" + chat_id),
	editTitle: ({ chat_id, payload }: { chat_id: string; payload: string }) =>
		api.patch<ApiResponse<ChatReturn>>(`chats/${chat_id}/title`, {
			title: payload,
		}),
};

export type { MessageObject, ChatObject };
export { chatAPI };
