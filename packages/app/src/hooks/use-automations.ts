import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	AutomationStatus,
	PublishAutomationRequest,
	TestRunAutomationRequest,
} from "@/packages/types/automation.types.ts";
import { getAuthToken } from "@/services/auth-token.service.ts";
import { automationService } from "@/services/automation.service.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";

export const automationsQueryKey = ["automations"] as const;
export const automationAlertsQueryKey = ["automation-alerts"] as const;

export function useAutomations() {
	const query = useQuery({
		enabled: Boolean(getAuthToken()),
		queryFn: () => automationService.list(),
		queryKey: automationsQueryKey,
	});

	return {
		automations: query.data?.data ?? [],
		error: getRequestErrorMessage(query.error, "Unable to fetch automations"),
		isLoading: query.isLoading,
		refetch: query.refetch,
	};
}

export function useAutomationAlerts() {
	const query = useQuery({
		enabled: Boolean(getAuthToken()),
		queryFn: () => automationService.alerts(),
		queryKey: automationAlertsQueryKey,
	});

	return {
		alerts: query.data?.data ?? [],
		error: getRequestErrorMessage(query.error, "Unable to fetch alerts"),
		isLoading: query.isLoading,
		refetch: query.refetch,
	};
}

export function usePublishAutomation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: PublishAutomationRequest) =>
			automationService.publish(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: automationsQueryKey });
		},
	});
}

export function useUpdateAutomation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			automationId,
			payload,
		}: {
			automationId: string;
			payload: PublishAutomationRequest;
		}) => automationService.update(automationId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: automationsQueryKey });
		},
	});
}

export function useSetAutomationStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			automationId,
			status,
		}: {
			automationId: string;
			status: AutomationStatus;
		}) => automationService.setStatus(automationId, { status }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: automationsQueryKey });
		},
	});
}

export function useDeleteAutomation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (automationId: string) =>
			automationService.delete(automationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: automationsQueryKey });
			queryClient.invalidateQueries({ queryKey: automationAlertsQueryKey });
		},
	});
}

export function useTestRunAutomation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: TestRunAutomationRequest) =>
			automationService.testRun(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: automationsQueryKey });
			queryClient.invalidateQueries({ queryKey: automationAlertsQueryKey });
		},
	});
}
