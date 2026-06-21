import type { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

export type StepperStep = {
	description?: ReactNode;
	id: string;
	title: ReactNode;
};

type StepperProps = {
	className?: string;
	currentStep: number;
	onStepChange?: (step: number) => void;
	steps: readonly StepperStep[];
};

export function Stepper({
	className,
	currentStep,
	onStepChange,
	steps,
}: StepperProps) {
	return (
		<ol className={cn("grid gap-3 sm:grid-cols-2", className)}>
			{steps.map((step, index) => {
				const isActive = index === currentStep;
				const isComplete = index < currentStep;
				const canSelect = Boolean(onStepChange) && (isComplete || isActive);
				const content = (
					<>
						<span
							className={cn(
								"flex size-8 shrink-0 items-center justify-center border text-sm font-bold",
								isActive || isComplete
									? "border-primary bg-primary text-primary-foreground"
									: "border-white/10 bg-white/5 text-white/45",
							)}
						>
							{index + 1}
						</span>
						<span className="min-w-0">
							<span
								className={cn(
									"block text-sm font-semibold",
									isActive ? "text-white" : "text-white/60",
								)}
							>
								{step.title}
							</span>
							{step.description ? (
								<span className="mt-1 block text-xs text-white/45">
									{step.description}
								</span>
							) : null}
						</span>
					</>
				);

				return (
					<li key={step.id}>
						{canSelect ? (
							<button
								aria-current={isActive ? "step" : undefined}
								className={cn(
									"flex w-full items-center gap-3 border p-3 text-left transition",
									isActive
										? "border-primary bg-primary/10"
										: "border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5",
								)}
								onClick={() => onStepChange?.(index)}
								type="button"
							>
								{content}
							</button>
						) : (
							<div className="flex w-full items-center gap-3 border border-white/10 bg-white/2 p-3 opacity-70">
								{content}
							</div>
						)}
					</li>
				);
			})}
		</ol>
	);
}
