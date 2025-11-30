import { useState, useEffect, useCallback } from "react";

export function useFetch<T>(endpoint: string) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError("");

		try {
			const url = `${import.meta.env.VITE_API_URL}api/${endpoint}`;
			const res = await fetch(url);

			if (!res.ok) {
				throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
			}

			const json = await res.json();
			setData(json);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setError(String(err));
		} finally {
			setLoading(false);
		}
	}, [endpoint]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}
