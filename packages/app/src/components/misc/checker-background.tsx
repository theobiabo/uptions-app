import { cn } from "@/lib/utils.ts";

type CheckerBackgroundProps = {
	className?: string;
	variant?: "builder" | "marketing";
};

export function CheckerBackground({
	className,
	variant = "marketing",
}: CheckerBackgroundProps) {
	const isBuilder = variant === "builder";

	return (
		<div
			aria-hidden="true"
			className={cn("pointer-events-none absolute inset-0", className)}
		>
			<div
				className={cn(
					"absolute inset-0",
					isBuilder
						? "bg-[linear-gradient(90deg,rgba(17,17,17,0.04)_1px,transparent_1px),linear-gradient(0deg,rgba(17,17,17,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.035)_1px,transparent_1px)]"
						: "bg-[linear-gradient(90deg,rgba(17,17,17,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(17,17,17,0.035)_1px,transparent_1px)] bg-[size:72px_72px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
				)}
			/>
			<div
				className={cn(
					"absolute border border-[var(--app-border)] opacity-55",
					isBuilder
						? "left-[-7rem] top-12 h-[520px] w-[520px] rotate-6 bg-[linear-gradient(45deg,rgba(255,90,31,0.16)_25%,transparent_25%,transparent_50%,rgba(255,90,31,0.16)_50%,rgba(255,90,31,0.16)_75%,transparent_75%,transparent)] bg-[size:30px_30px] [mask-image:linear-gradient(90deg,black,transparent_78%)]"
						: "left-[-6rem] top-24 h-[520px] w-[520px] rotate-6 bg-[linear-gradient(45deg,rgba(255,90,31,0.14)_25%,transparent_25%,transparent_50%,rgba(255,90,31,0.14)_50%,rgba(255,90,31,0.14)_75%,transparent_75%,transparent)] bg-[size:28px_28px] [mask-image:linear-gradient(90deg,black,transparent_78%)]",
				)}
			/>
			<div
				className={cn(
					"absolute border border-[var(--app-border)] opacity-45",
					isBuilder
						? "right-[-10rem] top-24 h-[560px] w-[560px] -rotate-6 bg-[linear-gradient(45deg,rgba(17,17,17,0.08)_25%,transparent_25%,transparent_50%,rgba(17,17,17,0.08)_50%,rgba(17,17,17,0.08)_75%,transparent_75%,transparent)] bg-[size:34px_34px] [mask-image:linear-gradient(270deg,black,transparent_76%)] dark:bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)]"
						: "right-[-9rem] top-12 h-[560px] w-[560px] -rotate-6 bg-[linear-gradient(45deg,rgba(17,17,17,0.08)_25%,transparent_25%,transparent_50%,rgba(17,17,17,0.08)_50%,rgba(17,17,17,0.08)_75%,transparent_75%,transparent)] bg-[size:32px_32px] [mask-image:linear-gradient(270deg,black,transparent_76%)] dark:bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)]",
				)}
			/>
			<div
				className={cn(
					"absolute inset-x-0 top-0 h-36 bg-gradient-to-b to-transparent",
					isBuilder ? "from-[var(--builder-bg)]" : "from-[var(--marketing-bg)]",
				)}
			/>
			<div
				className={cn(
					"absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t to-transparent",
					isBuilder
						? "from-[var(--builder-bg)] via-[var(--builder-bg)]/80"
						: "from-[var(--marketing-bg)] via-[var(--marketing-bg)]/85",
				)}
			/>
			<div className="absolute left-1/2 top-16 h-px w-[min(82vw,980px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--app-border)] to-transparent" />
			<div className="absolute bottom-24 left-1/2 h-px w-[min(70vw,760px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
		</div>
	);
}
