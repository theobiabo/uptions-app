import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Typography } from "@/components/typography/typography.tsx";
import { cn } from "@/lib/utils.ts";
import {
	analyticsMetrics,
	dailyActivity,
	portfolioMarkers,
	portfolioPath,
	riskMetrics,
	workflowPerformance,
} from "@/packages/analytics/analytics-data.ts";

export function AnalyticsPage() {
	return (
		<DashboardLayout>
			<div className="grid gap-5 px-5 py-5 sm:px-8">
				<MetricGrid />
				<PortfolioCard />
				<div className="grid gap-5 xl:grid-cols-2">
					<WorkflowPerformance />
					<DailyActivity />
				</div>
				<RiskAnalysis />
			</div>
		</DashboardLayout>
	);
}

function Panel({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn(
				"border border-app-border bg-app-card p-4 sm:p-5",
				className,
			)}
		>
			{children}
		</section>
	);
}

function MetricGrid() {
	return (
		<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
			{analyticsMetrics.map((metric) => {
				const Icon = metric.icon;

				return (
					<Panel className="min-h-[102px]" key={metric.label}>
						<div className="flex items-start justify-between">
							<div>
								<Typography className="text-app-muted-fg" variant="bodySm">
									{metric.label}
								</Typography>
								<Typography className="mt-3 text-app-fg" variant="h2">
									{metric.value}
								</Typography>
								<Typography
									className={cn("mt-1", metric.tone)}
									variant="bodySm"
								>
									{metric.detail}
								</Typography>
							</div>
							<Icon className={cn("size-4", metric.tone)} />
						</div>
					</Panel>
				);
			})}
		</div>
	);
}

function PortfolioCard() {
	return (
		<Panel className="min-h-[395px]">
			<div className="flex items-start justify-between gap-4">
				<div>
					<Typography className="text-app-fg" variant="h3">
						Portfolio Value
					</Typography>
					<Typography className="text-app-muted-fg" variant="bodySm">
						With execution timeline markers
					</Typography>
				</div>
				<Typography className="text-app-muted-fg" variant="bodySm">
					Current:{" "}
					<span className="text-lg font-bold text-app-fg">$127,340</span>
				</Typography>
			</div>

			<div className="mt-10 flex gap-5 text-sm">
				<Legend label="Buy" tone="bg-success" />
				<Legend label="Sell" tone="bg-danger" />
				<Legend label="Alert" tone="bg-info" />
			</div>

			<div className="mt-6 overflow-hidden">
				<svg
					aria-label="Portfolio value chart"
					className="h-[245px] w-full"
					fill="none"
					preserveAspectRatio="none"
					role="img"
					viewBox="0 0 1530 260"
				>
					<defs>
						<linearGradient id="portfolio-fill" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor="var(--info)" stopOpacity="0.24" />
							<stop offset="100%" stopColor="var(--info)" stopOpacity="0" />
						</linearGradient>
					</defs>
					{[0, 1, 2, 3].map((line) => (
						<path
							d={`M 45 ${55 + line * 48} H 1485`}
							key={line}
							className="text-app-border"
							stroke="currentColor"
							strokeDasharray="4 5"
						/>
					))}
					{[0, 1, 2, 3, 4, 5, 6].map((line) => (
						<path
							d={`M ${45 + line * 240} 55 V 245`}
							key={line}
							className="text-app-fg/16"
							stroke="currentColor"
							strokeDasharray="4 5"
						/>
					))}
					<path
						d={`${portfolioPath} L 1485 245 L 45 245 Z`}
						fill="url(#portfolio-fill)"
					/>
					<path
						className="text-info"
						d={portfolioPath}
						stroke="currentColor"
						strokeWidth="2.4"
					/>
					{portfolioMarkers.map((marker) => (
						<g key={marker.label}>
							<circle
								cx={`${marker.x}%`}
								cy={`${marker.y}%`}
								className={marker.tone}
								fill="currentColor"
								r="6"
								stroke="currentColor"
								strokeOpacity="0.65"
								strokeWidth="2"
							/>
							<text
								className="text-app-fg"
								fill="currentColor"
								fontSize="11"
								textAnchor="middle"
								x={`${marker.x}%`}
								y={`${marker.y - 3}%`}
							>
								{marker.label}
							</text>
						</g>
					))}
					<path
						className="text-app-fg"
						d="M 45 245 H 1485"
						stroke="currentColor"
						strokeOpacity="0.8"
					/>
					<path
						className="text-app-fg"
						d="M 45 55 V 245"
						stroke="currentColor"
						strokeOpacity="0.8"
					/>
				</svg>
				<div className="grid grid-cols-7 text-center text-sm text-app-fg">
					{["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6", "Jan 7"].map(
						(day) => (
							<span key={day}>{day}</span>
						),
					)}
				</div>
			</div>
		</Panel>
	);
}

