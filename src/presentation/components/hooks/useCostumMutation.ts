/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCustomMutation<TData, TVariables>(
	func: (vars: TVariables) => Promise<TData>,
	queryKeyToInvalidate?: any[],
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: func,
		onSuccess: () => {
			if (queryKeyToInvalidate) {
				queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
			}
		},
	});
}
