import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { Send, Square } from "lucide-react";

// Data & Services
import {
	chatAPI,
	type MessageObject,
	type MessageStatus,
} from "../../services/chat";
import { resumeAPI } from "../../services/resume";

// Components
import Message from "../components/shared/Message";
import ResumeModal from "../components/resume/ResumeModal";

// Hooks
import {
	useChatStream,
	type ChatStreamStatus,
} from "../components/hooks/useChatStream";
import { useCustomQuery } from "../components/hooks/useCostumQuery";

// Utils
import { getRequiredError, sanitizeText } from "../../utils/formValidation";

interface ActiveExchange {
	userMessageId: string;
	assistantMessageId: string;
	createdAt: string;
}

const EMPTY_MESSAGES: MessageObject[] = [];

export default function Chat() {
	const { chatId } = useParams();
	const isChatReady = Boolean(chatId);

	const { data, isLoading } = useCustomQuery({
		key: ["chatMessages", chatId],
		func: () => chatAPI.allMessages(chatId ?? ""),
		options: {
			enabled: isChatReady,
		},
	});

	const serverMessages = data?.data.messages ?? EMPTY_MESSAGES;

	const [localMessages, setLocalMessages] = useState<MessageObject[]>([]);

	const [activeExchange, setActiveExchange] = useState<ActiveExchange | null>(
		null,
	);

	const [inputData, setInputData] = useState("");
	const [error, setError] = useState("");

	const [welcomeCreatedAt] = useState(() => new Date().toISOString());

	/*
	 * These refs are used only for DOM operations and event/effect
	 * bookkeeping. None of them are read during render.
	 */
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	const bottomRef = useRef<HTMLDivElement | null>(null);

	const shouldAutoScrollRef = useRef(true);

	const {
		sendMessage,
		abort,
		resetStream,

		status,
		requestAccepted,

		isBusy,
		isStreaming,

		assistantStreamingText,
		jobs,
		streamError,
	} = useChatStream(chatId ?? "");

	/*
	 * Only protect the optimistic user message while its request is actively
	 * running. Once the operation reaches a terminal state, the server copy
	 * may replace it.
	 */
	const activeUserMessageId = isBusy
		? (activeExchange?.userMessageId ?? null)
		: null;

	/*
	 * Reset transient chat state when navigating between conversations.
	 */
	useEffect(() => {
		resetStream();

		(() => {
			setLocalMessages([]);
			setActiveExchange(null);
			setInputData("");
			setError("");
		})();

		shouldAutoScrollRef.current = true;
	}, [chatId, resetStream]);

	/*
	 * Update the active user's local message as the request moves through
	 * its lifecycle.
	 *
	 * After HTTP acceptance, the user message remains "sent" even if the
	 * assistant later fails or is stopped.
	 */
	useEffect(() => {
		if (!activeExchange) {
			return;
		}

		const nextState = getUserMessageState({
			status,
			requestAccepted,
			streamError,
		});

		if (!nextState) {
			return;
		}

		(() =>
			setLocalMessages((currentMessages) =>
				updateMessageById(
					currentMessages,
					activeExchange.userMessageId,
					nextState,
				),
			))();
	}, [activeExchange, status, requestAccepted, streamError]);

	/*
	 * Build a terminal assistant snapshot entirely from state.
	 *
	 * No ref is accessed here.
	 */
	const terminalAssistantMessage = useMemo<MessageObject | null>(() => {
		if (
			!activeExchange ||
			!requestAccepted ||
			!isTerminalStreamStatus(status)
		) {
			return null;
		}

		return buildAssistantMessage({
			exchange: activeExchange,
			status,
			streamingText: assistantStreamingText,
			jobs,
			streamError,
		});
	}, [
		activeExchange,
		requestAccepted,
		status,
		assistantStreamingText,
		jobs,
		streamError,
	]);

	/*
	 * Preserve completed, failed, and stopped assistant messages locally.
	 *
	 * Completed local messages disappear once their equivalent server
	 * messages are returned by chat history.
	 */
	useEffect(() => {
		if (!terminalAssistantMessage) {
			return;
		}

		(() =>
			setLocalMessages((currentMessages) =>
				upsertLocalMessage(currentMessages, terminalAssistantMessage),
			))();
	}, [terminalAssistantMessage]);

	/*
	 * Remove optimistic messages when matching server messages become
	 * available.
	 */
	useEffect(() => {
		if (serverMessages.length === 0) {
			return;
		}

		(() =>
			setLocalMessages((currentMessages) => {
				const nextMessages = currentMessages.filter(
					(localMessage) =>
						!isMessageSynchronized({
							localMessage,
							serverMessages,
							activeUserMessageId,
						}),
				);

				return nextMessages.length === currentMessages.length
					? currentMessages
					: nextMessages;
			}))();
	}, [serverMessages, activeUserMessageId]);

	const visibleLocalMessages = useMemo(
		() =>
			localMessages.filter(
				(localMessage) =>
					!isMessageSynchronized({
						localMessage,
						serverMessages,
						activeUserMessageId,
					}),
			),
		[localMessages, serverMessages, activeUserMessageId],
	);

	const visibleMessages = useMemo(
		() =>
			[...serverMessages, ...visibleLocalMessages].sort(
				compareMessagesByCreatedAt,
			),
		[serverMessages, visibleLocalMessages],
	);

	/*
	 * Build the currently active assistant message from state.
	 *
	 * It does not exist while status is "sending". It appears only after
	 * requestAccepted becomes true.
	 */
	const liveAssistantMessage = useMemo<MessageObject | null>(() => {
		if (!activeExchange || !requestAccepted || !canDisplayAssistant(status)) {
			return null;
		}

		/*
		 * After a terminal assistant message has been persisted into the
		 * local timeline, do not render another live copy.
		 */
		if (
			localMessages.some(
				(message) => message.message_id === activeExchange.assistantMessageId,
			)
		) {
			return null;
		}

		const message = buildAssistantMessage({
			exchange: activeExchange,
			status,
			streamingText: assistantStreamingText,
			jobs,
			streamError,
		});

		if (!message) {
			return null;
		}

		const existsOnServer = serverMessages.some((serverMessage) =>
			messagesHaveEquivalentContent(message, serverMessage),
		);

		return existsOnServer ? null : message;
	}, [
		activeExchange,
		requestAccepted,
		status,
		assistantStreamingText,
		jobs,
		streamError,
		localMessages,
		serverMessages,
	]);

	const showLoadingMessages =
		isLoading &&
		serverMessages.length === 0 &&
		visibleLocalMessages.length === 0;

	const showEmptyState =
		!showLoadingMessages &&
		visibleMessages.length === 0 &&
		!liveAssistantMessage;

	// const displayError = error || streamError || "";

	async function handleSubmit() {
		if (isBusy) {
			setError(
				"در حال ارسال یا دریافت پیام هستیم. ابتدا پاسخ فعلی را متوقف کنید.",
			);
			return;
		}

		const userContent = sanitizeText(inputData);

		const validationError = getRequiredError(userContent, "پیام");

		if (validationError) {
			setError(validationError);
			return;
		}

		if (userContent.length > 400) {
			setError("پیام نباید بیشتر از 400 کاراکتر باشد.");
			return;
		}

		/*
		 * In the unlikely case that the terminal persistence effect has not
		 * run yet, preserve the previous assistant message before starting
		 * another exchange.
		 */
		if (terminalAssistantMessage) {
			setLocalMessages((currentMessages) =>
				upsertLocalMessage(currentMessages, terminalAssistantMessage),
			);
		}

		const createdAt = new Date().toISOString();

		const nextExchange: ActiveExchange = {
			userMessageId: createLocalMessageId("user"),
			assistantMessageId: createLocalMessageId("assistant"),
			createdAt,
		};

		const userMessage: MessageObject = {
			message_id: nextExchange.userMessageId,
			role: "user",
			content: userContent,
			created_at: createdAt,
			status: "sending",
		};

		setError("");
		setInputData("");
		setActiveExchange(nextExchange);

		setLocalMessages((currentMessages) => [...currentMessages, userMessage]);

		/*
		 * A new outgoing message should always return the conversation to the
		 * bottom.
		 */
		shouldAutoScrollRef.current = true;

		const result = await sendMessage(userContent);

		setLocalMessages((currentMessages) => {
			const nextUserState: Partial<MessageObject> =
				result.success || result.accepted
					? {
							status: "sent",
							error: undefined,
						}
					: result.stopped
						? {
								status: "stopped",
								error: undefined,
							}
						: {
								status: "failed",
								error: result.error ?? "ارسال پیام با خطا مواجه شد.",
							};

			return updateMessageById(
				currentMessages,
				nextExchange.userMessageId,
				nextUserState,
			);
		});

		if (result.error) {
			setError(result.error);
		}
	}

	/*
	 * Scroll only while the user is already near the bottom. Reading older
	 * messages is not interrupted by incoming chunks.
	 */
	useEffect(() => {
		if (!shouldAutoScrollRef.current) {
			return;
		}

		bottomRef.current?.scrollIntoView({
			behavior: isStreaming ? "auto" : "smooth",
			block: "end",
		});
	}, [
		visibleMessages.length,
		liveAssistantMessage?.content,
		liveAssistantMessage?.job_cards?.length,
		isStreaming,
	]);

	/*
	 * Preserve the original automatic textarea resizing.
	 */
	useEffect(() => {
		const textarea = textareaRef.current;

		if (!textarea) {
			return;
		}

		textarea.style.height = "auto";

		const parsedLineHeight = Number.parseFloat(
			getComputedStyle(textarea).lineHeight,
		);

		const lineHeight = Number.isFinite(parsedLineHeight)
			? parsedLineHeight
			: 24;

		const maxHeight = lineHeight * 5;

		textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;

		textarea.style.overflowY =
			textarea.scrollHeight > maxHeight ? "auto" : "hidden";
	}, [inputData]);

	function handleMessagesScroll() {
		const container = messagesContainerRef.current;

		if (!container) {
			return;
		}

		const distanceFromBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight;

		shouldAutoScrollRef.current = distanceFromBottom < 120;
	}

	async function handleResumeSelect(resumeId: number | string) {
		try {
			const response = await resumeAPI.getResumeById(resumeId);

			const content = response.data.content;

			setInputData((currentValue) =>
				currentValue ? `${currentValue}\n\n${content}` : content,
			);

			setError("");

			requestAnimationFrame(() => {
				textareaRef.current?.focus();
			});
		} catch (resumeError) {
			console.error(resumeError);

			setError("رزومه انتخاب‌شده در دسترس نبود. لطفاً دوباره تلاش کنید.");
		}
	}

	return (
		<div className="relative flex h-full flex-col">
			<menu className="flex flex-col items-start gap-1 max-md:pb-1 max-md:ps-3 max-md:pt-5 md:absolute md:start-5 md:top-5">
				<Link
					to="/chats"
					className="group flex items-center justify-center gap-1 rounded-lg border-2 border-primary-action bg-surface px-3 py-0.5 transition-all duration-150 hover:bg-primary-action">
					<p className="text-[14px] font-semibold text-primary-action transition-all duration-150 group-hover:text-surface">
						بازگشت
					</p>
				</Link>
			</menu>

			<div
				ref={messagesContainerRef}
				dir="ltr"
				onScroll={handleMessagesScroll}
				className="scrollbar-gray flex h-full flex-col gap-10 overflow-y-auto px-5 pb-5 max-md:pt-5 md:px-[20%] md:pt-10">
				{showLoadingMessages ? (
					<div className="space-y-4">
						<div className="h-24 animate-pulse rounded-xl bg-border/70" />
						<div className="h-24 animate-pulse rounded-xl bg-border/70" />
					</div>
				) : null}

				{showEmptyState ? (
					<Message
						message={{
							message_id: "welcome-message",
							role: "assistant",
							content:
								"سلام!\n\nمن **دستیار کاریابی هوشمند** شما هستم.\n\nرزومه خودت رو برام بفرست تا ببینم چی کار میتونم بکنم.",
							created_at: welcomeCreatedAt,
							status: "sent",
						}}
					/>
				) : null}

				{visibleMessages.map((message) => (
					<Message key={message.message_id} message={message} />
				))}

				{liveAssistantMessage ? (
					<Message
						key={liveAssistantMessage.message_id}
						message={liveAssistantMessage}
					/>
				) : null}

				<div ref={bottomRef} />
			</div>

			<form
				onSubmit={(event: FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					void handleSubmit();
				}}
				className="mx-5 mb-5 mt-2 rounded-xl border border-border bg-background p-3 shadow-lg shadow-border transition-all duration-150 md:mx-75">
				<div dir="rtl" className="flex items-end gap-2.5">
					<textarea
						ref={textareaRef}
						rows={1}
						value={inputData}
						// maxLength={400}
						disabled={isBusy}
						placeholder="درمورد خودت بنویس..."
						onChange={(event) => {
							setInputData(event.target.value);

							if (error) {
								setError("");
							}
						}}
						onKeyDown={(event) => {
							if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();

								if (!isBusy) {
									void handleSubmit();
								}
							}
						}}
						className="h-auto min-h-10 w-full resize-none overflow-hidden rounded-lg px-2 py-2 text-[17px] text-primary-text outline-0 placeholder:font-medium placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-60"
					/>

					<div className="flex shrink-0 items-center gap-2">
						<ResumeModal onSelectResume={handleResumeSelect} />

						<button
							type={isBusy ? "button" : "submit"}
							onClick={() => {
								if (isBusy) {
									abort();
								}
							}}
							aria-label={isBusy ? "توقف تولید پاسخ" : "ارسال پیام"}
							className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-accent transition-all duration-150 hover:bg-accent-hover">
							{isBusy ? (
								<Square strokeWidth={1.5} className="size-4 text-white" />
							) : (
								<Send
									id="sendIcon"
									strokeWidth={1.5}
									className="me-px mt-0.5 size-4 -rotate-90 text-white"
								/>
							)}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}

