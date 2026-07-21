import { useState } from "react";
import { Briefcase } from "lucide-react";
import { adminAPI } from "../../services/admin";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import Pagination from "../components/shared/Pagination";
import EditJobDialog from "../admin/EditJobDialog";
import DeleteJobDialog from "../admin/DeleteJobDialog";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminJobs() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const queryClient = useQueryClient();

	const { data, isPending } = useCustomQuery({
		key: ["adminJobs", search, page],
		func: () => adminAPI.jobs({ q: search, page, per_page: 20 }),
	});

	const jobs = data?.data.jobs ?? [];

	return (
		<div className="p-7 max-md:p-4 overflow-y-auto h-full w-full scrollbar-gray flex flex-col gap-5">
			<header className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center rounded-full size-12 bg-linear-30 from-accent-hover to-match">
						<Briefcase className="size-6 text-background" />
					</div>
					<div>
						<p className="font-semibold text-2xl text-primary-text">مدیریت مشاغل</p>
						<p className="text-text-muted">لیست مشاغل را مرور، ویرایش یا حذف کنید.</p>
					</div>
				</div>
				<div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
					<input
						value={search}
						onChange={(e) => {
							setPage(1);
							setSearch(e.target.value);
						}}
						placeholder="جستجو بر اساس عنوان، شرکت یا متن..."
					className="border-2 border-border rounded-md h-10 px-3 w-72 max-md:w-full outline-0
					focus:border-accent transition-all duration-150 text-[15px]"
				/>
				</div>
			</header>

			<div className="rounded-lg border-2 border-border overflow-hidden overflow-x-auto">
				<table className="w-full text-[14px]">
					<thead className="bg-surface text-primary-action">
						<tr>
							<th className="text-right p-3 font-semibold">عنوان</th>
							<th className="text-right p-3 font-semibold max-md:hidden">شرکت</th>
							<th className="text-right p-3 font-semibold max-md:hidden">مکان</th>
							<th className="text-right p-3 font-semibold max-md:hidden">منبع</th>
							<th className="text-right p-3 font-semibold">امبدینگ</th>
							<th className="text-right p-3 font-semibold"></th>
						</tr>
					</thead>
					<tbody>
						{isPending
							? Array(6)
									.fill("")
									.map((_, i) => (
										<tr key={i} className="border-t border-border">
											<td colSpan={6} className="p-3">
												<div className="h-5 w-full bg-border/70 rounded animate-pulse"></div>
											</td>
										</tr>
									))
							: jobs.map((j) => (
									<tr key={j.job_id} className="border-t border-border hover:bg-surface/50 transition-all duration-150">
										<td className="p-3 text-primary-text font-medium">{j.job_title ?? "—"}</td>
										<td className="p-3 text-text-muted max-md:hidden">{j.company_name ?? "—"}</td>
										<td className="p-3 text-text-muted max-md:hidden">{j.location ?? "—"}</td>
										<td className="p-3 text-text-muted max-md:hidden">{j.source_site ?? "—"}</td>
										<td className="p-3">
											<span
												className={`px-2 py-0.5 rounded-full text-[12px] font-semibold
												${j.has_embedding ? "bg-match-soft text-match" : "bg-primary-red/10 text-primary-red"}`}>
												{j.has_embedding ? "بله" : "خیر"}
											</span>
										</td>
										<td className="p-3 flex items-center gap-2">
											<EditJobDialog job={j} />
											<DeleteJobDialog
												id={j.job_id}
												title={j.job_title ?? j.job_url}
												onDeleted={() => queryClient.invalidateQueries({ queryKey: ["adminJobs"] })}
											/>
										</td>
									</tr>
								))}

						{!isPending && jobs.length === 0 && (
							<tr>
								<td colSpan={6} className="p-6 text-center text-text-muted">
									شغلی یافت نشد.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{data?.data && <Pagination page={data.data.page} pages={data.data.pages} onChange={setPage} />}
		</div>
	);
}