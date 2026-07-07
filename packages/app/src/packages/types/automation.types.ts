export type WorkflowPayload = {
	edges: Array<{
		id: string;
		source: string;
		target: string;
		type?: string;
	}>;
	nodes: Array<{
		data: {
			description: string;
			id: string;
			kind: string;
			title: string;
			value: string;
			venue: string;
		};
		id: string;
		position: {
			x: number;
			y: number;
		};
		type?: string;
	}>;
};

export type PublishAutomationRequest = {
	market_id?: string;
	market_title?: string;
	title: string;
	venue: string;
	workflow: WorkflowPayload;
};

export type TestRunAutomationRequest = PublishAutomationRequest & {
	automation_id?: string;
};

export type Automation = {
	created_at: string;
	id: string;
	last_run_at: string | null;
	last_run_status: string | null;
	market_id: string | null;
	market_title: string | null;
	status: string;
	title: string;
	updated_at: string;
	venue: string;
	workflow: WorkflowPayload;
};

export type AutomationAlert = {
	automation_id: string | null;
	created_at: string;
	id: string;
	message: string;
	meta: Record<string, unknown>;
	status: string;
	title: string;
};

export type TestRunAutomationResponse = {
	alert: AutomationAlert;
	checked_blocks: number;
	message: string;
	status: string;
};