function getUserMessageState({
	status,
	requestAccepted,
	streamError,
}: {
	status: ChatStreamStatus;
	requestAccepted: boolean;
	streamError: string | null;
}): Partial<MessageObject> | null {
	if (requestAccepted) {
		return {
			status: "sent",
			error: undefined,
		};
	}

	switch (status) {
		case "sending":
			return {
				status: "sending",
				error: undefined,
			};

		case "failed":
			return {
				status: "failed",
				error: streamError ?? "ارسال پیام با خطا مواجه شد.",
			};

		case "stopped":
			return {
				status: "stopped",
				error: undefined,
			};

		default:
			return null;
	}
}

function buildAssistantMessage({
	exchange,
	status,
	streamingText,
	jobs,
	streamError,
}: {
	exchange: ActiveExchange;
	status: ChatStreamStatus;
	streamingText: string;
	jobs: MessageObject["job_cards"];
	streamError: string | null;
}): MessageObject | null {
	const messageStatus = getAssistantMessageStatus(status);

	if (!messageStatus) {
		return null;
	}

	const hasJobs = Boolean(jobs?.length);

	return {
		message_id: exchange.assistantMessageId,
		role: "assistant",
		created_at: exchange.createdAt,
		content: getAssistantContent({
			status,
			streamingText,
			streamError,
			hasJobs,
		}),
		status: messageStatus,
		error:
			status === "failed"
				? (streamError ?? "دریافت پاسخ با خطا مواجه شد.")
				: undefined,
		job_cards: hasJobs ? jobs : undefined,
	};
}

