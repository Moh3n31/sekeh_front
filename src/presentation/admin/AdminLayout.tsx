import { NavLink, Outlet, useNavigate } from "react-router";
import useProfile from "../../services/profileStorage";
import { useEffect } from "react";
import { toast } from "../../services/toast";

const tabs = [
	{ path: "dashboard", label: "داشبورد" },
	{ path: "users", label: "کاربران" },
	{ path: "jobs", label: "مشاغل" },
];

export default function AdminLayout() {
	const { profile } = useProfile();
	const navigate = useNavigate();

	useEffect(() => {
		if (profile?.role === "admin") {
			toast.warning("شما به پنل مدیریتی دسترسی ندارید.");
			navigate("/chats");
		}
	}, []);

	return (
		<div className="flex flex-col h-full w-full">
			<nav className="flex items-center gap-2 px-7 max-md:px-4 pt-5 border-b border-border">
				{tabs.map((tab) => (
					<NavLink
						key={tab.path}
						to={tab.path}
						className={({ isActive }) =>
							`px-4 py-2 rounded-t-lg font-semibold text-[14px] transition-all duration-150 ${
								isActive
									? "bg-background text-accent border-2 border-b-0 border-border"
									: "text-text-muted hover:text-primary-text"
							}`
						}>
						{tab.label}
					</NavLink>
				))}
			</nav>
			<div className="flex-1 overflow-hidden">
				<Outlet />
			</div>
		</div>
	);
}
