import { cn } from "@/lib/utils.ts";
import { alertItems } from "@/packages/home/homepage-data.ts";

const toneClasses = {
	blue: "border-blue-200 bg-blue-50 text-blue-500",
	green: "border-emerald-200 bg-emerald-50 text-emerald-500",
	orange: "border-orange-200 bg-orange-50 text-orange-500",
	violet: "border-violet-200 bg-violet-50 text-violet-500",
	slate: "border-slate-200 bg-slate-50 text-slate-500",
} as const;

export function AlertsPreview() {
	return (
		<div className="flex items-center justify-center md:min-h-[500px]">
			<div className="w-full max-w-[540px] rounded-[48px] border border-black/5 bg-app-inverse px-9 py-10">
				<ul className="divide-y divide-black/[0.06]">
					{alertItems.map((item) => {
						const Icon = item.icon;

						return (
							<li
								className="flex items-center gap-5 py-5 first:pt-0 last:pb-0"
								key={item.title}
							>
								<span
									className={cn(
										"grid size-11 shrink-0 place-items-center  border",
										toneClasses[item.tone],
									)}
								>
									<Icon className="size-5" />
								</span>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-4">
										<h3 className="truncate text-base font-bold tracking-[-0.02em] text-black">
											{item.title}
										</h3>
										<time className="shrink-0 text-sm font-medium text-app-muted-fg">
											{item.time}
										</time>
									</div>
									<p className="mt-1 truncate text-sm leading-6 text-app-muted-fg">
										{item.description}
									</p>
								</div>
								{"active" in item && item.active ? (
									<span className="size-3 shrink-0 bg-success" />
								) : null}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