function getAssistantMessageStatus(
	status: ChatStreamStatus,
): MessageStatus | null {
	switch (status) {
		case "waiting":
			return "waiting";

		case "streaming":
			return "streaming";

		case "completed":
			return "sent";

		case "failed":
			return "failed";

		case "stopped":
			return "stopped";

		default:
			return null;
	}
}

function getAssistantContent({
	status,
	streamingText,
	streamError,
	hasJobs,
}: {
	status: ChatStreamStatus;
	streamingText: string;
	streamError: string | null;
	hasJobs: boolean;
}): string {
	if (streamingText) {
		return streamingText;
	}

	switch (status) {
		case "waiting":
		case "streaming":
			return "در حال آماده‌سازی پاسخ شما...";

		case "failed":
			return streamError ?? "دریافت پاسخ با خطا مواجه شد.";

		case "stopped":
			return "تولید پاسخ متوقف شد.";

		case "completed":
			return hasJobs ? "" : "پاسخی از سرور دریافت نشد.";

		default:
			return "";
	}
}

function canDisplayAssistant(status: ChatStreamStatus): boolean {
	return (
		status === "waiting" ||
		status === "streaming" ||
		status === "completed" ||
		status === "failed" ||
		status === "stopped"
	);
}

function isTerminalStreamStatus(status: ChatStreamStatus): boolean {
	return status === "completed" || status === "failed" || status === "stopped";
}

