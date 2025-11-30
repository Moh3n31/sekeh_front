//Data & Services
import {
	chatAPI,
	// sendMessage,
	type MessagesFetch,
} from "../../services/chat";
// Components
import SendIcon from "../../assets/icons/SendIcon";
import Message from "../components/shared/Message";
// Hooks
import { useEffect, useRef, useState } from "react";
// import { useApi } from "../components/hooks/useApi";
import { useFetch } from "../components/hooks/useFetch";
import { useMutation } from "../components/hooks/useMutation";

export default function Chat() {
	const [chatData, setChatData] = useState<string>("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { data: messages, refetch } = useFetch<MessagesFetch>(
		chatAPI.messages("1")
	);
	const { mutate } = useMutation();

	const handleSubmit = async () => {
		await mutate(chatAPI.sendMessage("1", chatData))
			.then(() => {
				setChatData("");
				refetch();
			})
			.catch((e) => console.log(e));
	};

	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;

		el.style.height = "auto";
		const maxHeight = parseFloat(getComputedStyle(el).lineHeight) * 14;
		el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
	}, [chatData]);

	return (
		<div className="text-right flex flex-col h-full w-full bg-white shadow-main-port relative *:px-40 pt-5">
			<div className="flex-1 relative pb-3 flex flex-col gap-7 overflow-y-scroll pr-2">
				{messages &&
					messages.messages.map((m) => (
						<Message message={m} key={m.id} />
					))}
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="flex items-end justify-center gap-5 pt-3 pb-4">
				<textarea
					ref={textareaRef}
					rows={1}
					onChange={(e) => setChatData(e.target.value)}
					value={chatData}
					placeholder="Describe yourself..."
					className="resize-none overflow-hidden h-auto w-full px-4 pt-2 pb-4 rounded-l-3xl outline-0
					border-gray-3 border-2 rounded-3xl shadow-message-input transition-all duration-150"
				/>
				<button
					type="submit"
					className="size-12 pt-1 pr-0.5 bg-midnight-violet rounded-2xl outline-0 flex justify-center items-center
					cursor-pointer active:size-11.5 active:ml-0.5 transition-all duration-100">
					<SendIcon
						id="sendIcon"
						className="size-6 [&>g>path]:stroke-white"
					/>
				</button>
			</form>
		</div>
	);
}
