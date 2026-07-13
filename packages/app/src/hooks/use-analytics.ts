import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service.ts";
import { getAuthToken } from "@/services/auth-token.service.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";

export const analyticsOverviewQueryKey = ["analytics", "overview"] as const;

export function useAnalyticsOverview() {
	const query = useQuery({
		enabled: Boolean(getAuthToken()),
		queryFn: () => analyticsService.overview(),
		queryKey: analyticsOverviewQueryKey,
	});

	return {
		error: getRequestErrorMessage(query.error, "Unable to load analytics"),
		isLoading: query.isLoading,
		overview: query.data?.data,
		refetch: query.refetch,
	};
}
