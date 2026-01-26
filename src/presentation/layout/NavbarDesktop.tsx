// Hooks
import { NavLink, useLocation } from "react-router"; //useNavigate, Link
//Assets
import BoxIcon from "../../assets/icons/BoxIcon";
import ChatIcon from "../../assets/icons/ChatIcon";
import UserIcon from "../../assets/icons/UserIcon";
//Types & data
import type { IconProps } from "../../services/types";
import BalloonIcon from "../../assets/icons/BalloonIcon";
import LogoutDialog from "../profile/LogoutDialog";
// import { chatAPI, type ChatsFetch } from "../../services/chat"; //newChat
// import { useApi } from "../components/hooks/useApi";
// import { useFetch } from "../components/hooks/useFetch";
// import NewChatIcon from "../../assets/icons/NewChatIcon";
// import { useMutation } from "../components/hooks/useMutation";
// const fetchHistoryQuery = fetchHistory("1");
// const newChatQuery = newChat("1");

interface MenuItems {
	path: string;
	label: string;
	icon: React.ComponentType<IconProps>;
}
export default function NavbarDesktop() {
	// const { mutate } = useMutation();
	// const navigate = useNavigate();
	const location = useLocation();

	// const { data: chatHistory, refetch } = useFetch<ChatsFetch>(
	// 	chatAPI.history("1")
	// );

	// const handleNewChat = async () => {
	// 	const res = await mutate(chatAPI.newChat("1"))
	// 		.then(() => {
	// 			navigate(`/chat/${res.chat.chat_id}`);
	// 			refetch();
	// 		})
	// 		.catch((e) => console.log(e));
	// };

	const menuItems: MenuItems[] = [
		{
			label: "Profile",
			path: "profile",
			icon: UserIcon,
		},
		{
			label: "Marked",
			path: "marks",
			icon: BoxIcon,
		},
		{
			label: "Chats",
			path: "chats",
			icon: ChatIcon,
		},
	];

	return (
		<div className="px-2 pt-19 pb-10 w-45 flex flex-col justify-between h-full bg-background shrink-0 max-md:hidden">
			<nav className="flex flex-col items-start gap-5">
				{/* Navigation Items */}
				{menuItems.map(({ icon: Icon, path, label }) => {
					const isThisPage = location.pathname.includes(path);
					return (
						<NavLink
							to={`/${path}`}
							className={`cursor-pointer ${
								isThisPage ? "bg-accent" : "hover:bg-accent-soft"
							} px-3 py-1 rounded-lg transition-all duration-150 flex gap-7 items-center w-full`}
							key={`${path}-icon`}
							id={`${path}-icon`}>
							<Icon
								className={`size-5 ${
									isThisPage
										? "[&>g>*]:stroke-background"
										: "[&>g>*]:stroke-primary-action"
								}`}
							/>
							<span
								className={`font-semibold ${
									isThisPage ? "text-background" : "text-primary-text"
								}`}>
								{label}
							</span>
						</NavLink>
					);
				})}
			</nav>

			<button
				popoverTarget="logout-dialog"
				className="group cursor-pointer py-1 px-3 rounded-lg flex gap-7 items-center w-full
			hover:bg-primary-action border-2 border-primary-action transition-all duration-150">
				<BalloonIcon className="size-5 group-hover:[&>g>*]:stroke-background [&>g>*]:stroke-primary-action" />
				<span className="font-semibold group-hover:text-background text-primary-action">
					Log out
				</span>
			</button>

			<LogoutDialog />
		</div>
	);
}
