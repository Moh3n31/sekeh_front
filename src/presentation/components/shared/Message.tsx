// Data & Services
import BalloonIcon from "../../../assets/icons/BalloonIcon";
import BookmarkIcon from "../../../assets/icons/BookmarkIcon";
import CopyIcon from "../../../assets/icons/CopyIcon";
import type { MessageObject } from "../../../services/chat";
interface MessageProps {
	message: MessageObject;
	isPending?: boolean;
}

export default function Message({ message, isPending }: MessageProps) {
	function handleLike() {
		console.log("Liked: ", message.message_id);
	}
	function handleDislike() {
		console.log("Disliked: ", message.message_id);
	}
	function handleMark() {
		console.log("Marked: ", message.message_id);
	}

	return (
		<div
			className={`h-auto flex items-start gap-3 ${
				message.is_user ? "justify-end" : "justify-start"
			}`}>
			{message.is_user && (
				<span
					className={`size-6 shrink-0 rounded-full flex items-center justify-center 
					${isPending ? "animate-spin" : ""}`}>
					<BalloonIcon
						className={isPending ? "size-6 rounded-full" : "hidden"}
					/>
				</span>
			)}
			{!message.is_user && (
				<span
					className={`size-6 shrink-0 rounded-full flex items-center justify-center
					bg-linear-30 from-accent-hover to-primary-green
					${isPending ? "animate-spin" : ""}`}>
					<span
						className={
							isPending ? "size-4 bg-accent-soft rounded-full" : "hidden"
						}></span>
				</span>
			)}

			<div
				className={`flex flex-col gap-3 ${
					message.is_user ? "max-w-[85%] items-end" : "max-w-[90%] items-start"
				}`}>
				<span
					className={`w-full text-primary-text ${
						message.is_user ? "text-[15px]" : "text-[16px]"
					}`}>
					{message.content}
				</span>
				<div
					className={`flex items-center justify-between w-full ${isPending ? "hidden" : ""}`}>
					<span className="text-[12px] text-text-muted/50 shrink-0">
						{message.time}
						{/* .slice(11, 16) */}
					</span>
					<menu className="flex items-center">
						{!message.is_user && (
							<button
								onClick={handleMark}
								className="size-7 p-1 border-2 border-transparent hover:border-border rounded-full transition-all duration-150 cursor-pointer">
								<BookmarkIcon className="[&>g>path]:stroke-text-muted/60 size-full" />
							</button>
						)}
						<button
							onClick={() => console.log("copied: ", message.content)}
							className="size-7 p-1 border-2 border-transparent hover:border-border rounded-full transition-all duration-150 cursor-pointer">
							<CopyIcon className="[&>g>path]:stroke-text-muted/60 size-full" />
						</button>
						{!message.is_user && (
							<button
								onClick={handleLike}
								className="size-7 p-1 border-2 border-transparent hover:border-border rounded-full transition-all duration-150 cursor-pointer">
								<CopyIcon className="[&>g>path]:stroke-text-muted/60 size-full" />
							</button>
						)}
						{!message.is_user && (
							<button
								onClick={handleDislike}
								className="size-7 p-1 border-2 border-transparent hover:border-border rounded-full transition-all duration-150 cursor-pointer">
								<CopyIcon className="[&>g>path]:stroke-text-muted/60 size-full" />
							</button>
						)}
					</menu>
				</div>
			</div>
		</div>
	);
}
