//Data & Services
import { chatAPI } from "@/features/chat/api/chatApi";
import NewChatDialog from "@/features/chat/components/NewChatDialog";
import HistoryCard from "@/features/chat/components/ChatHistoryCard";
import { useCustomQuery } from "@/shared/hooks/useCustomQuery";
import { MessageSquareText } from "lucide-react";
import PageTitle from "@/shared/components/layout/PageTitle";

export default function ChatHistoryPage() {
	const { data, isPending } = useCustomQuery({
		key: ["chatHistory"],
		func: chatAPI.chatHistory,
	});

	const chats = data?.data?.chats ?? [];
	const hasChats = chats.length > 0;

	return (
		<div className="p-7 overflow-y-auto overflow-x-hidden w-full h-full scrollbar-gray flex flex-col gap-5">
			<PageTitle
				icon={MessageSquareText}
				title="تاریخچه چت‌ها"
				desc="چت‌های قبلی خود را مرور و مدیریت کنید."
			/>

			<menu className="absolute top-25 end-5 flex flex-col items-end gap-3 z-3">
				<NewChatDialog />
			</menu>

			{isPending || hasChats ? (
				<main className="grid grid-cols-5 max-[1100px]:grid-cols-3 max-md:grid-cols-1 gap-5 ">
					{isPending
						? Array(10)
								.fill("")
								.map((_, index) => (
									<div
										key={index}
										className="h-70 w-full rounded-lg bg-border/70 animate-pulse"></div>
								))
						: chats.map((h) => <HistoryCard card={h} key={h.chat_id} />)}
				</main>
			) : (
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-text-muted">یک چت جدید ایجاد کنید.</p>
				</div>
			)}
		</div>
	);
}