function createLocalMessageId(prefix: string): string {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `${prefix}-${crypto.randomUUID()}`;
	}

	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function updateMessageById(
	messages: MessageObject[],
	messageId: string,
	changes: Partial<MessageObject>,
): MessageObject[] {
	let changed = false;

	const nextMessages = messages.map((message) => {
		if (message.message_id !== messageId) {
			return message;
		}

		const nextMessage = {
			...message,
			...changes,
		};

		if (
			message.status === nextMessage.status &&
			message.error === nextMessage.error
		) {
			return message;
		}

		changed = true;
		return nextMessage;
	});

	return changed ? nextMessages : messages;
}

function upsertLocalMessage(
	messages: MessageObject[],
	nextMessage: MessageObject,
): MessageObject[] {
	const existingIndex = messages.findIndex(
		(message) => message.message_id === nextMessage.message_id,
	);

	if (existingIndex === -1) {
		return [...messages, nextMessage];
	}

	const existingMessage = messages[existingIndex];

	if (
		existingMessage.content === nextMessage.content &&
		existingMessage.status === nextMessage.status &&
		existingMessage.error === nextMessage.error &&
		haveSameJobCards(existingMessage.job_cards, nextMessage.job_cards)
	) {
		return messages;
	}

	return messages.map((message) =>
		message.message_id === nextMessage.message_id ? nextMessage : message,
	);
}

