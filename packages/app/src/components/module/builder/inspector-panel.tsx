import { DraftingCompass } from "lucide-react";

import { AppKeyword, BuilderFieldName } from "@/common";
import { Typography } from "@/components/typography/typography.tsx";
import type { WorkflowBlock } from "@/packages/builder/builder-data.ts";
import { workflowBlockTone } from "@/packages/builder/builder-data.ts";
import type { Market } from "@/packages/markets/market-utils.ts";
import type { VenueId } from "@/packages/venues/venue-data.ts";
import { getVenueConfig, venues } from "@/packages/venues/venue-data.ts";

type InspectorPanelProps = {
	market?: Market | null;
	onUpdateBlock: (updates: Partial<WorkflowBlock>) => void;
	selectedBlock?: WorkflowBlock;
	venue: VenueId;
};

export function InspectorPanel({
	market,
	onUpdateBlock,
	selectedBlock,
	venue,
}: InspectorPanelProps) {
	const activeVenue = getVenueConfig(selectedBlock?.venue ?? venue);

	return (
		<aside className="relative z-10 hidden min-h-0 w-[300px] border-l border-[var(--app-border)] bg-builder-panel/90 backdrop-blur xl:flex xl:flex-col">
			{selectedBlock ? (
				<div className="p-6">
					<Typography className="text-[var(--app-fg)]" variant="h3">
						{AppKeyword.ConfigureNode}
					</Typography>
					<div className="mt-8 border border-[var(--app-border)] bg-[var(--app-muted)] p-4">
						<Typography
							className="text-[var(--app-muted-fg)]"
							variant="caption"
						>
							{workflowBlockTone[selectedBlock.kind].label}
						</Typography>
						<Typography className="mt-2 text-[var(--app-fg)]" variant="h3">
							{selectedBlock.title}
						</Typography>
						<Typography
							className="mt-3 text-[var(--app-muted-fg)]"
							variant="bodySm"
						>
							{selectedBlock.description}
						</Typography>
						<div className="mt-6">
							<ConfigInput
								label="Node name"
								onChange={(value) => onUpdateBlock({ title: value })}
								value={selectedBlock.title}
							/>
						</div>
						<div className="mt-6">
							<ConfigTextarea
								label="Description"
								onChange={(value) => onUpdateBlock({ description: value })}
								value={selectedBlock.description}
							/>
						</div>
						<div className="mt-6">
							<label className="grid gap-2">
								<span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--app-muted-fg)]">
									{AppKeyword.Market}
								</span>
								<select
									className="h-12 border border-[var(--app-border)] bg-[var(--app-bg)] px-3 text-sm text-[var(--app-fg)] outline-none focus:border-primary"
									name={BuilderFieldName.Venue}
									onChange={(event) =>
										onUpdateBlock({
											venue: event.target.value as VenueId,
										})
									}
									value={activeVenue.id}
								>
									{venues.map((item) => (
										<option key={item.id} value={item.id}>
											{item.label}
										</option>
									))}
								</select>
							</label>
						</div>
						<div className="mt-6">
							<ConfigInput
								label={AppKeyword.Value}
								name={BuilderFieldName.Value}
								onChange={(value) => onUpdateBlock({ value })}
								value={selectedBlock.value}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="grid flex-1 place-items-center px-6 text-center">
					<div className="w-full">
						<DraftingCompass className="mx-auto size-12 text-[var(--app-fg)]" />
						<Typography className="mt-8 text-[var(--app-fg)]" variant="h3">
							Select Node To Configure
						</Typography>
						<Typography
							className="mt-3 text-[var(--app-muted-fg)]"
							variant="body"
						>
							Or drag blocks from the library
						</Typography>
						{market && (
							<div className="mt-8 border border-[var(--app-border)] bg-[var(--app-muted)] p-4 text-left">
								<Typography
									className="text-[var(--app-muted-fg)]"
									variant="caption"
								>
									{AppKeyword.SelectedMarket}
								</Typography>
								<Typography className="mt-2 text-[var(--app-fg)]" variant="h3">
									{market.title}
								</Typography>
								<div className="mt-5 grid grid-cols-2 gap-2">
									<MarketMetric label={AppKeyword.Yes} value={market.yes} />
									<MarketMetric label={AppKeyword.No} value={market.no} />
								</div>
								<MarketMetric
									className="mt-2"
									label={AppKeyword.Volume}
									value={market.volume}
								/>
							</div>
						)}
					</div>
				</div>
			)}
		</aside>
	);
}

function ConfigInput({
	label,
	name,
	onChange,
	value,
}: {
	label: string;
	name?: string;
	onChange: (value: string) => void;
	value: string;
}) {
	return (
		<label className="grid gap-2">
			<span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--app-muted-fg)]">
				{label}
			</span>
			<input
				className="h-12 border border-[var(--app-border)] bg-[var(--app-bg)] px-3 text-sm text-[var(--app-fg)] outline-none focus:border-primary"
				name={name}
				onChange={(event) => onChange(event.target.value)}
				value={value}
			/>
		</label>
	);
}

function ConfigTextarea({
	label,
	onChange,
	value,
}: {
	label: string;
	onChange: (value: string) => void;
	value: string;
}) {
	return (
		<label className="grid gap-2">
			<span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--app-muted-fg)]">
				{label}
			</span>
			<textarea
				className="min-h-24 resize-none border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-3 text-sm text-[var(--app-fg)] outline-none focus:border-primary"
				onChange={(event) => onChange(event.target.value)}
				value={value}
			/>
		</label>
	);
}

function MarketMetric({
	className,
	label,
	value,
}: {
	className?: string;
	label: string;
	value: string;
}) {
	return (
		<div
			className={`border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 ${className ?? ""}`}
		>
			<Typography className="text-[var(--app-muted-fg)]" variant="caption">
				{label}
			</Typography>
			<Typography className="mt-1 text-[var(--app-fg)]" variant="label">
				{value}
			</Typography>
		</div>
	);
}
