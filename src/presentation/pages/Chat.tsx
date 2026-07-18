//Data & Services
import { chatAPI } from "../../services/chat";
import { resumeAPI } from "../../services/resume";
// Components
import { Link } from "react-router";
import Message from "../components/shared/Message";
// Hooks
import { useChatStream } from "../components/hooks/useChatStream";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "react-router";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import { Send, Square } from "lucide-react";
import ResumeModal from "../components/resume/ResumeModal";
import { getRequiredError, sanitizeText } from "../../utils/formValidation";

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
	const [error, setError] = useState("");
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
		const userContent = sanitizeText(inputData);
		const nextError = getRequiredError(userContent, "پیام");
		if (nextError) {
			setError(nextError);
			return;
		}

		if (userContent.length > 400) {
			setError("پیام نباید بیشتر از 400 کاراکتر باشد.");
			return;
		}

		setError("");
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

	const handleResumeSelect = async (resumeId: number | string) => {
		try {
			const response = await resumeAPI.getResumeById(resumeId);
			const content = response.data.content;
			setInputData((prev) => (prev ? `${prev}\n\n${content}` : content));
			requestAnimationFrame(() => textareaRef.current?.focus());
		} catch (error) {
			console.error(error);
			setInputData((prev) => prev ?? "");
		}
	};

	return (
		<div className="flex flex-col relative h-full">
			<menu className="md:absolute md:top-5 md:start-5 max-md:pt-5 max-md:pb-1 max-md:ps-3 flex flex-col gap-1 items-start">
				<Link
					to={"/chats"}
					className="group text-lg flex items-center justify-center gap-1 transition-all duration-150
					border-2 border-primary-action rounded-lg px-3 py-0.5 hover:bg-primary-action bg-surface">
					<p
						className="text-primary-action text-[14px] font-semibold
					group-hover:text-surface transition-all duration-150">
						بازگشت
					</p>
				</Link>
			</menu>

			<div
				dir="ltr"
				ref={containerRef}
				className="md:pt-10 max-md:pt-5 pb-5 flex flex-col gap-10 overflow-y-auto md:px-[20%] px-5 scrollbar-gray h-full">
				{history.length === 0 && !pendingUserMessage && (
					<Message
						message={{
							message_id: "welcome-message",
							role: "assistant",
							content:
								"سلام!\n\nمن **دستیار کاریابی هوشمند** شما هستم.\n\nرزومه خودت رو برام بفرست تا ببینم چی کار میتونم بکنم.",
							created_at: new Date().toISOString(),
						}}
						isPending={false}
					/>
				)}

				{history.map((m) => (
					<Message message={m} key={m.message_id} isPending={false} />
				))}

				{pendingUserMessage && (
					<Message
						message={{
							message_id: "user-pending",
							role: "user",
							content: pendingUserMessage,
							created_at: new Date().toISOString(),
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
							created_at: new Date().toISOString(),
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
							created_at: new Date().toISOString(),
						}}
						isPending={isStreaming}
					/>
				)}

				<div ref={bottomRef} />
			</div>

			<form
				onSubmit={(e: FormEvent<HTMLFormElement>) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="md:mx-75 mx-5 mb-5 mt-2 rounded-xl border border-border bg-background p-3 shadow-lg shadow-border transition-all duration-150">
				<div className="flex items-end gap-2.5">
					<textarea
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit();
							}
						}}
						ref={textareaRef}
						rows={1}
						onChange={(e) => {
							setInputData(e.target.value);
							if (error) setError("");
						}}
						value={inputData}
						placeholder="درمورد خودت بنویس..."
						maxLength={400}
						className="h-auto min-h-10 w-full resize-none overflow-hidden rounded-lg px-2 py-2 outline-0 text-[17px] placeholder:font-medium placeholder:text-text-muted text-primary-text"
					/>

					<div className="flex shrink-0 items-center gap-2">
						<ResumeModal onSelectResume={handleResumeSelect} />
						{error ? <p className="text-sm text-red-500">{error}</p> : null}
						<button
							type={isStreaming ? "button" : "submit"}
							onClick={() => {
								if (isStreaming) abort();
							}}
							className="flex size-10 items-center justify-center rounded-full bg-accent transition-all duration-150 hover:bg-accent-hover cursor-pointer">
							{isStreaming ? (
								<Square strokeWidth={1.5} className="size-4 text-white" />
							) : (
								<Send
									id="sendIcon"
									strokeWidth={1.5}
									className="size-4 text-white mt-0.5 me-px -rotate-90"
								/>
							)}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
