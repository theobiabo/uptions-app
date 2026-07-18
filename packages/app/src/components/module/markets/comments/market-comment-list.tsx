import Avatar from "boring-avatars";
import type { MarketComment } from "@/packages/types/market-comment.types.ts";
import { formatDate } from "@/util/formatters.ts";

type MarketCommentListProps = {
	comments: MarketComment[];
};

const loadingCommentIds = ["first", "second", "third"] as const;

export function MarketCommentList({ comments }: MarketCommentListProps) {
	return (
		<ol aria-label="Market comments" className="divide-y divide-app-border">
			{comments.map((comment) => (
				<MarketCommentItem comment={comment} key={comment.id} />
			))}
		</ol>
	);
}

function MarketCommentItem({ comment }: { comment: MarketComment }) {
	const authorName = comment.author?.username?.trim() || "Anonymous";
	const authorId = comment.author?.id?.trim() || authorName;
	const createdAt = formatDate(comment.created_at) ?? comment.created_at;
	const wasEdited = comment.updated_at !== comment.created_at;

	return (
		<li className="flex min-w-0 gap-3 px-4 py-5 sm:gap-4 sm:px-5">
			<div className="size-9 shrink-0 overflow-hidden rounded-full bg-app-muted sm:size-10">
				<Avatar name={authorId} size="100%" />
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
					<p className="max-w-full truncate text-sm font-semibold text-app-fg">
						{authorName}
					</p>
					<time
						className="text-xs text-app-muted-fg"
						dateTime={comment.created_at}
						title={createdAt}
					>
						{createdAt}
						{wasEdited ? " · edited" : ""}
					</time>
				</div>
				<p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-app-fg">
					{comment.body}
				</p>
			</div>
		</li>
	);
}

export function MarketCommentsLoading() {
	return (
		<output
			aria-label="Loading comments"
			className="block divide-y divide-app-border"
		>
			{loadingCommentIds.map((id) => (
				<span className="flex gap-4 px-4 py-5 sm:px-5" key={id}>
					<span className="size-10 shrink-0 animate-pulse rounded-full bg-app-muted" />
					<span className="w-full space-y-3">
						<span className="block h-3 w-36 animate-pulse bg-app-muted" />
						<span className="block h-3 w-full animate-pulse bg-app-muted" />
						<span className="block h-3 w-2/3 animate-pulse bg-app-muted" />
					</span>
				</span>
			))}
		</output>
	);
}
