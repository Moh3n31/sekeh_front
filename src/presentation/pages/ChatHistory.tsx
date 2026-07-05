//Data & Services
import { chatAPI } from "../../services/chat";
import NewChatDialog from "../chats/NewChatDialog";
import HistoryCard from "../components/shared/HistoryCard";
import { useCustomQuery } from "../components/hooks/useCostumQuery";

export default function ChatHistory() {
	const { data, isPending } = useCustomQuery({
		key: ["chatHistory"],
		func: chatAPI.chatHistory,
	});

	return (
		<div className="p-7 overflow-y-auto overflow-x-hidden w-full h-full scrollbar-gray">
			<menu className="absolute top-25 end-5 flex flex-col items-end gap-3 z-3">
				<NewChatDialog />
			</menu>

			{isPending || (data?.data && data?.data?.chats.length !== 0) ? (
				<main className="grid grid-cols-5 max-[1100px]:grid-cols-3 max-md:grid-cols-1 gap-5 ">
					{isPending
						? Array(10)
								.fill("")
								.map((_, index) => (
									<div
										key={index}
										className="h-70 w-full rounded-lg bg-border/70 animate-pulse"></div>
								))
						: data?.data.chats.map((h) => (
								<HistoryCard card={h} key={h.chat_id} />
							))}
				</main>
			) : (
				<div className="flex items-center justify-center h-full">
					<p className="text-text-muted">یک چت جدید ایجاد کنید.</p>
				</div>
			)}
		</div>
	);
}
