import {
	useMutation,
	useQueryClient,
	type QueryKey,
	type UseMutationOptions,
	type UseMutationResult,
} from "@tanstack/react-query";
import type { Exceptions } from "../../../services/api";
import type { AxiosError } from "axios";
import { toast } from "../../../services/toast";

export function useCustomMutation<
	TData = unknown,
	TVariables = void,
	TContext = unknown,
	TError = AxiosError<Exceptions>,
>(
	mutationFn: (variables: TVariables) => Promise<TData>,
	options?: UseMutationOptions<TData, TError, TVariables, TContext>,
	queryKeyToInvalidate?: QueryKey | QueryKey[],
): UseMutationResult<TData, TError, TVariables, TContext> {
	const queryClient = useQueryClient();

	return useMutation<TData, TError, TVariables, TContext>({
		mutationFn,
		...options,
		onSuccess: (data, variables, onMutateResult, context) => {
			options?.onSuccess?.(data, variables, onMutateResult, context);

			if (queryKeyToInvalidate) {
				const keys = Array.isArray(queryKeyToInvalidate)
					? queryKeyToInvalidate
					: [queryKeyToInvalidate];

				keys.forEach((key) => {
					queryClient.invalidateQueries({ queryKey: key });
				});
			}
		},
		onError: (data, variables, onMutateResult, context) => {
			options?.onError?.(data, variables, onMutateResult, context);

			const error = data as AxiosError<Exceptions>;
			toast.error(error.response?.data.error ?? "خطای ناشناخته");
		},
	});
}
