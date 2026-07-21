// Data & Services
import type {
	MessageObject,
	MessageRole,
	MessageStatus,
} from "../../../services/chat";
import { toast } from "../../../services/toast";

// Components
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import {
	Check,
	Copy,
	LoaderCircle,
	Square,
	ThumbsDown,
	ThumbsUp,
	X,
} from "lucide-react";
import JobCard from "./JobCard";

// Utils
import { formatDate } from "../../../utils/date";

interface MessageProps {
	message: MessageObject;
}

interface MessageStatusProps {
	role: MessageRole;
	status: MessageStatus;
}

async function handleCopy(text: string): Promise<void> {
	const trimmedText = text.trim();

	if (!trimmedText) {
		toast.error("متنی برای کپی کردن وجود ندارد.");
		return;
	}

	try {
		if (!navigator.clipboard) {
			throw new Error("Clipboard API is unavailable.");
		}

		await navigator.clipboard.writeText(text);

		toast.success("پیام با موفقیت کپی شد.");
	} catch {
		toast.error("کپی کردن پیام با خطا مواجه شد. دوباره امتحان کنید.");
	}
}

function MessageStatusView({ status }: MessageStatusProps) {
	switch (status) {
		case "sent":
			return <Check strokeWidth={1.8} className="size-3.5 text-match" />;

		case "failed":
			return <X strokeWidth={1.8} className="size-3.5 text-red-500" />;

		case "stopped":
			return <Square strokeWidth={1.5} className="size-3 text-text-muted" />;
	}
}

function UserMessage({ message }: MessageProps) {
	const status = resolveMessageStatus(message.status);
	const isInProgress = status === "sending";
	const canCopy = Boolean(message.content.trim());

	return (
		<div className="flex h-auto items-start justify-end gap-3">
			<span className="flex size-6 shrink-0 items-center justify-center rounded-full">
				{isInProgress ? (
					<LoaderCircle
						strokeWidth={1.5}
						className="size-5 animate-spin text-text-muted"
					/>
				) : null}
			</span>

			<div className="flex max-w-[85%] flex-col items-end gap-3">
				<p
					dir="rtl"
					className="w-full whitespace-pre-wrap wrap-break-word text-right text-[15px] text-primary-text">
					{message.content}
				</p>

				<div className="flex w-full items-center justify-between gap-3">
					<div className="flex min-w-0 items-center gap-2">
						<span className="shrink-0 text-[12px] text-text-muted/50">
							{formatDate(message.created_at, true)}
						</span>

						<MessageStatusView role="user" status={status} />
					</div>

					{!isInProgress && (
						<menu className="flex shrink-0 items-center">
							<button
								type="button"
								disabled={!canCopy}
								onClick={() => {
									void handleCopy(message.content);
								}}
								aria-label="کپی پیام"
								className="size-7 cursor-pointer rounded-full border-2 border-transparent p-1 transition-all duration-150 hover:border-border disabled:cursor-not-allowed disabled:opacity-40">
								<Copy
									strokeWidth={1.5}
									className="size-full text-text-muted/60"
								/>
							</button>
						</menu>
					)}
				</div>

				{message.error && message.error.trim() !== message.content.trim() ? (
					<p
						dir="rtl"
						className="w-full text-right text-[12px] text-primary-red">
						{message.error}
					</p>
				) : null}
			</div>
		</div>
	);
}

function AssistantMessage({ message }: MessageProps) {
	const status = resolveMessageStatus(message.status);

	const isWaiting = status === "waiting";
	const isStreaming = status === "streaming";
	const isPending = isStreaming || isWaiting;
	const isCompleted = status === "sent";
	const canCopy = Boolean(message.content.trim());

	function handleLike(): void {
		console.log("Liked:", message.message_id);
	}

	function handleDislike(): void {
		console.log("Disliked:", message.message_id);
	}

	return (
		<div className="flex h-auto items-start justify-start gap-3">
			<span
				aria-hidden="true"
				className={[
					"flex size-7 shrink-0 items-center justify-center rounded-full",
					status === "failed"
						? "border border-primary-red/30 bg-primary-red/10"
						: "bg-linear-30 from-accent-hover to-primary-green",
					isPending ? "animate-spin" : "",
				].join(" ")}>
				{status === "failed" ? (
					<X strokeWidth={1.8} className="size-4 text-primary-red" />
				) : status === "stopped" ? (
					<Square strokeWidth={1.5} className="size-3 text-white" />
				) : (
					<span className="size-4.5 rounded-full bg-accent-soft" />
				)}
			</span>

			<div className="flex max-w-[90%] min-w-0 flex-col items-start gap-3">
				<div
					dir="rtl"
					className={[
						"w-full wrap-break-word text-[16px] text-primary-text",
						isWaiting ? "animate-pulse" : "",
					].join(" ")}>
					<ReactMarkdown rehypePlugins={[rehypeHighlight]}>
						{message.content}
					</ReactMarkdown>

					{isStreaming ? (
						<span
							aria-hidden="true"
							className="ms-1 inline-block h-4 w-0.5 animate-pulse rounded-full bg-primary-action align-middle"
						/>
					) : null}
				</div>

				{message.job_cards && message.job_cards.length > 0 ? (
					<div className="grid w-full grid-cols-3 gap-2 max-md:grid-cols-1">
						{message.job_cards.map((job) => (
							<JobCard key={`${message.message_id}-${job.job_url}`} {...job} />
						))}
					</div>
				) : null}

				<div className="flex w-full items-center justify-between gap-3">
					<div className="flex min-w-0 items-center gap-2">
						<span className="shrink-0 text-[12px] text-text-muted/50">
							{formatDate(message.created_at, true)}
						</span>

						<MessageStatusView role="assistant" status={status} />
					</div>

					{!isPending && isCompleted && (
						<menu className="flex shrink-0 items-center">
							<button
								type="button"
								disabled={!canCopy}
								onClick={() => {
									void handleCopy(message.content);
								}}
								aria-label="کپی پاسخ"
								className="size-7 cursor-pointer rounded-full border-2 border-transparent p-1 transition-all duration-150 hover:border-border disabled:cursor-not-allowed disabled:opacity-40">
								<Copy
									strokeWidth={1.5}
									className="size-full text-text-muted/60"
								/>
							</button>
							<button
								type="button"
								onClick={handleLike}
								aria-label="پاسخ مفید بود"
								className="size-7 cursor-pointer rounded-full border-2 border-transparent p-1 transition-all duration-150 hover:border-border">
								<ThumbsUp
									strokeWidth={1.5}
									className="size-full text-text-muted/60"
								/>
							</button>

							<button
								type="button"
								onClick={handleDislike}
								aria-label="پاسخ مفید نبود"
								className="size-7 cursor-pointer rounded-full border-2 border-transparent p-1 transition-all duration-150 hover:border-border">
								<ThumbsDown
									strokeWidth={1.5}
									className="size-full text-text-muted/60"
								/>
							</button>
						</menu>
					)}
				</div>

				{message.error && message.error.trim() !== message.content.trim() ? (
					<p
						dir="rtl"
						className="w-full text-right text-[12px] text-primary-red">
						{message.error}
					</p>
				) : null}
			</div>
		</div>
	);
}

export default function Message({ message }: MessageProps) {
	if (message.role === "user") {
		return <UserMessage message={message} />;
	}

	return <AssistantMessage message={message} />;
}

function resolveMessageStatus(status: MessageObject["status"]): MessageStatus {
	/*
	 * Messages loaded from the API currently have no lifecycle field.
	 * They are historical, successfully persisted messages.
	 */
	return status ?? "sent";
}
