import { LoaderCircle, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { MARKET_COMMENT_MAX_LENGTH } from "@/packages/types/market-comment.types.ts";

type MarketCommentFormProps = {
	error: string | null;
	isPosting: boolean;
	onErrorReset: () => void;
	onSubmit: (body: string) => Promise<void>;
};

export function MarketCommentForm({
	error,
	isPosting,
	onErrorReset,
	onSubmit,
}: MarketCommentFormProps) {
	const [body, setBody] = useState("");
	const trimmedBody = body.trim();
	const canSubmit =
		trimmedBody.length > 0 &&
		trimmedBody.length <= MARKET_COMMENT_MAX_LENGTH &&
		!isPosting;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!canSubmit) {
			return;
		}

		try {
			await onSubmit(trimmedBody);
			setBody("");
		} catch {
			return;
		}
	};

	return (
		<form
			aria-label="Post a market comment"
			className="border-b border-app-border bg-app-muted/40 p-4 sm:p-5"
			onSubmit={handleSubmit}
		>
			<label
				className="mb-2 block text-sm font-semibold text-app-fg"
				htmlFor="market-comment-body"
			>
				Join the conversation
			</label>
			<textarea
				aria-describedby={
					error
						? "market-comment-error market-comment-count"
						: "market-comment-count"
				}
				aria-invalid={Boolean(error)}
				className="min-h-28 w-full resize-y border border-app-border bg-app-card px-3 py-3 text-sm leading-6 text-app-fg outline-none transition placeholder:text-app-muted-fg focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={isPosting}
				id="market-comment-body"
				maxLength={MARKET_COMMENT_MAX_LENGTH}
				onChange={(event) => {
					setBody(event.target.value);

					if (error) {
						onErrorReset();
					}
				}}
				placeholder="Share your take on this market…"
				value={body}
			/>
			<div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-h-5 text-xs">
					{error ? (
						<p
							className="font-medium text-danger"
							id="market-comment-error"
							role="alert"
						>
							{error}
						</p>
					) : (
						<p className="text-app-muted-fg">
							Be respectful and stay on topic.
						</p>
					)}
				</div>
				<div className="flex items-center justify-between gap-4 sm:justify-end">
					<span
						className="text-xs tabular-nums text-app-muted-fg"
						id="market-comment-count"
					>
						{body.length.toLocaleString()} /{" "}
						{MARKET_COMMENT_MAX_LENGTH.toLocaleString()}
					</span>
					<Button className="min-w-28" disabled={!canSubmit} type="submit">
						{isPosting ? (
							<>
								<LoaderCircle className="animate-spin" />
								Posting…
							</>
						) : (
							<>
								<Send />
								Post
							</>
						)}
					</Button>
				</div>
			</div>
		</form>
	);
}
