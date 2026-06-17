//Data & Services
import { chatAPI, messages } from "../../services/chat";
// Components
import { Link } from "react-router";
import SendIcon from "../../assets/icons/SendIcon";
import Message from "../components/shared/Message";
import JobCard from "../components/shared/JobCard";
// Hooks
import { useChatStream } from "../components/hooks/useChatStream";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import StopIcon from "../../assets/icons/StopIcon";

export default function Chat() {
	const { chatId } = useParams();

	const { data } = useCustomQuery({
		key: ["chatMessages", chatId],
		func: () => chatAPI.allMessages(chatId ?? ""),
	});
	const history = data?.data.messages ?? [];
	const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(
		null,
	);

	const [inputData, setInputData] = useState<string>("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	const {
		sendMessage,
		abort,
		isPending,
		isStreaming,
		assistantStreamingText,
		jobs,
	} = useChatStream(chatId ?? "");

	async function handleSubmit() {
		const userContent = inputData.trim();
		if (!userContent) return;

		setPendingUserMessage(userContent);
		setInputData("");

		await sendMessage(userContent);

		setPendingUserMessage(null);
	}

	// Scroll to bottom whenever any visible content changes
	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [data, pendingUserMessage, assistantStreamingText, jobs]);

	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;

		el.style.height = "auto";
		const maxHeight = parseFloat(getComputedStyle(el).lineHeight) * 5;
		el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
	}, [inputData]);

	const showJobs = jobs.length > 0 && !isStreaming && !isPending;

	return (
		<div className="flex flex-col relative h-full">
			<menu className="md:absolute md:top-5 md:left-5 max-md:pt-5 max-md:pb-1 max-md:pl-3 flex flex-col gap-1 items-start">
				<Link
					to={".."}
					className="group text-lg flex items-center justify-center gap-1 transition-all duration-150
					border-2 border-primary-action rounded-lg px-3 py-0.5 hover:bg-primary-action bg-surface">
					<p
						className="text-primary-action text-[14px] font-semibold
					group-hover:text-surface transition-all duration-150">
						Go Back
					</p>
				</Link>
			</menu>

			<div
				ref={containerRef}
				className="md:pt-10 max-md:pt-5 pb-5 flex flex-col gap-10 overflow-y-auto md:px-[20%] px-5 scrollbar-gray h-full">
				{history.length === 0 && !pendingUserMessage && (
					<Message
						message={{
							message_id: "welcome-message",
							role: "assistant",
							content:
								"سلام!\n\nمن **دستیار کاریابی هوشمند** شما هستم.\n\nرزومه خودت رو برام بفرست تا ببینم چی کار میتونم بکنم.",
							time: new Date().toISOString(),
						}}
						isPending={false}
					/>
				)}

				{messages.map((m) => (
					<div className="flex flex-col gap-3">
						<Message message={m} key={m.message_id} isPending={false} />
						<div className="grid grid-cols-3 gap-2">
							{m.job_cards && m.job_cards.map((j) => <JobCard {...j} />)}
						</div>
					</div>
				))}

				{pendingUserMessage && (
					<Message
						message={{
							message_id: "user-pending",
							role: "user",
							content: pendingUserMessage,
							time: new Date().toISOString(),
						}}
						isPending={isPending}
					/>
				)}

				{/* Thinking placeholder: waiting for the first content chunk */}
				{isPending || (isStreaming && !assistantStreamingText) ? (
					<Message
						message={{
							message_id: "assistant-pending",
							role: "assistant",
							content: "بذار ببینم چی می‌تونم پیدا کنم...",
							time: new Date().toISOString(),
						}}
						isPending={true}
					/>
				) : null}

				{/* Live streaming text */}
				{assistantStreamingText && (
					<Message
						message={{
							message_id: "assistant-streaming",
							role: "assistant",
							content: assistantStreamingText,
							time: new Date().toISOString(),
						}}
						isPending={isStreaming}
					/>
				)}

				{/* Job results — shown after streaming finishes */}
				{showJobs && (
					<div className="flex flex-col gap-3">
						<p className="text-sm font-semibold text-text-muted">
							{jobs.length} موقعیت شغلی پیدا شد
						</p>
						<div className="grid grid-cols-3 gap-2">
							{jobs.map((job) => (
								<JobCard key={job.job_url} {...job} />
							))}
						</div>
					</div>
				)}

				<div ref={bottomRef} />
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="md:mx-75 mx-5 mb-5 mt-2 rounded-xl shadow-lg shadow-border transition-all duration-150 bg-background
				border-2 border-transparent has-focus:border-accent flex items-start gap-5 p-3">
				<textarea
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSubmit();
						}
					}}
					ref={textareaRef}
					rows={1}
					onChange={(e) => setInputData(e.target.value)}
					value={inputData}
					placeholder="Describe yourself..."
					className="resize-none overflow-hidden h-auto w-full outline-0 text-[17px]
					placeholder:font-medium placeholder:text-text-muted text-primary-text"
				/>
				<button
					type={isStreaming ? "button" : "submit"}
					onClick={() => {
						if (isStreaming) abort();
					}}
					className="bg-accent hover:bg-accent-hover rounded-full outline-0 size-9 shrink-0
						cursor-pointer transition-all duration-150 flex items-center justify-center">
					{isStreaming ? (
						<StopIcon className="size-4 [&>g>path]:stroke-2 [&>g>path]:stroke-white" />
					) : (
						<SendIcon
							id="sendIcon"
							className="size-4 [&>g>path]:stroke-white mt-0.5 mr-px"
						/>
					)}
				</button>
			</form>
		</div>
	);
}
