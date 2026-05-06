import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

type MetaEvent = {
	chat: { chat_id: number; title: string };
	user_message_id: number;
	type: "chat" | "analyze" | "error";
	title_changed: boolean;
};

type DeltaEvent = { text: string };
type DoneEvent = { bot_message_id: number };
type StreamErrorEvent = { message: string };

type SSEEvent =
	| { event: "meta"; data: MetaEvent }
	| { event: "delta"; data: DeltaEvent }
	| { event: "done"; data: DoneEvent }
	| { event: "error"; data: StreamErrorEvent };

interface UseChatStreamReturn {
	sendMessage: (content: string) => Promise<void>;
	abort: () => void;
	isPending: boolean;
	isStreaming: boolean;
	streamError: string | null;
	assistantStreamingText: string;
}

export function useChatStream(id: number | string): UseChatStreamReturn {
	const queryClient = useQueryClient();

	const [isPending, setIsPending] = useState(false);
	const [isStreaming, setIsStreaming] = useState(false);
	const [streamError, setStreamError] = useState<string | null>(null);
	const [assistantStreamingText, setAssistantStreamingText] = useState("");

	const controllerRef = useRef<AbortController | null>(null);
	const hasStartedStreamingRef = useRef(false);

	const abort = () => {
		controllerRef.current?.abort();
		setIsStreaming(false);
		setIsPending(false);
		setAssistantStreamingText("");
		hasStartedStreamingRef.current = false;
	};

	const sendMessage = async (content: string) => {
		if (!content.trim()) return;

		abort(); // cancel any previous stream

		setIsPending(true);
		setStreamError(null);
		setAssistantStreamingText("");

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
			const decoder = new TextDecoder();
			let buffer = "";

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });

				const events = buffer.split("\n\n");
				buffer = events.pop() || "";

				for (const raw of events) {
					const lines = raw.split("\n");
					let eventType = "";
					let dataStr = "";

					for (const line of lines) {
						if (line.startsWith("event:")) {
							eventType = line.slice(6).trim();
						}
						if (line.startsWith("data:")) {
							dataStr += line.slice(5) + "\n";
						}
					}

					if (!eventType || !dataStr) continue;

					let parsed: any;
					try {
						parsed = JSON.parse(dataStr);
					} catch {
						// reset buffer on malformed JSON
						continue;
					}

					switch (eventType) {
						case "meta": {
							// meta event received before streaming starts
							break;
						}

						case "content": {
							const delta: DeltaEvent = parsed;

							if (!hasStartedStreamingRef.current) {
								hasStartedStreamingRef.current = true;
							}

							setAssistantStreamingText((prev) => prev + delta.text);
							break;
						}

						case "done": {
							setIsStreaming(false);
							hasStartedStreamingRef.current = false;

							queryClient.invalidateQueries({ queryKey: ["chatMessages", id] });

							break;
						}

						case "error": {
							const err: StreamErrorEvent = parsed;
							setStreamError(err.message);
							setIsStreaming(false);
							hasStartedStreamingRef.current = false;
							break;
						}
					}
				}
			}

			setIsStreaming(false);
			hasStartedStreamingRef.current = false;
		} catch (err: any) {
			if (err.name === "AbortError") return;

			setStreamError(err.message || "Stream failed");
			setIsPending(false);
			setIsStreaming(false);
			hasStartedStreamingRef.current = false;
			setAssistantStreamingText("");
		}
	};

	return {
		sendMessage,
		abort,
		isPending,
		isStreaming,
		streamError,
		assistantStreamingText,
	};
}
