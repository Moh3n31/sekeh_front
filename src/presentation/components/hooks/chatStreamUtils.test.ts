import { describe, expect, it } from "vitest";
import { extractSseEvents, parseSseEvent } from "./chatStreamUtils";

describe("chat stream helpers", () => {
	it("parses complete SSE events and keeps incomplete trailing data", () => {
		const decoder = new TextDecoder();
		const payload = "event: content\ndata: {\"delta\":\"hi\"}\n\n";
		const { events, remaining } = extractSseEvents(
			"",
			new TextEncoder().encode(payload),
			decoder,
		);

		expect(events).toHaveLength(1);
		expect(remaining).toBe("");
		expect(parseSseEvent(events[0])).toEqual({
			eventType: "content",
			data: { delta: "hi" },
		});
	});

	it("preserves a partial event for the next chunk", () => {
		const decoder = new TextDecoder();
		const firstChunk = "event: content\ndata: {\"delta\":\"hel";
		const { events, remaining } = extractSseEvents(
			"",
			new TextEncoder().encode(firstChunk),
			decoder,
		);

		expect(events).toHaveLength(0);
		expect(remaining).toBe(firstChunk);
	});
});
