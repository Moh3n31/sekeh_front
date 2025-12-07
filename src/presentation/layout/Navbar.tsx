// Hooks
import { Link, NavLink, useLocation, useNavigate } from "react-router";
//Assets
import BoxIcon from "../../assets/icons/BoxIcon";
import ChatIcon from "../../assets/icons/ChatIcon";
import MenuIcon from "../../assets/icons/MenuIcon";
import UserIcon from "../../assets/icons/UserIcon";
//Types & data
import type { IconProps } from "../../services/types";
import { useEffect } from "react";
import { chatAPI, type ChatObject, type ChatsFetch } from "../../services/chat"; //newChat
// import { useApi } from "../components/hooks/useApi";
import { useFetch } from "../components/hooks/useFetch";
import NewChatIcon from "../../assets/icons/NewChatIcon";
import { useMutation } from "../components/hooks/useMutation";
// const fetchHistoryQuery = fetchHistory("1");
// const newChatQuery = newChat("1");

interface MenuItems {
	path: string;
	icon: React.ComponentType<IconProps>;
}
export default function Navbar() {
	const { mutate } = useMutation();
	const navigate = useNavigate();
	const location = useLocation();

	const { data: chatHistory, refetch } = useFetch<ChatsFetch>(
		chatAPI.history("1")
	);

	const handleNewChat = async () => {
		const res = await mutate(chatAPI.newChat("1"))
			.then(() => {
				navigate(`/chat/${res.chat.chat_id}`);
				refetch();
			})
			.catch((e) => console.log(e));
	};

	const menuItems: MenuItems[] = [
		{
			path: "profile",
			icon: UserIcon,
		},
		{
			path: "marks",
			icon: BoxIcon,
		},
		{
			path: "chat",
			icon: ChatIcon,
		},
	];

	function movePointer(id: string) {
		const pointer = document.getElementById("menu-pointer");
		const itemRec = document
			.getElementById(`${id}-icon`)
			?.getBoundingClientRect();
		if (itemRec && pointer) {
			const targetH = itemRec.top - 5;
			pointer.style.top = `${targetH}px`;
		}
	}

	useEffect(() => {
		movePointer(location.pathname.slice(1, 5));
	});

	return (
		<div className="relative w-30 bg-powder-blue pt-6 flex flex-col items-center gap-10 transition-all duration-250">
			{/* Menu Toggler */}
			<button className="cursor-pointer mb-7">
				<MenuIcon className="size-7 [&>g>*]:stroke-midnight-violet" />
			</button>

			{/* Navigation Items */}
			{menuItems.map(({ icon: Icon, path }) => (
				<NavLink
					onClick={() => movePointer(path)}
					to={`/${path}`}
					className="cursor-pointe hover:[&>svg>g>*]:stroke-blackberry-cream"
					key={`${path}-icon`}
					id={`${path}-icon`}>
					<Icon className="size-7 [&>g>*]:stroke-midnight-violet" />
				</NavLink>
			))}

			{/* Chat History */}
			{location.pathname.slice(0, 5) === "/chat" && chatHistory && (
				<div className="bg-midnight-violet/10 max-h-80 overflow-hidden rounded-xl px-0.5 py-2 text-black">
					<button
						onClick={handleNewChat}
						className="flex text-[13px] justify-center gap-1 items-center w-full pb-1 group">
						<span className="text-midnight-violet font-semibold group-hover:text-blackberry-cream transition-all duration-150">
							New Chat
						</span>
						<NewChatIcon className="size-4 [&>g>*]:stroke-midnight-violet group-hover:[&>g>*]:stroke-blackberry-cream [&>g>path]:transition-all [&>g>path]:duration-150" />
					</button>

					<ul className="history-scrollbar overflow-x-hidden overflow-y-auto px-2 max-h-70">
						{[...chatHistory.chats]
							.reverse()
							.map(({ chat_id, title }) => (
								<li
									key={chat_id}
									id={chat_id}
									className="text-right"
									dir="rtl">
									<Link
										className="block truncate w-full hover:text-blackberry-cream
									hover:underline hover:underline-offset-2 cursor-pointer"
										to={`/chat/${chat_id}`}>
										{title}
									</Link>
								</li>
							))}
					</ul>
				</div>
			)}

			<div
				className="absolute size-12 rounded-tr-xl rotate-45 bg-gray-1 -left-6 transition-all duration-150 shadow-nav-pointer"
				id="menu-pointer"></div>
		</div>
	);
}
