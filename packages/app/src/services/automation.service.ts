import { API_ROUTES } from "@/constant/api-routes.ts";
import type { ApiResponse } from "@/packages/types/api.types.ts";
import type {
	Automation,
	AutomationAlert,
	PublishAutomationRequest,
	TestRunAutomationRequest,
	TestRunAutomationResponse,
} from "@/packages/types/automation.types.ts";
import { uptionsRequest } from "@/services/api.service.ts";

export class AutomationService {
	alerts() {
		return uptionsRequest.GET<ApiResponse<AutomationAlert[]>>(
			API_ROUTES.automations.alerts,
		);
	}

	list() {
		return uptionsRequest.GET<ApiResponse<Automation[]>>(
			API_ROUTES.automations.list,
		);
	}

	publish(payload: PublishAutomationRequest) {
		return uptionsRequest.POST<
			ApiResponse<Automation>,
			PublishAutomationRequest
		>(API_ROUTES.automations.publish, payload);
	}

	testRun(payload: TestRunAutomationRequest) {
		return uptionsRequest.POST<
			ApiResponse<TestRunAutomationResponse>,
			TestRunAutomationRequest
		>(API_ROUTES.automations.testRun, payload);
	}
}

export const automationService = new AutomationService();
