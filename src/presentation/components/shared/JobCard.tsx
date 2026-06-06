import { useState } from "react";
import BookmarkIcon from "../../../assets/icons/BookmarkIcon";
import MatchCircle from "./MatchCircle";

interface JobCardProps {
	title: string;
	match: number;
	location: string;
	salary: string;
	requirements: string[];
	details: string;
	link?: string;
	bookmarked?: boolean;
}

export default function JobCard(props: JobCardProps) {
	const [showDetails, setShowDetails] = useState(false);
	const [saved, setSaved] = useState(props.bookmarked);

	return (
		<div className="h-full w-full flex flex-col justify-between gap-2.5 rounded-lg border-2 px-2.5 py-2 bg-surface border-border">
			{showDetails ? (
				<DetailsView details={props.details} />
			) : (
				<OverView {...props} />
			)}

			<menu className="flex items-center justify-between gap-4 h-9">
				<button
					onClick={() => setShowDetails((prev) => !prev)}
					className="cursor-pointer w-full h-full rounded-full text-background bg-primary-action transition">
					{showDetails ? "Go Back" : "View Detials"}
				</button>

				{props.link && (
					<button
						onClick={() => window.open(props.link)}
						className="cursor-pointer w-full h-full rounded-full border-2 text-primary-action bg-transparent transition">
						Open Link
					</button>
				)}

				<button onClick={() => setSaved(!saved)}>
					<BookmarkIcon
						className={`size-6 ${saved ? "[&>g>path]:fill-primary-action [&>g>path]:stroke-surface" : "[&>g>path]:stroke-primary-action"}`}
					/>
				</button>
			</menu>
		</div>
	);
}

function DetailsView({ details }: { details: string }) {
	return (
		<div className="flex flex-col gap-1.25 h-full">
			<h3 className="text-lg font-medium text-text-muted">Details:</h3>
			<p className="whitespace-pre-wrap text-md text-primary-text">{details}</p>
		</div>
	);
}

function OverView({
	title,
	match,
	location,
	salary,
	requirements,
}: JobCardProps) {
	return (
		<div className="flex flex-col h-full justify-between gap-2.5">
			<div className="flex items-center gap-4">
				<div className="w-20">
					<MatchCircle percentage={match} />
				</div>
				<h2 className="text-lg font-bold text-primary-text">{title}</h2>
			</div>

			<div className="flex flex-col gap-2.5">
				<div className="flex gap-3 text-md">
					<span className="text-text-muted">Location:</span>
					<span className="font-semibold text-primary-text">{location}</span>
				</div>

				<div className="flex gap-3 text-md">
					<span className="text-text-muted">Paycheck:</span>
					<span className="font-semibold text-primary-text">{salary}</span>
				</div>

				<div>
					<p className="text-md text-text-muted">Requirements:</p>

					<ul className="list-disc flex flex-col gap-1 pl-8 text-md text-primary-text">
						{requirements.map((requirement) => (
							<li key={requirement}>{requirement}</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
