import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button.tsx";
import { useCurrentUser, useUpdateWallet } from "@/hooks/use-auth.ts";
import { cn } from "@/lib/utils.ts";
import {
	supportedChain,
	tradingProvider,
} from "@/packages/types/auth.types.ts";

export function WalletConnectButton() {
	const { address, chainId, isConnected } = useAccount();
	const { user } = useCurrentUser();
	const updateWallet = useUpdateWallet();
	const lastSyncKeyRef = useRef<string | undefined>(undefined);

	useEffect(() => {
		if (
			!isConnected ||
			!address ||
			chainId !== 137 ||
			!user?.preferred_trading_provider
		) {
			return;
		}

		const syncKey = `${user.id}:${address}:${chainId}`.toLowerCase();
		const currentWallet = user.primary_wallet_address?.toLowerCase();

		if (
			lastSyncKeyRef.current === syncKey ||
			currentWallet === address.toLowerCase()
		) {
			return;
		}

		lastSyncKeyRef.current = syncKey;
		updateWallet.mutate({
			chain: supportedChain.polygon,
			chain_id: 137,
			provider: tradingProvider.polymarket,
			wallet_address: address,
		});
	}, [address, chainId, isConnected, updateWallet, user]);

	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				mounted,
				openAccountModal,
				openChainModal,
				openConnectModal,
			}) => {
				const ready = mounted;
				const connected = ready && account && chain;

				if (!connected) {
					return (
						<Button
							className="h-9 border border-app-border bg-app-card px-3 text-xs font-semibold text-app-fg hover:bg-app-muted"
							onClick={openConnectModal}
							type="button"
							variant="ghost"
						>
							<Wallet className="size-3.5 text-primary" />
							Connect wallet
						</Button>
					);
				}

				if (chain.unsupported) {
					return (
						<Button
							className="h-9 border border-danger/40 bg-danger/10 px-3 text-xs font-semibold text-danger hover:bg-danger/15"
							onClick={openChainModal}
							type="button"
							variant="ghost"
						>
							Switch to Polygon
						</Button>
					);
				}

				return (
					<div className="flex items-center gap-2">
						<Button
							className="hidden h-9 border border-app-border bg-app-card px-3 text-xs font-semibold text-app-muted-fg hover:bg-app-muted sm:inline-flex"
							onClick={openChainModal}
							type="button"
							variant="ghost"
						>
							<span className="size-2 rounded-full bg-success" />
							{chain.name}
						</Button>
						<Button
							className={cn(
								"h-9 border border-app-border bg-app-card px-3 text-xs font-semibold text-app-fg hover:bg-app-muted",
							)}
							onClick={openAccountModal}
							type="button"
							variant="ghost"
						>
							<Wallet className="size-3.5 text-primary" />
							{account.displayName}
						</Button>
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
}
