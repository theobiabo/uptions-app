import type { ReactNode } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { cn } from "@/lib/utils.ts";

type CustomModalProps = {
	children: ReactNode;
	className?: string;
	description?: string;
	descriptionClassName?: string;
	headerClassName?: string;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
	showCloseButton?: boolean;
	showHeader?: boolean;
	title: string;
	titleClassName?: string;
	trigger?: ReactNode;
};

export function CustomModal({
	children,
	className,
	description,
	descriptionClassName,
	headerClassName,
	onOpenChange,
	open,
	showCloseButton,
	showHeader = true,
	title,
	titleClassName,
	trigger,
}: CustomModalProps) {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			{trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
			<DialogContent
				className={cn(
					"border-app-border bg-app-surface text-app-fg sm:max-w-107.5",
					className,
				)}
				showCloseButton={showCloseButton}
			>
				{showHeader ? (
					<DialogHeader className={headerClassName}>
						<DialogTitle className={titleClassName}>{title}</DialogTitle>
						{description ? (
							<DialogDescription
								className={cn("text-app-muted-fg", descriptionClassName)}
							>
								{description}
							</DialogDescription>
						) : null}
					</DialogHeader>
				) : (
					<DialogTitle className="sr-only">{title}</DialogTitle>
				)}
				{children}
			</DialogContent>
		</Dialog>
	);
}
