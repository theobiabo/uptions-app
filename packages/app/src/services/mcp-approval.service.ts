import { API_ROUTES } from "@/constant/api-routes.ts";
import type { ApiResponse } from "@/packages/types/api.types.ts";
import type {
	McpApproval,
	McpApprovalDecisionResponse,
} from "@/packages/types/automation.types.ts";
import { uptionsRequest } from "@/services/api.service.ts";

export class McpApprovalService {
	approve(approvalId: string) {
		return uptionsRequest.POST<ApiResponse<McpApprovalDecisionResponse>>(
			API_ROUTES.mcp.approve(approvalId),
		);
	}

	get(approvalId: string) {
		return uptionsRequest.GET<ApiResponse<McpApproval>>(
			API_ROUTES.mcp.approval(approvalId),
		);
	}

	list() {
		return uptionsRequest.GET<ApiResponse<McpApproval[]>>(
			API_ROUTES.mcp.approvals,
		);
	}

	reject(approvalId: string) {
		return uptionsRequest.POST<ApiResponse<McpApprovalDecisionResponse>>(
			API_ROUTES.mcp.reject(approvalId),
		);
	}
}

export const mcpApprovalService = new McpApprovalService();