function compareMessagesByCreatedAt(
	firstMessage: MessageObject,
	secondMessage: MessageObject,
): number {
	const firstTimestamp = Date.parse(firstMessage.created_at);

	const secondTimestamp = Date.parse(secondMessage.created_at);

	if (Number.isNaN(firstTimestamp) || Number.isNaN(secondTimestamp)) {
		return 0;
	}

	return firstTimestamp - secondTimestamp;
}

function isMessageSynchronized({
	localMessage,
	serverMessages,
	activeUserMessageId,
}: {
	localMessage: MessageObject;
	serverMessages: MessageObject[];
	activeUserMessageId: string | null;
}): boolean {
	if (localMessage.message_id === activeUserMessageId) {
		return false;
	}

	/*
	 * Requests that failed or stopped before acceptance may never have been
	 * stored by the server and must remain visible locally.
	 */
	if (
		localMessage.role === "user" &&
		(localMessage.status === "failed" || localMessage.status === "stopped")
	) {
		return false;
	}

	return serverMessages.some((serverMessage) => {
		if (!messagesHaveEquivalentContent(localMessage, serverMessage)) {
			return false;
		}

		const localTimestamp = Date.parse(localMessage.created_at);

		const serverTimestamp = Date.parse(serverMessage.created_at);

		if (Number.isNaN(localTimestamp) || Number.isNaN(serverTimestamp)) {
			return true;
		}

		return (
			serverTimestamp >= localTimestamp - 5_000 &&
			serverTimestamp <= localTimestamp + 10 * 60_000
		);
	});
}

function messagesHaveEquivalentContent(
	firstMessage: MessageObject,
	secondMessage: MessageObject,
): boolean {
	if (firstMessage.role !== secondMessage.role) {
		return false;
	}

	if (firstMessage.content.trim() !== secondMessage.content.trim()) {
		return false;
	}

	return haveSameJobCards(firstMessage.job_cards, secondMessage.job_cards);
}

function haveSameJobCards(
	firstJobs: MessageObject["job_cards"],
	secondJobs: MessageObject["job_cards"],
): boolean {
	const firstJobUrls = (firstJobs ?? []).map((job) => job.job_url).sort();

	const secondJobUrls = (secondJobs ?? []).map((job) => job.job_url).sort();

	if (firstJobUrls.length !== secondJobUrls.length) {
		return false;
	}

	return firstJobUrls.every((jobUrl, index) => jobUrl === secondJobUrls[index]);
}
