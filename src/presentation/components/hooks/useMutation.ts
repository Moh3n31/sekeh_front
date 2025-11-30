import { useState, useCallback } from "react";

export interface MutationArgs {
	url: string;
	options?: {
		method: "POST" | "PATCH";
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		body: Record<string, any>;
	};
}

export function useMutation<T>() {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const apiBaseUrl = import.meta.env.VITE_API_URL;

	const fetchData = useCallback(
		async ({ url, options }: MutationArgs) => {
			setLoading(true);
			setError("");

			try {
				const finalOptions: RequestInit = {
					method: options?.method ?? "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body:
						options && "body" in options
							? JSON.stringify(options.body)
							: undefined,
				};

				const res = await fetch(
					`${apiBaseUrl}api/${url}`,
					finalOptions
				);

				// HTTP-level error
				if (!res.ok) {
					console.log(
						`HTTP error in useFetch:\n${res.status}\n${res.statusText}`
					);
					// structure goes here
					throw new Error(`HTTP error: ${res.status}`);
				}
				const json = await res.json();
				setData(json);
			} catch (err) {
				console.log("Network or parsing error in useFetch:\n", err);
				// structure goes here
				setError(String(err));
			} finally {
				setLoading(false);
			}
		},
		[apiBaseUrl]
	);

	return { data, loading, error, mutate: fetchData };
}
