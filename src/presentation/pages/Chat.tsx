//Data & Services
import {
	// chatAPI,
	// sendMessage,
	// 	type MessagesFetch,
	messages,
	type MessageObject,
} from "../../services/chat";
// Components
import { Link } from "react-router";
import SendIcon from "../../assets/icons/SendIcon";
import Message from "../components/shared/Message";
// Hooks
import { useEffect, useRef, useState } from "react";
// import { useApi } from "../components/hooks/useApi";
// import { useFetch } from "../components/hooks/useFetch";
// import { useMutation } from "../components/hooks/useMutation";
// import { useParams } from "react-router";

export default function Chat() {
	const [inputData, setInputData] = useState<string>("");
	const [chatData, setChatData] = useState<MessageObject[]>(
		messages.slice(0, -1),
	);
	const [lastMessage, setLastMessage] = useState<MessageObject>(
		messages[messages.length - 1],
	);
	const [isPending, setIsPending] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	// const { chatId } = useParams();
	// const { data: messages, refetch } = useFetch<MessagesFetch>(
	// 	chatAPI.messages(chatId ?? "1")
	// );
	// const { mutate } = useMutation();

	// const handleSubmit = async () => {
	// 	await mutate(chatAPI.sendMessage(chatId ?? "1", inputData))
	// 		.then(() => {
	// 			setInputData("");
	// 			refetch();
	// 		})
	// 		.catch((e) => console.log(e));
	// };

	function handleSubmit() {
		setChatData((prev) => {
			const temp = [...prev];
			temp.push(lastMessage);
			return temp;
		});
		const payload: MessageObject = {
			content: inputData,
			is_user: true,
			message_id: "new-message" + inputData,
			time: "",
		};
		setIsPending(true);
		setLastMessage(payload);
		setInputData("");
		setTimeout(() => {
			setIsPending(false);
		}, 2000);
	}

	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;

		el.style.height = "auto";
		const maxHeight = parseFloat(getComputedStyle(el).lineHeight) * 5;
		el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
	}, [inputData]);

	return (
		<div className="flex flex-col relative h-full">
			<menu className="md:absolute md:top-5 md:left-5 max-md:pt-5 max-md:pb-1 max-md:pl-3 flex flex-col gap-1 items-start">
				<Link
					to={".."}
					className="group text-lg flex items-center justify-center gap-1 transition-all duration-150
					border-2 border-primary-action rounded-lg px-3 py-0.5 hover:bg-primary-action bg-surface">
					{/* <span className="font-bold text-lg text-primary-action">{"<"}</span> */}
					<p
						className="text-primary-action text-[14px] font-semibold
					group-hover:text-surface transition-all duration-150">
						Go Back
					</p>
				</Link>
			</menu>

			<div className="md:pt-10 max-md:pt-5 pb-5 flex flex-col gap-10 overflow-y-auto md:px-75 px-5 scrollbar-gray h-full">
				{chatData &&
					chatData.map((m) => <Message message={m} key={m.message_id} />)}
				<Message message={lastMessage} isPending={isPending} />
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="md:mx-75 mx-5 mb-5 mt-2 rounded-xl shadow-lg shadow-border transition-all duration-150 bg-background
				border-2 border-transparent has-focus:border-accent flex items-start gap-5 p-3">
				<textarea
					ref={textareaRef}
					rows={1}
					onChange={(e) => setInputData(e.target.value)}
					value={inputData}
					placeholder="Describe yourself..."
					className="resize-none overflow-hidden h-auto w-full outline-0 text-[17px]
					placeholder:font-medium placeholder:text-text-muted text-primary-text"
				/>
				<button
					type="submit"
					className=" bg-accent hover:bg-accent-hover rounded-full outline-0
					cursor-pointer transition-all duration-150">
					<SendIcon
						id="sendIcon"
						className="size-3.5 [&>g>path]:stroke-white mt-3 mb-2.5 mr-3 ml-2.5"
					/>
				</button>
			</form>
		</div>
	);
}
