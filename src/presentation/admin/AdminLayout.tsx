import { NavLink, Outlet } from "react-router";

const tabs = [
	{ path: "dashboard", label: "Dashboard" },
	{ path: "users", label: "Users" },
	{ path: "jobs", label: "Jobs" },
];

export default function AdminLayout() {
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