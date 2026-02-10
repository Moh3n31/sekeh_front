// Hooks
import { NavLink, useLocation } from "react-router"; //useNavigate, Link
// Components
import LogoutDialog from "../profile/LogoutDialog";
import MenuIcon from "../../assets/icons/MenuIcon";
import LogoutIcon from "../../assets/icons/LogoutIcon";
//Types & data
import { menuItems } from "./navbarRouts";
// import { chatAPI, type ChatsFetch } from "../../services/chat"; //newChat
// import { useApi } from "../components/hooks/useApi";
// import { useFetch } from "../components/hooks/useFetch";
// import NewChatIcon from "../../assets/icons/NewChatIcon";
// import { useMutation } from "../components/hooks/useMutation";
// const fetchHistoryQuery = fetchHistory("1");
// const newChatQuery = newChat("1");

export default function NavbarMobile() {
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

	return (
		<div className=" md:hidden">
			<input type="checkbox" id="navbar-menu" className="peer hidden" />
			<label htmlFor="navbar-menu">
				<MenuIcon className="[&>g>path]:stroke-white bg-accent p-1 size-7 rounded-full" />
			</label>
			<section className="fixed w-1/2 h-full top-17 left-0 animate-slide-in-left hidden peer-checked:block z-20">
				<nav className="flex flex-col items-start gap-5 w-full h-full bg-background p-2">
					{menuItems.map(({ icon: Icon, path, label }) => {
						const isThisPage = location.pathname.includes(path);
						return (
							<NavLink
								to={`/${path}`}
								className={`cursor-pointer ${
									isThisPage ? "bg-accent" : "hover:bg-accent-soft"
								} px-3 md:py-1 max-md:py-2 rounded-lg transition-all duration-150 flex gap-7 items-center w-full`}
								key={`${path}-icon`}
								id={`${path}-icon`}>
								<Icon
									className={`md:size-5 max-md:size-6 ${
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
					<button
						popoverTarget="logout-dialog"
						className="group cursor-pointer md:py-1 max-md:py-2 px-3 rounded-lg flex gap-7 items-center w-full
						hover:bg-primary-action border-2 border-primary-action transition-all duration-150">
						<LogoutIcon className="md:size-5 max-md:size-6 group-hover:[&>g>path]:stroke-background [&>g>path]:stroke-primary-action" />
						<span className="font-semibold group-hover:text-background text-primary-action">
							Log out
						</span>
					</button>
				</nav>
			</section>
			<label
				htmlFor="navbar-menu"
				className="backdrop-blur-[2px] fixed w-full h-full top-17 left-0 z-19 hidden peer-checked:block"></label>
			<LogoutDialog />
		</div>
	);
}
