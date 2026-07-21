import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { Job as ChatJob } from "../../../services/chat";
import { extractSseEvents, parseSseEvent } from "./chatStreamUtils";

export type Job = ChatJob;

export type ChatStreamStatus =
	| "idle"
	| "sending"
	| "waiting"
	| "streaming"
	| "completed"
	| "failed"
	| "stopped";

export interface SendMessageResult {
	success: boolean;
	accepted: boolean;
	stopped: boolean;
	error?: string;
}

export interface UseChatStreamReturn {
	sendMessage: (content: string) => Promise<SendMessageResult>;
	abort: () => void;
	resetStream: () => void;

	status: ChatStreamStatus;
	requestAccepted: boolean;

	/**
	 * Compatibility values.
	 *
	 * New components should preferably use `status`, `requestAccepted`,
	 * and `isBusy` because they describe the flow more precisely.
	 */
	isPending: boolean;
	isWaiting: boolean;
	isStreaming: boolean;
	isBusy: boolean;

	streamError: string | null;
	assistantStreamingText: string;
	jobs: Job[];
}

interface ContentEvent {
	delta?: unknown;
}

interface JobsEvent {
	items?: unknown;
}

interface StreamErrorEvent {
	message?: unknown;
	error?: unknown;
	detail?: unknown;
}

interface ActiveRequest {
	controller: AbortController;
	reader: ReadableStreamDefaultReader<Uint8Array> | null;
	accepted: boolean;
	manuallyStopped: boolean;
}

type TerminalStreamEvent =
	| {
			type: "done";
	  }
	| {
			type: "error";
			message: string;
	  }
	| {
			type: "stopped";
	  };

const EMPTY_MESSAGE_ERROR = "پیام نمی‌تواند خالی باشد.";
const INVALID_CHAT_ERROR = "شناسه گفتگو معتبر نیست.";
const DEFAULT_SEND_ERROR = "ارسال پیام با خطا مواجه شد.";
const DEFAULT_STREAM_ERROR = "دریافت پاسخ با خطا مواجه شد.";

