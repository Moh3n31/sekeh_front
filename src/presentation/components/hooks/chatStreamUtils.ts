export interface ParsedSseEvent<TData = unknown> {
	eventType: string;
	data: TData;
}

/**
 * Appends a decoded stream chunk to the existing buffer and extracts all
 * complete SSE event blocks.
 *
 * The last incomplete block remains in `remaining` and must be passed back
 * into this function when the next chunk arrives.
 */
export function extractSseEvents(
	buffer: string,
	chunk: Uint8Array | undefined,
	decoder: TextDecoder,
): {
	events: string[];
	remaining: string;
} {
	const decodedChunk = chunk
		? decoder.decode(chunk, { stream: true })
		: decoder.decode();

	/*
	 * SSE can use:
	 * - \n
	 * - \r\n
	 * - \r
	 *
	 * Normalizing line endings lets us reliably detect the blank line that
	 * separates two events.
	 */
	const normalizedBuffer = `${buffer}${decodedChunk}`
		.replace(/\r\n/g, "\n")
		.replace(/\r/g, "\n");

	const blocks = normalizedBuffer.split("\n\n");
	const remaining = blocks.pop() ?? "";

	return {
		events: blocks.filter((block) => block.length > 0),
		remaining,
	};
}

/**
 * Parses one complete SSE event block.
 *
 * Expected format:
 *
 * event: content
 * data: {"delta":"Hello"}
 *
 * Multiple data lines are joined using a newline, according to the SSE
 * specification.
 */
export function parseSseEvent<TData = unknown>(
	rawEvent: string,
): ParsedSseEvent<TData> | null {
	const lines = rawEvent.split("\n");

	let eventType = "";
	const dataLines: string[] = [];

	for (const line of lines) {
		/*
		 * Lines beginning with ":" are SSE comments or heartbeat messages.
		 */
		if (line.startsWith(":")) {
			continue;
		}

		if (line.startsWith("event:")) {
			eventType = removeOptionalLeadingSpace(line.slice("event:".length));
			continue;
		}

		if (line.startsWith("data:")) {
			/*
			 * Do not call trim() here.
			 *
			 * A content delta may intentionally begin or end with whitespace.
			 * Trimming each data line can turn:
			 *
			 * "Hello" + " world"
			 *
			 * into:
			 *
			 * "Hello" + "world"
			 */
			dataLines.push(
				removeOptionalLeadingSpace(line.slice("data:".length)),
			);
		}
	}

	if (!eventType || dataLines.length === 0) {
		return null;
	}

	const serializedData = dataLines.join("\n");

	if (!serializedData) {
		return null;
	}

	try {
		return {
			eventType,
			data: JSON.parse(serializedData) as TData,
		};
	} catch {
		return null;
	}
}

/**
 * SSE allows one optional space after a field's colon.
 *
 * Only that one protocol-level space is removed. All other whitespace is
 * preserved because it may be part of a streamed content delta.
 */
function removeOptionalLeadingSpace(value: string): string {
	return value.startsWith(" ") ? value.slice(1) : value;
}