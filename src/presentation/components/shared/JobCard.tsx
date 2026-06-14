import { useState } from "react";
import BookmarkIcon from "../../../assets/icons/BookmarkIcon";
import MatchCircle from "./MatchCircle";
import type { Job } from "../hooks/useChatStream";

interface JobCardProps extends Job {
	bookmarked?: boolean;
}

export default function JobCard(props: JobCardProps) {
	const [showDetails, setShowDetails] = useState(false);
	const [saved, setSaved] = useState(props.bookmarked ?? false);

	return (
		<div className="h-full w-full flex flex-col justify-between gap-2.5 rounded-lg border px-2.5 py-2 bg-surface border-border">
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

			<menu className="flex items-center justify-between gap-4 h-9">
				<button
					onClick={() => setShowDetails((prev) => !prev)}
					className="cursor-pointer w-full h-full rounded-full text-background bg-primary-action transition">
					{showDetails ? "Go Back" : "View Details"}
				</button>

				<button
					onClick={() =>
						window.open(props.job_url, "_blank", "noopener,noreferrer")
					}
					className="cursor-pointer w-full h-full rounded-full border-2 text-primary-action bg-transparent transition">
					Open Link
				</button>

				<button onClick={() => setSaved((prev) => !prev)}>
					<BookmarkIcon
						className={`size-6 ${
							saved
								? "[&>g>path]:fill-primary-action [&>g>path]:stroke-surface"
								: "[&>g>path]:stroke-primary-action"
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
		<div className="flex flex-col gap-1.5 h-full">
			<h3 className="text-lg font-medium text-text-muted">Details:</h3>
			<div className="flex flex-col gap-2.5 text-base text-primary-text">
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
		<div className="flex flex-col h-full justify-between gap-2.5">
			<div className="flex items-center gap-4">
				<div className="w-20">
					<MatchCircle percentage={match_percent} />
				</div>
				<div className="flex flex-col gap-0.5">
					<h2 className="text-lg font-bold text-primary-text">{title}</h2>
					<p className="text-base text-text-muted">
						{company_name} · {source_site}
					</p>
				</div>
			</div>

			<div>
				<p className="text-base text-text-muted">Requirements:</p>
				<ul className="list-disc flex flex-col gap-1 pl-8 text-base text-primary-text">
					{requirements.map((requirement) => (
						<li key={requirement}>{requirement}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
