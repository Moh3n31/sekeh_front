import { Link } from "react-router";
import type { HistoryObject } from "../../../services/chat";
import NewChatIcon from "../../../assets/icons/NewChatIcon";
import BalloonIcon from "../../../assets/icons/BalloonIcon";
import EditDialog from "../../chats/EditDialog";
import DeleteDialog from "../../chats/DeleteDialog";

export default function HistoryCard({ card }: { card: HistoryObject }) {
	return (
		<div className="group relative rounded-lg shadow-md shadow-border h-70 w-full">
			<span className="absolute z-0 top-0 right-0 bg-linear-30 from-background/30 to-background/50 size-full rounded-lg transition-all duration-150 opacity-100 group-hover:opacity-0"></span>
			<span className="absolute z-0 top-0 right-0 bg-linear-30 from-accent/30 to-primary-green/30 size-full rounded-lg transition-all duration-150 opacity-0 group-hover:opacity-100"></span>
			<div
				className="absolute z-2! transition-all duration-150 border-border group-hover:border-accent-hover
        rounded-lg border-2 flex flex-col justify-between size-full bg-transparent">
				<Link to={`${card.id}`} className="flex flex-col gap-5 size-full p-3">
					<p className="font-semibold text-xl text-primary-text truncate">
						{card.title}
					</p>
					<p className="font-medium text-[15px] text-primary-text/90 line-clamp-6">
						{card.desc}
					</p>
				</Link>
				<div className="flex items-center justify-between p-3">
					<div className="flex gap-2 items-center">
						<button
							popoverTarget="edit-dialog"
							className="border-2 border-primary-action rounded-full hover:bg-primary-action transition-all duration-100 p-1 size-7 cursor-pointer
							hover:*:[&>g>path]:first:stroke-white hover:*:[&>g>path]:last:fill-white">
							<NewChatIcon className="size-full [&>g>path]:first:stroke-primary-action [&>g>path]:last:fill-primary-action" />
						</button>
						<button
							popoverTarget="delete-dialog"
							className="border-2 border-primary-red rounded-full hover:bg-primary-red transition-all duration-100 p-0.5 size-7 cursor-pointer
						hover:*:[&>g>path]:stroke-white">
							<BalloonIcon className="size-full [&>g>path]:stroke-primary-red" />
						</button>
					</div>
					<p className="font-medium text-[12px] text-text-muted">{card.date}</p>
				</div>
			</div>
			<EditDialog id={card.id}/>
			<DeleteDialog id={card.id} />
		</div>
	);
}
