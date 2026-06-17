// Data & Services
import type { MessageObject } from "../../../services/chat";
interface MessageProps {
	message: MessageObject;
	isPending?: boolean;
}
// Components
import CopyIcon from "../../../assets/icons/CopyIcon";
import DislikeIcon from "../../../assets/icons/DislikeIcon";
import LikeIcon from "../../../assets/icons/LikeIcon";
import LoadingIcon from "../../../assets/icons/LoadingIcon";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

function UserMessage({ message, isPending }: MessageProps) {
	return (
		<div className={`h-auto flex items-start gap-3 justify-end`}>
			<span
				className={`size-6 shrink-0 rounded-full flex items-center justify-center 
					${isPending ? "animate-spin" : ""}`}>
				<LoadingIcon
					className={
						isPending
							? "size-6 p-0 rounded-full [&>g>path]:stroke-text-muted"
							: "hidden"
					}
				/>
			</span>
			<div className={`flex flex-col gap-3 max-w-[85%] items-end`}>
				<span
					dir="rtl"
					className={`w-full text-primary-text text-[15px] text-right`}>
					{message.content}
				</span>
				<div
					className={`flex items-center justify-between w-full ${isPending ? "hidden" : ""}`}>
					<span className="text-[12px] text-text-muted/50 shrink-0">
						{new Date(message.time).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
					<menu className="flex items-center">
						<button
							onClick={() => navigator.clipboard.writeText(message.content)}
							className="size-7 p-1 border-2 border-transparent hover:border-border rounded-full transition-all duration-150 cursor-pointer">
							<CopyIcon className="[&>g>path]:stroke-text-muted/60 size-full" />
						</button>
					</menu>
				</div>
			</div>
		</div>
	);
}

function AiMessage({ message, isPending }: MessageProps) {
	function handleLike() {
		console.log("Liked: ", message.message_id);
	}
	function handleDislike() {
		console.log("Disliked: ", message.message_id);
	}

	return (
		<div className={`h-auto flex items-start gap-3 justify-start`}>
			<span
				className={`size-6 shrink-0 rounded-full flex items-center justify-center
					bg-linear-30 from-accent-hover to-primary-green
					${isPending ? "animate-spin" : ""}`}>
				<span
					className={
						isPending ? "size-4 bg-accent-soft rounded-full" : "hidden"
					}></span>
			</span>

			<div className={`flex flex-col gap-3 max-w-[90%] items-start `}>
				<span dir="rtl" className="w-full text-primary-text text-[16px]">
					{/* {isPending ? (
						<p className="whitespace-pre-wrap text-primary-text">
							{message.content}
						</p>
					) : ( */}
					<ReactMarkdown rehypePlugins={[rehypeHighlight]}>
						{message.content}
					</ReactMarkdown>
					{/* )} */}
				</span>
				<div
					className={`flex items-center justify-between w-full ${isPending ? "hidden" : ""}`}>
					<span className="text-[12px] text-text-muted/50 shrink-0">
						{new Date(message.time).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
					<menu className="flex items-center">
						<button
							onClick={() => navigator.clipboard.writeText(message.content)}
							className="size-7 p-1 border-2 border-transparent hover:border-border rounded-full transition-all duration-150 cursor-pointer">
							<CopyIcon className="[&>g>path]:stroke-text-muted/60 size-full" />
						</button>
						<button
							onClick={handleLike}
							className="size-7 p-1 border-2 border-transparent hover:border-border rounded-full transition-all duration-150 cursor-pointer">
							<LikeIcon className="[&>g>path]:fill-text-muted/60 size-full" />
						</button>
						<button
							onClick={handleDislike}
							className="size-7 p-1 border-2 border-transparent hover:border-border rounded-full transition-all duration-150 cursor-pointer">
							<DislikeIcon className="[&>g>path]:fill-text-muted/60 size-full" />
						</button>
					</menu>
				</div>
			</div>
		</div>
	);
}

export default function Message({ message, isPending }: MessageProps) {
	if (message.role === "user")
		return <UserMessage message={message} isPending={isPending} />;
	else if (message.role === "assistant")
		return <AiMessage message={message} isPending={isPending} />;
}
