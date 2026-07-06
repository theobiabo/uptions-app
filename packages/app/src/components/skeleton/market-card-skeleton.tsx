export function MarketCardSkeleton() {
	return (
		<article className="border border-white/10 bg-app-card p-4">
			<div className="aspect-video w-full animate-pulse bg-white/8" />
			<div className="mt-4 h-5 w-24 animate-pulse bg-white/8" />
			<div className="mt-4 h-7 w-4/5 animate-pulse bg-white/8" />
			<div className="mt-10 grid grid-cols-2 gap-2">
				<div className="h-20.5 animate-pulse border border-white/10 bg-white/8" />
				<div className="h-20.5 animate-pulse border border-white/10 bg-white/8" />
			</div>
			<div className="mt-5 h-5 w-32 animate-pulse bg-white/8" />
		</article>
	);
}
