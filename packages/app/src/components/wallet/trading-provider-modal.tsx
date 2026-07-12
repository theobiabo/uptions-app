import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { CustomModal } from "@/components/dialogs/custom-modal.tsx";

import {
	useCurrentUser,
	useTradingProviders,
	useUpdateTradingProvider,
} from "@/hooks/use-auth.ts";
import { cn } from "@/lib/utils.ts";
import type { TradingProviderOption } from "@/packages/types/auth.types.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";
import { providerAssets } from "./provider-assets.ts";

export function TradingProviderModal() {
	const { user } = useCurrentUser();
	const { error, isLoading, providers } = useTradingProviders();
	const updateTradingProvider = useUpdateTradingProvider();
	const open = Boolean(user && !user.preferred_trading_provider);

	const handleSelect = (provider: TradingProviderOption) => {
		if (!provider.available) {
			return;
		}

		updateTradingProvider.mutate(
			{ provider: provider.provider },
			{
				onError: (error) => {
					toast.error(
						getRequestErrorMessage(error, "Unable to save trading provider"),
					);
				},
				onSuccess: () => {
					toast.success(`${provider.label} selected`);
				},
			},
		);
	};

	return (
		<CustomModal
			className="border-app-border bg-app-card text-app-fg sm:max-w-2xl"
			description="Choose where Uptions should monitor markets and prepare trading actions for your account."
			onOpenChange={() => undefined}
			open={open}
			showCloseButton={false}
			title="Select trading provider"
		>
			{isLoading ? (
				<div className="grid gap-3">
					<div className="h-28 animate-pulse bg-app-muted" />
					<div className="h-28 animate-pulse bg-app-muted" />
				</div>
			) : error ? (
				<div className="border border-danger/40 bg-danger/10 p-4 text-sm font-semibold text-danger">
					{error}
				</div>
			) : (
				<div className="grid gap-3">
					{providers.map((provider) => (
						<ProviderOptionCard
							isPending={updateTradingProvider.isPending}
							key={provider.provider}
							onSelect={() => handleSelect(provider)}
							provider={provider}
						/>
					))}
				</div>
			)}
		</CustomModal>
	);
}

function ProviderOptionCard({
	isPending,
	onSelect,
	provider,
}: {
	isPending: boolean;
	onSelect: () => void;
	provider: TradingProviderOption;
}) {
	return (
		<button
			className={cn(
				"flex w-full items-center gap-4 border border-app-border bg-app-muted p-4 text-left transition hover:border-primary/70 hover:bg-app-card",
				!provider.available && "cursor-not-allowed opacity-60",
			)}
			disabled={!provider.available || isPending}
			onClick={onSelect}
			type="button"
		>
			<img
				alt=""
				className="size-14 shrink-0 rounded-2xl border border-app-border bg-app-card"
				src={providerAssets[provider.provider]}
			/>
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-2">
					<p className="text-base font-bold text-app-fg">{provider.label}</p>
					<span
						className={cn(
							"rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
							provider.available
								? "bg-success/15 text-success"
								: "bg-app-card text-app-muted-fg",
						)}
					>
						{provider.available ? "Available" : "Coming soon"}
					</span>
				</div>
				<p className="mt-1 text-sm leading-6 text-app-muted-fg">
					{provider.description}
				</p>
				<p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-app-muted-fg">
					{provider.chain_label} · Chain ID {provider.chain_id}
				</p>
			</div>
			<CheckCircle2 className="size-5 shrink-0 text-primary" />
		</button>
	);
}
