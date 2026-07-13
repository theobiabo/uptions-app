import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateTradeIntentRequest,
	SubmitSignedTradeRequest,
} from "@/packages/types/trade.types.ts";
import { tradeService } from "@/services/trade.service.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";

export const tradesQueryKey = ["trades"] as const;

export function useTrades() {
	const query = useQuery({
		queryFn: () => tradeService.list(),
		queryKey: tradesQueryKey,
	});

	return {
		error: getRequestErrorMessage(query.error, "Unable to fetch trades"),
		isLoading: query.isLoading,
		refetch: query.refetch,
		trades: query.data?.data ?? [],
	};
}

export function useCancelTrade() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tradeId: string) => tradeService.cancel(tradeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tradesQueryKey });
		},
	});
}

export function useCreateTradeIntent() {
	return useMutation({
		mutationFn: (payload: CreateTradeIntentRequest) =>
			tradeService.createIntent(payload),
	});
}

export function useReconcileTrade() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tradeId: string) => tradeService.reconcile(tradeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tradesQueryKey });
		},
	});
}

export function useSubmitSignedTrade() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			payload,
			tradeId,
		}: {
			payload: SubmitSignedTradeRequest;
			tradeId: string;
		}) => tradeService.submitSignedOrder(tradeId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tradesQueryKey });
		},
	});
}
