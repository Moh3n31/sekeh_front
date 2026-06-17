import { useState } from "react";
import BookmarkIcon from "../../../assets/icons/BookmarkIcon";
import MatchCircle from "./MatchCircle";
import type { Job } from "../hooks/useChatStream";
import { useCustomMutation } from "../hooks/useCostumMutation";
import { MarkAPI } from "../../../services/mark";

interface JobCardProps extends Job {
	bookmarked?: boolean;
}

export default function JobCard(props: JobCardProps) {
	const { mutate: mark } = useCustomMutation(MarkAPI.markCard);
	const [showDetails, setShowDetails] = useState(false);
	const [saved, setSaved] = useState(props.bookmarked ?? false);

	return (
		<div className="h-67 w-full flex flex-col justify-between gap-2.5 rounded-lg border px-2.5 py-2 bg-background border-border">
			{showDetails ? (
				<DetailsView
					company_name={props.company_name}
					source_site={props.source_site}
					company_reviews={props.company_reviews}
				/>
			) : (
				<OverView
					title={props.title}
					match_percent={props.match_percent}
					requirements={props.requirements}
					company_name={props.company_name}
					source_site={props.source_site}
				/>
			)}

			<menu className="flex items-center justify-between gap-4 h-9 text-[12px]">
				<button
					onClick={() => setShowDetails((prev) => !prev)}
					className="cursor-pointer w-full h-full rounded-full text-background bg-primary-action transition">
					{showDetails ? "Back" : "Details"}
				</button>

				<button
					onClick={() =>
						window.open(props.job_url, "_blank", "noopener,noreferrer")
					}
					className="cursor-pointer w-full h-full rounded-full border-2 text-primary-action bg-transparent transition">
					Open
				</button>

				<button
					onClick={() => {
						setSaved((prev) => !prev);
						mark(props);
					}}
					className="cursor-pointer">
					<BookmarkIcon
						className={`size-6 [&>g>path]:stroke-primary-action ${
							saved && "[&>g>path]:fill-primary-action/60"
						}`}
					/>
				</button>
			</menu>
		</div>
	);
}

interface DetailsViewProps {
	company_name: string;
	source_site: string;
	company_reviews: { score: number; count: number };
}

function DetailsView({
	company_name,
	source_site,
	company_reviews,
}: DetailsViewProps) {
	return (
		<div className="flex flex-col h-full justify-start gap-2.5 text-primary-text text-[14px]">
			<h3 className="text-[16px] font-medium text-text-muted">Details:</h3>

			<div className="flex gap-3">
				<span className="text-text-muted">Company:</span>
				<span className="font-semibold">{company_name}</span>
			</div>
			<div className="flex gap-3">
				<span className="text-text-muted">Source:</span>
				<span className="font-semibold">{source_site}</span>
			</div>
			<div className="flex gap-3">
				<span className="text-text-muted">Reviews:</span>
				<span className="font-semibold">
					{company_reviews.score.toFixed(1)} ⭐{" "}
					<span className="text-text-muted font-normal">
						({company_reviews.count} reviews)
					</span>
				</span>
			</div>
		</div>
	);
}

interface OverViewProps {
	title: string;
	match_percent: number;
	requirements: string[];
	company_name: string;
	source_site: string;
}

function OverView({
	title,
	match_percent,
	requirements,
	company_name,
	source_site,
}: OverViewProps) {
	return (
		<div className="flex flex-col h-full justify-start gap-2.5">
			<div className="flex items-center gap-4">
				<div className="w-16">
					<MatchCircle percentage={match_percent} />
				</div>
				<div className="flex flex-col gap-0.5">
					<h2 className="text-[16px] font-bold text-primary-text">{title}</h2>
					<p className="text-[14px] text-text-muted">
						{company_name} · {source_site}
					</p>
				</div>
			</div>

			<div className="h-full">
				<p className="text-text-muted text-[14px]">Requirements:</p>
				<ul className="list-disc flex flex-col gap-1 pl-8 text-[14px] max-h-24 text-primary-text overflow-y-auto">
					{requirements.map((requirement) => (
						<li key={requirement}>{requirement}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
