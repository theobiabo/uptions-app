import Logo from "@/components/misc/logo";

type LoaderScreenProps = {
	label?: string;
};

export function LoaderScreen({ label = "Loading Uptions" }: LoaderScreenProps) {
	return (
		<div className="grid min-h-screen place-items-center bg-[var(--app-bg)] text-[var(--app-fg)]">
			<div className="flex flex-col items-center gap-8">
				<Logo asLink={false} />
				<div className="relative grid size-20 place-items-center">
					<div className="absolute inset-0 border border-primary/20" />
					<div className="absolute inset-2 animate-spin border border-transparent border-t-primary border-r-primary" />
					<div className="size-2 bg-primary" />
				</div>
				<span className="text-sm font-medium text-[var(--app-muted-fg)]">
					{label}
				</span>
			</div>
		</div>
	);
}
