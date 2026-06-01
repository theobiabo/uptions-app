import { SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { Typography } from "@/components/typography/typography.tsx";
import { cn } from "@/lib/utils.ts";

type NoDataFoundProps = {
	action?: ReactNode;
	className?: string;
	description?: string;
	title?: string;
};

export function NoDataFound({
	action,
	className,
	description = "There is no data to show yet.",
	title = "No data found",
}: NoDataFoundProps) {
	return (
		<div
			className={cn(
				"grid min-h-[170px] place-items-center border border-[var(--app-border)] bg-[var(--app-card)] p-6 text-center",
				className,
			)}
		>
			<div className="mx-auto max-w-[320px]">
				<SearchX className="mx-auto size-9 text-[var(--app-muted-fg)]" />
				<Typography className="mt-5 text-[var(--app-fg)]" variant="h3">
					{title}
				</Typography>
				<Typography
					className="mt-2 text-[var(--app-muted-fg)]"
					variant="bodySm"
				>
					{description}
				</Typography>
				{action ? <div className="mt-5">{action}</div> : null}
			</div>
		</div>
	);
}
