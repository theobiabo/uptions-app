import { CheckCircle2, Mail, ShieldCheck, Wallet } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { DashboardLayout } from "@/components/layout/dashboard-layout.tsx";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import { providerAssets } from "@/components/wallet/provider-assets.ts";
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button.tsx";
import {
	useCurrentUser,
	useTradingProviders,
	useUpdateEmail,
	useUpdatePassword,
	useUpdateTradingProvider,
} from "@/hooks/use-auth.ts";
import { cn } from "@/lib/utils.ts";
import type { TradingProviderOption } from "@/packages/types/auth.types.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";

export function SettingsPage() {
	const { user } = useCurrentUser();

	return (
		<DashboardLayout contentClassName="px-5 py-8 sm:px-8">
			<div className="mx-auto grid w-full max-w-5xl gap-6">
				<div>
					<Typography className="text-app-fg" variant="h1">
						Settings
					</Typography>
					<Typography className="mt-2 text-app-muted-fg" variant="bodySm">
						Manage your account, trading provider, wallet, and security.
					</Typography>
				</div>

				<div className="grid gap-6">
					<EmailSettings
						email={user?.email ?? ""}
						verified={Boolean(user?.email_verified)}
					/>
					<TradingProviderSettings
						selectedProvider={user?.preferred_trading_provider ?? null}
					/>
					<WalletSettings savedWallet={user?.primary_wallet_address ?? null} />
					<PasswordSettings enabled={Boolean(user?.password_configured)} />
				</div>
			</div>
		</DashboardLayout>
	);
}

function EmailSettings({
	email,
	verified,
}: {
	email: string;
	verified: boolean;
}) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [nextEmail, setNextEmail] = useState(email);
	const updateEmail = useUpdateEmail();

	useEffect(() => {
		setNextEmail(email);
	}, [email]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			await updateEmail.mutateAsync({
				current_password: currentPassword || undefined,
				email: nextEmail,
			});
			setCurrentPassword("");
			toast.success("Email updated. Check your inbox to verify it.");
		} catch (error) {
			toast.error(getRequestErrorMessage(error, "Unable to update email"));
		}
	};

	return (
		<SettingsSection
			description="Change the email used to sign in and receive account notifications."
			icon={Mail}
			title="Email address"
		>
			<form className="grid gap-4" onSubmit={handleSubmit}>
				<div className="grid gap-4 md:grid-cols-2">
					<SettingsInput
						autoComplete="email"
						label="Email"
						onChange={setNextEmail}
						required
						type="email"
						value={nextEmail}
					/>
					<SettingsInput
						autoComplete="current-password"
						label="Current password"
						onChange={setCurrentPassword}
						placeholder="Required for email accounts"
						type="password"
						value={currentPassword}
					/>
				</div>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<span
						className={cn(
							"inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em]",
							verified ? "text-success" : "text-warning",
						)}
					>
						<CheckCircle2 className="size-4" />
						{verified ? "Verified" : "Verification required"}
					</span>
					<Button disabled={updateEmail.isPending || !nextEmail} type="submit">
						{updateEmail.isPending ? "Saving..." : "Update email"}
					</Button>
				</div>
			</form>
		</SettingsSection>
	);
}

function TradingProviderSettings({
	selectedProvider,
}: {
	selectedProvider: string | null;
}) {
	const { error, isLoading, providers } = useTradingProviders();
	const updateProvider = useUpdateTradingProvider();

	const handleSelect = async (provider: TradingProviderOption) => {
		if (!provider.available || provider.provider === selectedProvider) {
			return;
		}

		try {
			await updateProvider.mutateAsync({ provider: provider.provider });
			toast.success(`${provider.label} selected`);
		} catch (error) {
			toast.error(getRequestErrorMessage(error, "Unable to update provider"));
		}
	};

	return (
		<SettingsSection
			description="Choose the market provider used for market data, trading, and automations."
			icon={ShieldCheck}
			title="Trading provider"
		>
			{isLoading ? (
				<div className="h-24 animate-pulse bg-app-muted" />
			) : error ? (
				<p className="border border-danger/40 bg-danger/10 p-4 text-sm font-semibold text-danger">
					{error}
				</p>
			) : (
				<div className="grid gap-3">
					{providers.map((provider) => {
						const selected = provider.provider === selectedProvider;

						return (
							<button
								className={cn(
									"flex items-center gap-4 border bg-app-muted p-4 text-left transition",
									selected
										? "border-primary"
										: "border-app-border hover:border-primary/60",
									!provider.available && "cursor-not-allowed opacity-60",
								)}
								disabled={!provider.available || updateProvider.isPending}
								key={provider.provider}
								onClick={() => handleSelect(provider)}
								type="button"
							>
								<img
									alt=""
									className="size-12 border border-app-border bg-app-card object-cover"
									src={providerAssets[provider.provider]}
								/>
								<div className="min-w-0 flex-1">
									<p className="font-bold text-app-fg">{provider.label}</p>
									<p className="mt-1 text-sm text-app-muted-fg">
										{provider.description}
									</p>
									<p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-app-muted-fg">
										{provider.chain_label} · Chain ID {provider.chain_id}
									</p>
								</div>
								{selected ? (
									<CheckCircle2 className="size-5 text-success" />
								) : null}
							</button>
						);
					})}
				</div>
			)}
		</SettingsSection>
	);
}