function Legend({ label, tone }: { label: string; tone: string }) {
	return (
		<span className="flex items-center gap-2 text-app-muted-fg">
			<span className={cn("size-3", tone)} />
			{label}
		</span>
	);
}

function WorkflowPerformance() {
	return (
		<Panel className="min-h-[372px]">
			<div className="flex items-center justify-between">
				<Typography className="text-app-fg" variant="h3">
					Workflow Performance
				</Typography>
				<Typography className="text-app-muted-fg" variant="bodySm">
					5 workflows
				</Typography>
			</div>
			<div className="mt-8 grid gap-2">
				{workflowPerformance.map((item) => (
					<div
						className="flex items-center justify-between border border-app-border bg-app-muted px-3 py-3"
						key={item.name}
					>
						<div>
							<div className="flex items-center gap-2">
								<Typography className="text-app-fg" variant="label">
									{item.name}
								</Typography>
								{item.status ? (
									<span className="bg-danger/15 px-1.5 text-xs text-danger">
										{item.status}
									</span>
								) : null}
							</div>
							<Typography className="mt-2 text-app-muted-fg" variant="bodySm">
								{item.trades} <span className="px-2">•</span> {item.winRate}{" "}
								<span className="px-2">•</span>{" "}
								<span
									className={item.positive ? "text-success" : "text-danger"}
								>
									{item.average}
								</span>
							</Typography>
						</div>
						<Typography
							className={item.positive ? "text-success" : "text-danger"}
							variant="label"
						>
							{item.return}
						</Typography>
					</div>
				))}
			</div>
		</Panel>
	);
}

function DailyActivity() {
	return (
		<Panel className="min-h-[372px]">
			<Typography className="text-app-fg" variant="h3">
				Daily Activity
			</Typography>
			<div className="mt-10 h-[245px] px-8">
				<div className="flex h-full items-end gap-7 border-b border-l border-app-border0 bg-[linear-gradient(var(--app-border)_1px,transparent_1px),linear-gradient(90deg,var(--app-border)_1px,transparent_1px)] bg-[length:100%_25%,16.66%_100%] px-2">
					{dailyActivity.map((item) => (
						<div
							className="flex flex-1 flex-col items-center gap-2"
							key={item.day}
						>
							<div
								className="w-full bg-violet"
								style={{ height: `${(item.value / 20) * 100}%` }}
							/>
							<span className="-mb-6 text-sm text-app-fg">{item.day}</span>
						</div>
					))}
				</div>
			</div>
			<div className="mt-10 flex justify-center gap-5 text-sm text-app-muted-fg">
				<Legend label="Automated" tone="bg-info" />
				<Legend label="Manual" tone="bg-violet" />
			</div>
		</Panel>
	);
}

function RiskAnalysis() {
	return (
		<Panel>
			<div className="flex items-center gap-2">
				<Typography className="text-app-fg" variant="h3">
					Risk Analysis
				</Typography>
				<Info className="size-4 text-app-muted-fg" />
			</div>
			<div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
				{riskMetrics.map((metric) => (
					<div key={metric.label}>
						<div className="flex items-center justify-between gap-4">
							<Typography className="text-app-muted-fg" variant="bodySm">
								{metric.label}
							</Typography>
							<span
								className={cn(
									" border px-2 text-xs",
									metric.status === "excellent"
										? "border-success/30 bg-success/10 text-success"
										: "border-info/30 bg-info/10 text-info",
								)}
							>
								{metric.status}
							</span>
						</div>
						<Typography className="mt-3 text-app-fg" variant="h2">
							{metric.value}
						</Typography>
						<Typography className="text-app-muted-fg" variant="bodySm">
							{metric.target}
						</Typography>
						<div className="mt-3 h-1.5 overflow-hidden  bg-app-muted">
							<div
								className={cn("h-full ", metric.tone)}
								style={{ width: `${metric.progress}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</Panel>
	);
}
