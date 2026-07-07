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
									: "border-app-border bg-app-muted text-app-muted-fg",
							)}
						>
							{index + 1}
						</span>
						<span className="min-w-0">
							<span
								className={cn(
									"block text-sm font-semibold",
									isActive ? "text-app-fg" : "text-app-muted-fg",
								)}
							>
								{step.title}
							</span>
							{step.description ? (
								<span className="mt-1 block text-xs text-app-muted-fg">
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
										: "border-app-border bg-app-muted hover:border-app-border hover:bg-app-muted",
								)}
								onClick={() => onStepChange?.(index)}
								type="button"
							>
								{content}
							</button>
						) : (
							<div className="flex w-full items-center gap-3 border border-app-border bg-app-muted p-3 opacity-70">
								{content}
							</div>
						)}
					</li>
				);
			})}
		</ol>
	);
}
