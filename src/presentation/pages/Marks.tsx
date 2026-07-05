import { MarkAPI } from "../../services/mark";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import JobCard from "../components/shared/JobCard";

export default function Marks() {
	const { allMarked } = MarkAPI;
	const { data } = useCustomQuery({ func: allMarked, key: ["allMarked"] });

	const all = data?.data.bookmarks ?? [];

	if (all.length == 0)
		return (
			<div className="flex items-center justify-center w-full h-full">
				<p className="text-text-muted max-w-2/3 text-center">
					برای ذخیره کردن کارت مشاغل، از صفحه چت اقدام کنید.
				</p>
			</div>
		);

	return (
		<div className="grid grid-cols-4 gap-5 h-full p-7 overflow-y-auto w-full">
			{all.map((j) => (
				<JobCard {...j} />
			))}
		</div>
	);
}
