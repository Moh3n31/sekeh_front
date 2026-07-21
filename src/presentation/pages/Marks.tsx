import { MarkAPI } from "../../services/mark";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import JobCard from "../components/shared/JobCard";
import { BookmarkCheck } from "lucide-react";

export default function Marks() {
	const { allMarked } = MarkAPI;
	const { data } = useCustomQuery({ func: allMarked, key: ["allMarked"] });

	const all = data?.data.bookmarks ?? [];

	if (all.length == 0)
		return (
			<div className="flex flex-col gap-6 w-full h-full p-7">
				<header className="flex items-center gap-3">
					<div className="flex items-center justify-center rounded-full size-12 bg-linear-30 from-accent-hover to-match">
						<BookmarkCheck className="size-6 text-background" />
					</div>
					<div>
						<p className="font-semibold text-2xl text-primary-text">
							شغل‌های ذخیره‌شده
						</p>
						<p className="text-text-muted">
							در این بخش شغل‌های مورد علاقه‌تان را مدیریت کنید.
						</p>
					</div>
				</header>
				<div className="flex items-center justify-center flex-1">
					<p className="text-text-muted max-w-2/3 text-center">
						برای ذخیره کردن کارت مشاغل، از صفحه چت اقدام کنید.
					</p>
				</div>
			</div>
		);

	return (
		<div className="flex flex-col gap-6 h-full p-7 overflow-y-auto w-full">
			<header className="flex items-center gap-3">
				<div className="flex items-center justify-center rounded-full size-12 bg-linear-30 from-accent-hover to-match">
					<BookmarkCheck className="size-6 text-background" />
				</div>
				<div>
					<p className="font-semibold text-2xl text-primary-text">
						شغل‌های ذخیره‌شده
					</p>
					<p className="text-text-muted">
						در این بخش شغل‌های مورد علاقه‌تان را مدیریت کنید.
					</p>
				</div>
			</header>

			<div className="grid grid-cols-4 max-md:grid-cols-1 gap-5 w-full">
				{all.map((j) => (
					<JobCard
						{...j}
						key={`marked-${j.job_url}`}
						jobFetchKey="allMarked"
						bookmarked
					/>
				))}
			</div>
		</div>
	);
}
