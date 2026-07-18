import { useState } from "react";
import MatchCircle from "./MatchCircle";
import type { Job } from "../hooks/useChatStream";
import { Bookmark } from "lucide-react";
import { MarkAPI } from "../../../services/mark";
import { useCustomMutation } from "../hooks/useCostumMutation";
import { toast } from "../../../services/toast";
import { useQueryClient } from "@tanstack/react-query";

interface JobCardProps extends Job {
	bookmarked?: boolean;
	jobFetchKey?: string;
}

export default function JobCard(props: JobCardProps) {
	const [showDetails, setShowDetails] = useState(false);
	const [saved, setSaved] = useState(props.bookmarked ?? false);
	const { markCard } = MarkAPI;
	const { mutate: mark } = useCustomMutation(markCard, {
		onSuccess: (data) => {
			if (!data.data.bookmarked) toast.success("با موفقیت حذف شد.");
			else toast.success("با موفقیت ذخیره شد.");
			setSaved((prev) => !prev);
			if (props.jobFetchKey)
				queryClient.refetchQueries({ queryKey: [props.jobFetchKey] });
		},
	});
	const queryClient = useQueryClient();

	const handleMark = () => {
		mark(props);
	};

	return (
		<div
			dir="ltr"
			className="h-75 w-full flex flex-col justify-between gap-2.5 rounded-lg border px-2.5 py-2 bg-background border-border">
			<div className="flex items-center gap-4">
				<div className="w-16">
					<MatchCircle percentage={props.match_percent} />
				</div>
				<div className="flex flex-col gap-0.5">
					<h2 className="text-[16px] font-bold text-primary-text">
						{props.job_title}
					</h2>
					<p className="text-[14px] text-text-muted">
						{props.company_name} · {props.source_site}
					</p>
				</div>
			</div>
			{showDetails ? (
				<DetailsView
					paycheck={props.paycheck}
					company_name={props.company_name}
					source_site={props.source_site}
					company_reviews={props.company_reviews}
				/>
			) : (
				<OverView requirements={props.requirements} />
			)}

			<menu className="flex items-center justify-between gap-4 h-10 text-[11px]">
				<button
					onClick={() => setShowDetails((prev) => !prev)}
					disabled={!props.company_reviews && !props.paycheck}
					className="cursor-pointer w-full h-full rounded-full text-background bg-primary-action transition
					disabled:opacity-50">
					{showDetails ? "بازگشت" : "جزییات"}
				</button>

				<button
					onClick={() =>
						window.open(props.job_url, "_blank", "noopener,noreferrer")
					}
					className="cursor-pointer w-full h-full rounded-full border-2 text-primary-action bg-transparent transition">
					لینک
				</button>

				<button onClick={handleMark} className="cursor-pointer">
					<Bookmark
						strokeWidth={1.5}
						className={`size-5 text-primary-action ${
							saved && "fill-primary-action/60"
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
	company_reviews: { rating: number; count: number };
	paycheck: string;
}

function DetailsView({
	company_name,
	source_site,
	paycheck,
	company_reviews,
}: DetailsViewProps) {
	return (
		<div className="flex flex-col h-full justify-start gap-2.5 text-primary-text text-[14px] *:not-first:ps-5">
			<h3 className="text-[14px] font-medium text-text-muted">جزییات :</h3>

			{!!company_name && (
				<div className="flex gap-3">
					<span className="text-text-muted">شرکت :</span>
					<span className="font-semibold">{company_name}</span>
				</div>
			)}
			{!!source_site && (
				<div className="flex gap-3">
					<span className="text-text-muted">منبع :</span>
					<span className="font-semibold">{source_site}</span>
				</div>
			)}
			{!!paycheck && (
				<div className="flex gap-3">
					<span className="text-text-muted">بازه حقوق :</span>
					<span className="font-semibold">{paycheck}</span>
				</div>
			)}
			{!!company_reviews && (
				<div className="flex gap-3">
					<span className="text-text-muted">نظرات :</span>
					<span className="font-semibold">
						{company_reviews.rating.toFixed(1)} ⭐{" "}
						{company_reviews.count && (
							<span className="text-text-muted font-normal">
								({company_reviews.count} شرکت کننده)
							</span>
						)}
					</span>
				</div>
			)}
		</div>
	);
}

interface OverViewProps {
	requirements: string[];
}

function OverView({ requirements }: OverViewProps) {
	return (
		<div className="flex flex-col h-full justify-start gap-2.5">
			<div className="h-full text-[14px]">
				<p className="text-text-muted font-medium">نیازمندی‌ها:</p>
				<ul className="list-disc flex flex-col gap-1 ps-8 max-h-full text-primary-text overflow-y-auto">
					{requirements.map((requirement) => (
						<li key={requirement}>{requirement}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
