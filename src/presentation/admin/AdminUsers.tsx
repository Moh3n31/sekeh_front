import { useState } from "react";
import { Users } from "lucide-react";
import { adminAPI } from "../../services/admin";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import Pagination from "../components/shared/Pagination";
import DeleteUserDialog from "../admin/DeleteUserDialog";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminUsers() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const queryClient = useQueryClient();

	const { data, isPending } = useCustomQuery({
		key: ["adminUsers", search, page],
		func: () => adminAPI.users({ q: search, page, per_page: 20 }),
	});

	const users = data?.data.users ?? [];

	return (
		<div className="p-7 max-md:p-4 overflow-y-auto h-full w-full scrollbar-gray flex flex-col gap-5">
			<header className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center rounded-full size-12 bg-linear-30 from-accent-hover to-match">
						<Users className="size-6 text-background" />
					</div>
					<div>
						<p className="font-semibold text-2xl text-primary-text">مدیریت کاربران</p>
						<p className="text-text-muted">کاربران ثبت‌نام‌شده را جستجو و مدیریت کنید.</p>
					</div>
				</div>
				<div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
					<input
						value={search}
						onChange={(e) => {
							setPage(1);
							setSearch(e.target.value);
						}}
						placeholder="جستجو بر اساس نام کاربری یا ایمیل..."
						className="border-2 border-border rounded-md h-10 px-3 w-72 max-md:w-full outline-0
						focus:border-accent transition-all duration-150 text-[15px]"
					/>
				</div>
			</header>

			<div className="rounded-lg border-2 border-border overflow-hidden overflow-x-auto">
				<table className="w-full text-[14px]">
					<thead className="bg-surface text-primary-action">
						<tr>
							<th className="text-right p-3 font-semibold">نام کاربری</th>
							<th className="text-right p-3 font-semibold max-md:hidden">ایمیل</th>
							<th className="text-right p-3 font-semibold max-md:hidden">تلفن</th>
							<th className="text-right p-3 font-semibold">نقش</th>
							<th className="text-right p-3 font-semibold max-md:hidden">تاریخ ثبت</th>
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
							: users.map((u) => (
									<tr key={u.user_id} className="border-t border-border hover:bg-surface/50 transition-all duration-150">
										<td className="p-3 text-primary-text font-medium">{u.username}</td>
										<td className="p-3 text-text-muted max-md:hidden">{u.email ?? "—"}</td>
										<td className="p-3 text-text-muted max-md:hidden">{u.phone_number ?? "—"}</td>
										<td className="p-3">
											<span
												className={`px-2 py-0.5 rounded-full text-[12px] font-semibold
												${u.role === "admin" ? "bg-accent-soft text-accent" : "bg-surface text-text-muted"}`}>
												{u.role === "admin" ? "مدیر" : "کاربر"}
											</span>
										</td>
										<td className="p-3 text-text-muted max-md:hidden">
											{new Date(u.created_at).toLocaleDateString()}
										</td>
										<td className="p-3">
											<DeleteUserDialog
												id={u.user_id}
												username={u.username}
												onDeleted={() => queryClient.invalidateQueries({ queryKey: ["adminUsers"] })}
											/>
										</td>
									</tr>
								))}

						{!isPending && users.length === 0 && (
							<tr>
								<td colSpan={6} className="p-6 text-center text-text-muted">
									کاربری یافت نشد.
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