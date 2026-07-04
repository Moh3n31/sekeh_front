import { MarkAPI } from "../../services/mark";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import JobCard from "../components/shared/JobCard";

export default function Marks() {
	const { allMarked } = MarkAPI;
	const { data } = useCustomQuery({ func: allMarked, key: ["allMarked"] });

	const all = data?.data ?? [];

	if (all.length == 0)
		return (
			<div className="flex items-center justify-center w-full h-full">
				<p className="text-text-muted">You have 0 marked job cards.</p>
			</div>
		);

	return (
		<div className="grid grid-cols-4 gap-5 h-full p-7 overflow-y-auto w-full">
			{all.map(() => (
				<JobCard
					company_name="company Name"
					company_reviews={{ score: 4, count: 2345 }}
					job_url=""
					match_percent={24}
					requirements={["1", "2"]}
					source_site="Jobinja"
					title="Job Name"
				/>
			))}
		</div>
	);
}
