/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	useQuery,
	type UseQueryResult,
	type QueryKey,
	type UseQueryOptions,
} from "@tanstack/react-query";
import type { ApiResponse } from "../../../services/api";
import type { AxiosError } from "axios";
import { useRef } from "react";

interface CustomQueryProps<TData = unknown, TError = AxiosError> {
	key: QueryKey;
	func: () => Promise<ApiResponse<TData>>;
	options?: Omit<
		UseQueryOptions<ApiResponse<TData>, TError>,
		"queryKey" | "queryFn"
	>;
	deduplicate?: boolean;
	debounceTime?: number;
}

export function useCustomQuery<TData = unknown, TError = AxiosError>({
	key,
	func,
	options,
	deduplicate = true,
	debounceTime = 300,
}: CustomQueryProps<TData, TError>): UseQueryResult<
	ApiResponse<TData>,
	TError
> {
	const requestCountRef = useRef(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const deduplicatedQueryFn = async () => {
		if (!deduplicate) {
			return func();
		}

		requestCountRef.current += 1;
		const currentRequestId = requestCountRef.current;

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		await new Promise((resolve) => {
			timeoutRef.current = setTimeout(resolve, debounceTime);
		});

		if (currentRequestId !== requestCountRef.current) {
			throw new Error("Request cancelled due to duplicate");
		}

		return func();
	};

	return useQuery<ApiResponse<TData>, TError>({
		queryKey: key,
		queryFn: deduplicatedQueryFn,
		...options,
		retry: 1,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 10,
		refetchOnMount: true,
	});
}