function WalletSettings({ savedWallet }: { savedWallet: string | null }) {
	const { address, chainId, isConnected } = useAccount();

	return (
		<SettingsSection
			description="Your wallet signs Polymarket orders. Uptions never stores your private key."
			icon={Wallet}
			title="Trading wallet"
		>
			<div className="grid gap-4">
				<div className="grid gap-3 border border-app-border bg-app-muted p-4 md:grid-cols-3">
					<StatusValue
						label="Connection"
						value={isConnected ? "Connected" : "Not connected"}
					/>
					<StatusValue
						label="Network"
						value={
							chainId === 137 ? "Polygon" : chainId ? `Chain ${chainId}` : "—"
						}
					/>
					<StatusValue label="Saved wallet" value={shortAddress(savedWallet)} />
				</div>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<p className="text-xs text-app-muted-fg">
						{address
							? `Active wallet ${shortAddress(address)}`
							: "Connect a Polygon wallet to trade and publish automations."}
					</p>
					<WalletConnectButton />
				</div>
			</div>
		</SettingsSection>
	);
}

function PasswordSettings({ enabled }: { enabled: boolean }) {
	const [confirmPassword, setConfirmPassword] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const updatePassword = useUpdatePassword();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (newPassword !== confirmPassword) {
			toast.error("New passwords do not match");
			return;
		}

		try {
			await updatePassword.mutateAsync({
				current_password: currentPassword,
				new_password: newPassword,
			});
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			toast.success("Password updated successfully");
		} catch (error) {
			toast.error(getRequestErrorMessage(error, "Unable to update password"));
		}
	};

	return (
		<SettingsSection
			description="Use a strong password that you do not reuse on other services."
			icon={ShieldCheck}
			title="Password"
		>
			{enabled ? (
				<form className="grid gap-4" onSubmit={handleSubmit}>
					<div className="grid gap-4 md:grid-cols-3">
						<SettingsInput
							autoComplete="current-password"
							label="Current password"
							onChange={setCurrentPassword}
							required
							type="password"
							value={currentPassword}
						/>
						<SettingsInput
							autoComplete="new-password"
							label="New password"
							minLength={8}
							onChange={setNewPassword}
							required
							type="password"
							value={newPassword}
						/>
						<SettingsInput
							autoComplete="new-password"
							label="Confirm password"
							minLength={8}
							onChange={setConfirmPassword}
							required
							type="password"
							value={confirmPassword}
						/>
					</div>
					<div className="flex justify-end">
						<Button disabled={updatePassword.isPending} type="submit">
							{updatePassword.isPending ? "Updating..." : "Update password"}
						</Button>
					</div>
				</form>
			) : (
				<p className="border border-app-border bg-app-muted p-4 text-sm text-app-muted-fg">
					Password management is available after an email is added to the
					account.
				</p>
			)}
		</SettingsSection>
	);
}

function SettingsSection({
	children,
	description,
	icon: Icon,
	title,
}: {
	children: ReactNode;
	description: string;
	icon: typeof Mail;
	title: string;
}) {
	return (
		<section className="border border-app-border bg-app-card">
			<div className="flex items-start gap-3 border-b border-app-border p-5">
				<div className="grid size-10 shrink-0 place-items-center bg-app-muted text-primary">
					<Icon className="size-5" />
				</div>
				<div>
					<Typography className="text-app-fg" variant="h3">
						{title}
					</Typography>
					<Typography className="mt-1 text-app-muted-fg" variant="bodySm">
						{description}
					</Typography>
				</div>
			</div>
			<div className="p-5">{children}</div>
		</section>
	);
}

function SettingsInput({
	autoComplete,
	label,
	minLength,
	onChange,
	placeholder,
	required,
	type,
	value,
}: {
	autoComplete: string;
	label: string;
	minLength?: number;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
	type: "email" | "password" | "text";
	value: string;
}) {
	return (
		<label className="grid gap-2">
			<span className="text-xs font-bold uppercase tracking-[0.1em] text-app-muted-fg">
				{label}
			</span>
			<input
				autoComplete={autoComplete}
				className="h-11 border border-app-border bg-app-muted px-3 text-sm text-app-fg outline-none focus:border-primary"
				minLength={minLength}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				required={required}
				type={type}
				value={value}
			/>
		</label>
	);
}

function StatusValue({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs font-bold uppercase tracking-[0.1em] text-app-muted-fg">
				{label}
			</p>
			<p className="mt-2 truncate text-sm font-bold text-app-fg">{value}</p>
		</div>
	);
}

function shortAddress(address: string | null | undefined) {
	if (!address) {
		return "—";
	}

	return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
