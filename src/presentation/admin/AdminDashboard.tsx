import { adminAPI, type AdminStats } from "../../services/admin";
import { useCustomQuery } from "../components/hooks/useCostumQuery";

const STAT_LABELS: Record<keyof AdminStats, string> = {
	total_users: "Users",
	total_jobs: "Jobs",
	total_chats: "Chats",
	total_messages: "Messages",
};

export default function AdminDashboard() {
	const { data, isPending } = useCustomQuery({
		key: ["adminStats"],
		func: adminAPI.stats,
	});

	const stats = data?.data;

	return (
		<div className="p-7 max-md:p-4 overflow-y-auto h-full w-full scrollbar-gray flex flex-col gap-7">
			<h1 className="font-semibold text-2xl text-primary-text">Dashboard</h1>

			<div className="grid grid-cols-4 max-[900px]:grid-cols-2 max-md:grid-cols-1 gap-5">
				{isPending
					? Array(4)
							.fill("")
							.map((_, i) => (
								<div key={i} className="h-28 rounded-lg bg-border/70 animate-pulse"></div>
							))
					: (Object.keys(STAT_LABELS) as (keyof AdminStats)[]).map((key) => (
							<div
								key={key}
								className="rounded-lg border-2 border-border p-5 flex flex-col gap-2 bg-background
								hover:border-accent-hover transition-all duration-150">
								<p className="text-text-muted text-[14px] font-medium">{STAT_LABELS[key]}</p>
								<p className="text-3xl font-bold text-primary-text">{stats ? stats[key] : 0}</p>
							</div>
						))}
			</div>
		</div>
	);
}