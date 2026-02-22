/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiResponse } from "../../../services/api";

interface CustomQueryProps<T> {
	key: any[];
	func: () => Promise<ApiResponse<T>>;
}

export function useCustomQuery<T>({
	key,
	func,
}: CustomQueryProps<T>): UseQueryResult<ApiResponse<T>, Error> {
	return useQuery({
		queryKey: key,
		queryFn: func,

		retry: 1,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
}
