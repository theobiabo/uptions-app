export function MarketPageSkeleton() {
	return (
		<div className="mx-auto grid max-w-[1500px] gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
			<div className="grid gap-5">
				<div className="h-40 animate-pulse border border-white/10 bg-white/8" />
				<div className="h-[480px] animate-pulse border border-white/10 bg-white/8" />
			</div>
			<div className="h-[680px] animate-pulse border border-white/10 bg-white/8" />
		</div>
	);
}
