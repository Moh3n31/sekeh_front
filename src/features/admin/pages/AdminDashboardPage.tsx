import { Settings } from "lucide-react";
import { adminAPI, type AdminStats } from "@/features/admin/api/adminApi";
import { useCustomQuery } from "@/shared/hooks/useCustomQuery";
import PageTitle from "@/shared/components/layout/PageTitle";

const STAT_LABELS: Record<keyof AdminStats, string> = {
	total_users: "کاربران",
	total_jobs: "مشاغل",
	total_chats: "چت‌ها",
	total_messages: "پیام‌ها",
};

export default function AdminDashboardPage() {
	const { data, isPending } = useCustomQuery({
		key: ["adminStats"],
		func: adminAPI.stats,
	});

	const stats = data?.data;

	return (
		<div className="p-7 max-md:p-4 overflow-y-auto h-full w-full flex flex-col gap-7">
			<PageTitle
				icon={Settings}
				title="پنل مدیریتی"
				desc="آمار کلی سامانه را مشاهده و وضعیت آن را بررسی کنید."
			/>
			<div className="grid grid-cols-4 gap-5">
				{isPending
					? Array(4)
							.fill("")
							.map((_, i) => (
								<div
									key={i}
									className="h-28 rounded-lg bg-border/70 animate-pulse"></div>
							))
					: (Object.keys(STAT_LABELS) as (keyof AdminStats)[]).map((key) => (
							<div
								key={key}
								className="rounded-lg border-2 border-border p-5 flex flex-col gap-2 bg-background
								hover:border-accent-hover transition-all duration-150">
								<p className="text-text-muted text-[14px] font-medium">
									{STAT_LABELS[key]}
								</p>
								<p className="text-3xl font-bold text-primary-text">
									{stats ? stats[key] : 0}
								</p>
							</div>
						))}
			</div>
		</div>
	);
}
