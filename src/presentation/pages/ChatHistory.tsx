//Data & Services
import { useEffect, useState } from "react";
import NewChatIcon from "../../assets/icons/NewChatIcon";
import { chatHistory } from "../../services/chat";
import NewChatDialog from "../chats/NewChatDialog";
import HistoryCard from "../components/shared/HistoryCard";

export default function ChatHistory() {
	const [isPendig, setIsPending] = useState<boolean>(true);

	useEffect(() => {
		// setIsPending(true);
		setTimeout(() => {
			setIsPending(false);
		}, 1000);
	}, []);

	return (
		<div className="grid grid-cols-5 max-md:grid-cols-1 gap-5 p-7 overflow-y-auto overflow-x-hidden w-full h-full scrollbar-gray">
			<menu className="absolute top-25 right-5 flex flex-col items-end gap-3 z-3">
				<button
					popoverTarget="new-chat-dialog"
					className="group border-2 border-primary-action rounded-full hover:bg-primary-action overflow-hidden
					transition-all duration-150 p-2 h-10 w-10 hover:w-40 flex justify-between items-center bg-surface
					cursor-pointer hover:*:[&>g>path]:first:stroke-white hover:*:[&>g>path]:last:fill-white">
					<p className="text-white hidden group-hover:block pl-2">New Chat</p>
					<NewChatIcon
						className="h-full group-hover:bg-primary-action transition-all duration-150
						[&>g>path]:first:stroke-primary-action [&>g>path]:last:fill-primary-action"
					/>
				</button>
			</menu>
			{isPendig &&
				Array(10)
					.fill("")
					.map(() => (
						<div className="h-70 w-full rounded-lg bg-border/70 animate-pulse"></div>
					))}
			{!isPendig && chatHistory.map((h) => <HistoryCard card={h} key={h.id} />)}

			<NewChatDialog />
		</div>
	);
}
