import { cn } from "@/lib/utils.ts";
import { builderNodes } from "@/packages/home/homepage-data.ts";

export function BuilderPreview() {
	return (
		<div className="flex items-center justify-center md:min-h-[500px]">
			<div className="relative aspect-square w-full max-w-[540px] overflow-hidden rounded-[48px] border border-black/10 bg-app-surface">
				<div className="absolute inset-0 bg-[radial-gradient(circle,_var(--app-border)_1px,_transparent_1px)] bg-[length:8px_8px] opacity-35" />
				<svg
					aria-hidden="true"
					className="absolute inset-0 size-full"
					fill="none"
					preserveAspectRatio="none"
					viewBox="0 0 540 540"
				>
					<path
						d="M110 220 H250"
						stroke="currentColor"
						strokeDasharray="4 5"
						strokeWidth="1.4"
					/>
					<path
						d="M365 220 H442 C468 220 468 252 442 252 H390 C365 252 365 286 390 286 H430"
						stroke="currentColor"
						strokeWidth="1.4"
					/>
				</svg>

				{builderNodes.map((node) => {
					const Icon = node.icon;

					return (
						<div
							className={cn(
								"absolute border border-black/10 bg-app-inverse px-3 py-2",
								node.className,
							)}
							key={node.label}
							style={{ left: node.x, top: node.y }}
						>
							<div className="flex items-center gap-2">
								<span
									className={cn(
										"grid size-4 place-items-center ",
										node.iconClassName,
									)}
								>
									<Icon className="size-2.5" />
								</span>
								<div className="min-w-0">
									{"eyebrow" in node && node.eyebrow ? (
										<p className="mb-1 text-[9px] font-bold leading-none text-info">
											{node.eyebrow}
										</p>
									) : null}
									<p className="truncate text-[11px] font-bold leading-4 text-black">
										{node.label}
									</p>
								</div>
							</div>
						</div>
					);
				})}

				<span className="absolute left-[8%] top-[12%] text-xl text-black/10">
					•
				</span>
			</div>
		</div>
	);
}
