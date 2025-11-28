// Hooks
import { NavLink } from "react-router";
//Assets
import BoxIcon from "../../assets/icons/BoxIcon";
import ChatIcon from "../../assets/icons/ChatIcon";
import MenuIcon from "../../assets/icons/MenuIcon";
import UserIcon from "../../assets/icons/UserIcon";
//Types & data
import type { IconProps } from "../../services/types";

interface MenuItems {
	path: string;
	icon: React.ComponentType<IconProps>;
}
export default function Navbar() {

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
		const itemRec = document.getElementById(`${id}-icon`)?.getBoundingClientRect();
		if (itemRec && pointer) {
			const targetH = itemRec.top - 5 ;
			pointer.style.top = `${targetH}px`;
		}
	}

	return (
		<div className="relative w-35 bg-powder-blue pt-6 flex flex-col items-center gap-10 transition-all duration-250">
			{/* Menu Toggler */}
			<button className="cursor-pointer mb-7">
				<MenuIcon className="[&>g>*]:stroke-midnight-violet [&>g>path]:transition-all [&>g>path]:duration-150" />
			</button>

			{/* Navigation Items */}
			{menuItems.map(({ icon: Icon, path }) => (
				<NavLink
					onClick={()=>movePointer(path)}
					to={`/${path}`}
					className="cursor-pointe hover:[&>svg>g>*]:stroke-blackberry-cream"
					key={`${path}-icon`}
					id={`${path}-icon`}>
					<Icon className="[&>g>*]:stroke-midnight-violet" />
				</NavLink>
			))}

			<div
				className="absolute size-12 rounded-tr-xl rotate-45 bg-gray-1 -left-6 transition-all duration-150 shadow-nav-pointer"
				id="menu-pointer"></div>
		</div>
	);
}
