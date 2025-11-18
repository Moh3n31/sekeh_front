// Hooks
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
//Assets
import BookmarkIcon from "../../assets/icons/BookmarkIcon";
import ChatIcon from "../../assets/icons/ChatIcon";
import MenuIcon from "../../assets/icons/MenuIcon";
import UserIcon from "../../assets/icons/UserIcon";
//Types & data
import type { IconProps } from "../../services/types";

interface MenuItems {
	path: string;
	label: string;
	icon: React.ComponentType<IconProps>;
}
export default function Navbar() {
	const location = useLocation();
	const [activeItem, setActiveItem] = useState<string>("chat");
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		setActiveItem(location.pathname.slice(1));
	}, [location]);

	const menuItems: MenuItems[] = [
		{
			path: "profile",
			icon: UserIcon,
			label: "پروفایل",
		},
		{
			path: "marks",
			icon: BookmarkIcon,
			label: "نشان ها",
		},
		{
			path: "chat",
			icon: ChatIcon,
			label: "گفت و گو",
		},
	];

	return (
		<div
			className={`${
				isOpen ? "w-49" : "w-20"
			} px-5 items-end bg-grey-100 pt-6 flex flex-col gap-10 transition-all duration-250 overflow-x-hidden`}>
			{/* Menu Toggler */}
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				className="cursor-pointer flex flex-row-reverse items-center justify-between w-35 mb-7">
				<MenuIcon
					className="[&>g>path]:transition-all [&>g>path]:duration-150"
					mainFill={isOpen ? "fill-black opacity-100" : "fill-black"}
					subFill={isOpen ? "fill-black opacity-40" : "fill-black"}
				/>
				<span className={isOpen ? "block w-18 text-right" : "hidden"}>فهرست</span>
			</button>

			{/* Navigation Items */}
			{menuItems.map(({ label, icon: Icon, path }) => (
				<NavLink
					to={`/${path}`}
					className="cursor-pointer flex flex-row-reverse items-center justify-between w-35">
					<Icon
						mainFill={
							activeItem === path
								? "fill-red opacity-90"
								: "fill-black"
						}
						subFill="fill-black"
					/>
					<span
						className={`${isOpen ? "block w-18 text-right" : "hidden"} ${
							activeItem === path ? "text-red" : "text-black"
						}`}>
						{label}
					</span>
				</NavLink>
			))}
		</div>
	);
}
