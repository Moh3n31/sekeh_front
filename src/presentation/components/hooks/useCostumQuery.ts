/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiResponse } from "../../../services/api";

interface CustomQueryProps<T> {
	key: any[];
	func: () => Promise<ApiResponse<T>>;
	options?: {
		enabled?: boolean;
		onSuccess?: (data: T) => void;
	};
}

export function useCustomQuery<T>({
	key,
	func,
	options,
}: CustomQueryProps<T>): UseQueryResult<ApiResponse<T>, Error> {
	return useQuery({
		queryKey: key,
		queryFn: func,
		...options,

		retry: 1,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 10,
		refetchOnMount: true,
	});
}
