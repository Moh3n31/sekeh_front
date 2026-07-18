import { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

type ContentEvent = { delta: string };

export type Job = {
	job_title: string;
	company_name: string;
	match_percent: number;
	requirements: string[];
	job_url: string;
	source_site: string;
	company_reviews: { rating: number; count: number };
	paycheck: string;
};

type JobsEvent = { items: Job[] };
type StreamErrorEvent = { message: string };

interface UseChatStreamReturn {
	sendMessage: (content: string) => Promise<void>;
	abort: () => void;
	isPending: boolean;
	isStreaming: boolean;
	streamError: string | null;
	assistantStreamingText: string;
	jobs: Job[];
}

export function useChatStream(id: number | string): UseChatStreamReturn {
	const queryClient = useQueryClient();

	const [isPending, setIsPending] = useState(false);
	const [isStreaming, setIsStreaming] = useState(false);
	const [streamError, setStreamError] = useState<string | null>(null);
	const [assistantStreamingText, setAssistantStreamingText] = useState("");
	const [jobs, setJobs] = useState<Job[]>([]);

	const controllerRef = useRef<AbortController | null>(null);
	const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
		null,
	);

	const resetState = useCallback((clearText = false) => {
		setIsStreaming(false);
		setIsPending(false);
		if (clearText) {
			setAssistantStreamingText("");
			setJobs([]);
		}
	}, []);

	const abort = useCallback(() => {
		readerRef.current?.cancel();
		readerRef.current = null;
		controllerRef.current?.abort();
		controllerRef.current = null;
		resetState(true);
	}, [resetState]);

	const sendMessage = async (content: string) => {
		if (!content.trim()) return;

		// Cancel any in-flight stream before starting a new one
		if (controllerRef.current) {
			readerRef.current?.cancel();
			readerRef.current = null;
			controllerRef.current.abort();
			controllerRef.current = null;
		}

		setIsPending(true);
		setStreamError(null);
		setAssistantStreamingText("");
		setJobs([]);

		const controller = new AbortController();
		controllerRef.current = controller;

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}api/chats/${id}/messages`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("access_token")}`,
						"Content-Type": "application/json",
						Accept: "text/event-stream",
					},
					body: JSON.stringify({ content }),
					signal: controller.signal,
				},
			);

			if (!res.ok) {
				const errorJson = await res.json();
				throw new Error(errorJson.error || "Failed to send message");
			}

			if (!res.body) throw new Error("No response body");

			setIsPending(false);
			setIsStreaming(true);

			const reader = res.body.getReader();
			readerRef.current = reader;
			const decoder = new TextDecoder();
			let buffer = "";

			try {
				while (true) {
					const { value, done } = await reader.read();

					if (done) {
						// Flush any remaining bytes in the decoder
						buffer += decoder.decode(undefined, { stream: false });
						break;
					}

					buffer += decoder.decode(value, { stream: true });

					const events = buffer.split("\n\n");
					buffer = events.pop() ?? "";

					for (const raw of events) {
						const lines = raw.split("\n");
						let eventType = "";
						let dataStr = "";

						for (const line of lines) {
							if (line.startsWith("event:")) {
								eventType = line.slice(6).trim();
							} else if (line.startsWith("data:")) {
								dataStr += line.slice(5);
							}
						}

						if (!eventType || !dataStr) continue;

						let parsed: unknown;
						try {
							parsed = JSON.parse(dataStr.trim());
						} catch {
							continue;
						}

						switch (eventType) {
							case "meta": {
								// Available for consumers who need chat metadata (e.g. title changes)
								break;
							}

							case "content": {
								// Payload shape: { delta: "..." }
								const { delta } = parsed as ContentEvent;
								setAssistantStreamingText((prev) => prev + delta);
								break;
							}

							case "jobs": {
								// Arrives once before/after the content stream with matched listings
								const { items } = parsed as JobsEvent;
								setJobs(items);
								break;
							}

							case "done": {
								setAssistantStreamingText("");
								resetState(false);
								queryClient.invalidateQueries({
									queryKey: ["chatMessages", id],
								});
								break;
							}

							case "error": {
								const err = parsed as StreamErrorEvent;
								setStreamError(err.message);
								resetState(true);
								break;
							}
						}
					}
				}
			} finally {
				readerRef.current = null;
			}

			resetState(false);
		} catch (err: unknown) {
			if (err instanceof Error && err.name === "AbortError") return;

			const message = err instanceof Error ? err.message : "Stream failed";
			setStreamError(message);
			resetState(true);
		}
	};

	return {
		sendMessage,
		abort,
		isPending,
		isStreaming,
		streamError,
		assistantStreamingText,
		jobs,
	};
}
