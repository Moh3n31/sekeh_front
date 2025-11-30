// Data & Services
import type { MessageObject } from "../../../services/chat";
interface MessageProps {
	message: MessageObject;
}
	
export default function Message({ message }: MessageProps) {
	return (
		<div
			className={`h-auto flex gap-0.5 ${
				message.is_user
					? "self-end max-w-100 flex-row-reverse items-end gap-3"
					: "self-start max-w-200 flex-col"
			}`}>
			<span
				className={`text-sm w-full py-2 ${
					message.is_user
						? "px-4 rounded-3xl rounded-tr-md bg-midnight-violet text-white"
						: "rounded-r-xl rounded-tl-xl bg-transparent text-lg text-midnight-violet"
				}`}>
				{message.content}
			</span>
			<span className="text-[12px] text-gray-3 text-left">
				{message.time.slice(11, 16)}
			</span>
		</div>
	);
}
