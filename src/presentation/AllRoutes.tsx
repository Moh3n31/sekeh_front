import { Routes, Route, Navigate } from "react-router";
import Chat from "./pages/Chat";
import Layout from "./layout/Layout";
import Marks from "./pages/Marks";
import Profile from "./pages/Profile";
import ChatHistory from "./pages/ChatHistory";
import Login from "./pages/Login";
import AuthLayout from "./layout/AuthLayout";
// import EnterEmail from "./pages/EnterEmail";
import Signup from "./pages/Signup";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Resume from "./pages/Resume";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminJobs from "./admin/AdminJobs";

export default function AllRoutes() {
	return (
		<Routes>
			<Route path="/" index element={<Landing />} />

			<Route path="auth" element={<AuthLayout />}>
				<Route path="login" element={<Login />} />
				{/* <Route path="enter-email" element={<EnterEmail />} /> */}
				<Route path="signup" element={<Signup />} />
			</Route>
			<Route path="/" element={<Layout />}>
				<Route index element={<Navigate to="chats" />} />
				<Route path="chats" element={<ChatHistory />} />
				<Route path="chats/:chatId" element={<Chat />} />
				<Route path="marks" element={<Marks />} />
				<Route path="profile" element={<Profile />} />
				<Route path="resume" element={<Resume />} />
				<Route path="contact-us" element={<ContactUs />} />

				<Route path="admin" element={<AdminLayout />}>
					<Route index element={<Navigate to="dashboard" />} />
					<Route path="dashboard" element={<AdminDashboard />} />
					<Route path="users" element={<AdminUsers />} />
					<Route path="jobs" element={<AdminJobs />} />
				</Route>
			</Route>

			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