export function useChatStream(id: number | string): UseChatStreamReturn {
	const queryClient = useQueryClient();

	const [status, setStatus] = useState<ChatStreamStatus>("idle");
	const [requestAccepted, setRequestAccepted] = useState(false);
	const [streamError, setStreamError] = useState<string | null>(null);
	const [assistantStreamingText, setAssistantStreamingText] = useState("");
	const [jobs, setJobs] = useState<Job[]>([]);

	const activeRequestRef = useRef<ActiveRequest | null>(null);

	const isPending = status === "sending" || status === "waiting";
	const isWaiting = status === "waiting";
	const isStreaming = status === "streaming";
	const isBusy =
		status === "sending" || status === "waiting" || status === "streaming";

	const refreshChatQueries = useCallback(async () => {
		/*
		 * Refreshing history must not turn a successful stream into a failed
		 * stream if React Query itself cannot refetch immediately.
		 */
		await Promise.allSettled([
			queryClient.invalidateQueries({
				queryKey: ["chatMessages", id],
			}),
			queryClient.invalidateQueries({
				queryKey: ["chatHistory"],
			}),
		]);
	}, [id, queryClient]);

	const stopActiveRequest = useCallback((updateVisibleState: boolean) => {
		const activeRequest = activeRequestRef.current;

		if (!activeRequest) {
			return;
		}

		activeRequest.manuallyStopped = true;
		activeRequest.controller.abort();

		void activeRequest.reader?.cancel().catch(() => undefined);

		/*
		 * Remove it immediately so a newly submitted request cannot be
		 * affected by the finishing catch/finally block of the old one.
		 */
		activeRequestRef.current = null;

		if (updateVisibleState) {
			setStatus("stopped");
			setStreamError(null);
		}
	}, []);

	const abort = useCallback(() => {
		stopActiveRequest(true);
	}, [stopActiveRequest]);

	const resetStream = useCallback(() => {
		stopActiveRequest(false);

		setStatus("idle");
		setRequestAccepted(false);
		setStreamError(null);
		setAssistantStreamingText("");
		setJobs([]);
	}, [stopActiveRequest]);

	useEffect(() => {
		return () => {
			/*
			 * Cleanup must not update React state while the component is
			 * unmounting.
			 */
			stopActiveRequest(false);
		};
	}, [stopActiveRequest]);

	const sendMessage = useCallback(
		async (content: string): Promise<SendMessageResult> => {
			const trimmedContent = content.trim();
			const chatId = String(id).trim();

			if (!trimmedContent) {
				return {
					success: false,
					accepted: false,
					stopped: false,
					error: EMPTY_MESSAGE_ERROR,
				};
			}

			if (!chatId) {
				return {
					success: false,
					accepted: false,
					stopped: false,
					error: INVALID_CHAT_ERROR,
				};
			}

			/*
			 * This should normally be prevented by the disabled form, but
			 * cancelling here makes the hook safe when called directly.
			 */
			stopActiveRequest(false);

			setStatus("sending");
			setRequestAccepted(false);
			setStreamError(null);
			setAssistantStreamingText("");
			setJobs([]);

			const request: ActiveRequest = {
				controller: new AbortController(),
				reader: null,
				accepted: false,
				manuallyStopped: false,
			};

			activeRequestRef.current = request;

			const isCurrentRequest = () => activeRequestRef.current === request;

			const processEvents = (
				rawEvents: string[],
			): TerminalStreamEvent | null => {
				for (const rawEvent of rawEvents) {
					if (request.manuallyStopped || !isCurrentRequest()) {
						return {
							type: "stopped",
						};
					}

					const event = parseSseEvent(rawEvent);

					if (!event) {
						continue;
					}

					switch (event.eventType) {
						case "content": {
							const data = event.data as ContentEvent;
							const delta = typeof data?.delta === "string" ? data.delta : "";

							if (!delta) {
								break;
							}

							setStatus("streaming");
							setAssistantStreamingText((previousText) => previousText + delta);
							break;
						}

						case "jobs": {
							const data = event.data as JobsEvent;

							if (!Array.isArray(data?.items)) {
								break;
							}

							const nextJobs = data.items as Job[];

							setJobs(nextJobs);

							if (nextJobs.length > 0) {
								setStatus("streaming");
							}

							break;
						}

						case "done":
							return {
								type: "done",
							};

						case "error": {
							const message = getStreamEventErrorMessage(event.data);

							return {
								type: "error",
								message,
							};
						}

						default:
							break;
					}
				}

				return null;
			};

			const finishFromTerminalEvent = async (
				terminalEvent: TerminalStreamEvent,
			): Promise<SendMessageResult> => {
				if (terminalEvent.type === "stopped") {
					return {
						success: false,
						accepted: request.accepted,
						stopped: true,
					};
				}

				if (terminalEvent.type === "error") {
					if (isCurrentRequest()) {
						setStatus("failed");
						setStreamError(terminalEvent.message);
					}

					return {
						success: false,
						accepted: request.accepted,
						stopped: false,
						error: terminalEvent.message,
					};
				}

				if (isCurrentRequest()) {
					setStatus("completed");
					setStreamError(null);
				}

				await refreshChatQueries();

				return {
					success: true,
					accepted: true,
					stopped: false,
				};
			};

			try {
				const response = await fetch(createMessagesEndpoint(chatId), {
					method: "POST",
					headers: createRequestHeaders(),
					body: JSON.stringify({
						content: trimmedContent,
					}),
					signal: request.controller.signal,
				});

				if (!response.ok) {
					throw new Error(await readResponseError(response));
				}

				/*
				 * From this point onward, the user's message has reached and
				 * been accepted by the endpoint. The assistant may now become
				 * visible in the chat.
				 */
				request.accepted = true;

				if (isCurrentRequest()) {
					setRequestAccepted(true);
					setStatus("waiting");
				}

				if (!response.body) {
					throw new Error("پاسخ قابل خواندن از سرور دریافت نشد.");
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();

				request.reader = reader;

				let buffer = "";

				while (true) {
					const { value, done } = await reader.read();

					if (request.manuallyStopped || !isCurrentRequest()) {
						return {
							success: false,
							accepted: request.accepted,
							stopped: true,
						};
					}

					if (done) {
						/*
						 * Flush any remaining bytes held internally by the
						 * TextDecoder.
						 */
						const finalExtraction = extractSseEvents(
							buffer,
							undefined,
							decoder,
						);

						const finalEvents = [...finalExtraction.events];

						/*
						 * Some servers close the stream without a final blank
						 * line. At EOF, the remaining block is complete and
						 * should still be processed.
						 */
						if (finalExtraction.remaining) {
							finalEvents.push(finalExtraction.remaining);
						}

						const terminalEvent = processEvents(finalEvents);

						if (terminalEvent) {
							return await finishFromTerminalEvent(terminalEvent);
						}

						/*
						 * A normal EOF without an explicit `done` event is
						 * still considered a completed response.
						 */
						return await finishFromTerminalEvent({
							type: "done",
						});
					}

					const extraction = extractSseEvents(buffer, value, decoder);

					buffer = extraction.remaining;

					const terminalEvent = processEvents(extraction.events);

					if (terminalEvent) {
						return await finishFromTerminalEvent(terminalEvent);
					}
				}
			} catch (error: unknown) {
				const wasStopped = request.manuallyStopped || isAbortError(error);

				if (wasStopped) {
					if (isCurrentRequest()) {
						setStatus("stopped");
						setStreamError(null);
					}

					return {
						success: false,
						accepted: request.accepted,
						stopped: true,
					};
				}

				const message =
					error instanceof Error ? error.message : DEFAULT_STREAM_ERROR;

				if (isCurrentRequest()) {
					setStatus("failed");
					setStreamError(message);
				}

				return {
					success: false,
					accepted: request.accepted,
					stopped: false,
					error: message,
				};
			} finally {
				if (isCurrentRequest()) {
					activeRequestRef.current = null;
				}

				request.reader = null;
			}
		},
		[id, refreshChatQueries, stopActiveRequest],
	);

	return {
		sendMessage,
		abort,
		resetStream,

		status,
		requestAccepted,

		isPending,
		isWaiting,
		isStreaming,
		isBusy,

		streamError,
		assistantStreamingText,
		jobs,
	};
}

function createMessagesEndpoint(chatId: string): string {
	const baseUrl = String(import.meta.env.VITE_API_URL ?? "").replace(
		/\/+$/,
		"",
	);

	return `${baseUrl}/api/chats/${encodeURIComponent(chatId)}/messages`;
}

function createRequestHeaders(): HeadersInit {
	const accessToken = localStorage.getItem("access_token");

	return {
		...(accessToken
			? {
					Authorization: `Bearer ${accessToken}`,
				}
			: {}),
		"Content-Type": "application/json",
		Accept: "text/event-stream",
	};
}

async function readResponseError(response: Response): Promise<string> {
	const fallbackMessage = `${DEFAULT_SEND_ERROR} (${response.status})`;

	try {
		const responseText = await response.text();

		if (!responseText) {
			return fallbackMessage;
		}

		try {
			const payload = JSON.parse(responseText) as unknown;

			return getErrorMessageFromUnknown(payload) ?? fallbackMessage;
		} catch {
			/*
			 * Do not show an entire HTML proxy error page as a chat error.
			 */
			return responseText.length <= 300 ? responseText : fallbackMessage;
		}
	} catch {
		return fallbackMessage;
	}
}

function getStreamEventErrorMessage(data: unknown): string {
	return getErrorMessageFromUnknown(data) ?? DEFAULT_STREAM_ERROR;
}

function getErrorMessageFromUnknown(value: unknown): string | null {
	if (typeof value === "string") {
		const message = value.trim();

		return message || null;
	}

	if (!isRecord(value)) {
		return null;
	}

	const possibleMessages = [value.message, value.error, value.detail];

	for (const possibleMessage of possibleMessages) {
		if (typeof possibleMessage !== "string") {
			continue;
		}

		const message = possibleMessage.trim();

		if (message) {
			return message;
		}
	}

	return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAbortError(error: unknown): boolean {
	return error instanceof DOMException && error.name === "AbortError";
}
