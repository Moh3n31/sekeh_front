import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import AppLayout from "@/shared/components/layout/AppLayout";
import AuthLayout from "@/shared/components/layout/AuthLayout";
import LandingPage from "@/features/landing/pages/LandingPage";
import RouteLoading from "@/shared/components/feedback/RouteLoading";

const ChatPage = lazy(() => import("@/features/chat/pages/ChatPage"));
const ChatHistoryPage = lazy(
	() => import("@/features/chat/pages/ChatHistoryPage"),
);
const MarksPage = lazy(() => import("@/features/marks/pages/MarksPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
const ResumePage = lazy(() => import("@/features/resume/pages/ResumePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("@/features/auth/pages/SignupPage"));
const ContactPage = lazy(() => import("@/features/contact/pages/ContactPage"));
const NotFoundPage = lazy(
	() => import("@/shared/components/layout/NotFoundPage"),
);
const AdminLayout = lazy(
	() => import("@/features/admin/components/AdminLayout"),
);
const AdminDashboardPage = lazy(
	() => import("@/features/admin/pages/AdminDashboardPage"),
);
const AdminUsersPage = lazy(
	() => import("@/features/admin/pages/AdminUsersPage"),
);
const AdminJobsPage = lazy(
	() => import("@/features/admin/pages/AdminJobsPage"),
);

export default function AppRouter() {
	return (
		<Suspense fallback={<RouteLoading />}>
			<Routes>
				<Route path="/" index element={<LandingPage />} />

				<Route path="auth" element={<AuthLayout />}>
					<Route path="login" element={<LoginPage />} />
					<Route path="signup" element={<SignupPage />} />
				</Route>
				<Route path="/" element={<AppLayout />}>
					<Route index element={<Navigate to="chats" />} />
					<Route path="chats" element={<ChatHistoryPage />} />
					<Route path="chats/:chatId" element={<ChatPage />} />
					<Route path="marks" element={<MarksPage />} />
					<Route path="profile" element={<ProfilePage />} />
					<Route path="resume" element={<ResumePage />} />
					<Route path="contact-us" element={<ContactPage />} />

					<Route path="admin" element={<AdminLayout />}>
						<Route index element={<Navigate to="dashboard" />} />
						<Route path="dashboard" element={<AdminDashboardPage />} />
						<Route path="users" element={<AdminUsersPage />} />
						<Route path="jobs" element={<AdminJobsPage />} />
					</Route>
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Suspense>
	);
}
