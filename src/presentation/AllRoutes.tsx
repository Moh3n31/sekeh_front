import { Routes, Route, Navigate } from "react-router";
import Chat from "./pages/Chat";
import Main from "./pages/Main";
import Marks from "./pages/Marks";
import Profile from "./pages/Profile";

export default function AllRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Main />}>
				<Route index element={<Navigate to="chat" />} />
				<Route path="chat" element={<Chat />} />
				<Route path="marks" element={<Marks />} />
				<Route path="profile" element={<Profile />} />
			</Route>
		</Routes>
	);
}
