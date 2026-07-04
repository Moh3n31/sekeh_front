import JobCard from "../components/shared/JobCard";

export default function Marks() {
	return (
		<div className="grid grid-cols-4 gap-5 h-full p-7 overflow-y-auto">
			{Array.from({ length: 10 }).map(() => (
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
