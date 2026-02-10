import BoxIcon from "../../assets/icons/BoxIcon";
import ChatIcon from "../../assets/icons/ChatIcon";
import PhoneIcon from "../../assets/icons/PhoneIcon";
import UserIcon from "../../assets/icons/UserIcon";
import type { IconProps } from "../../services/types";

interface MenuItems {
	path: string;
	label: string;
	icon: React.ComponentType<IconProps>;
}

export const menuItems: MenuItems[] = [
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
	{
		label: "Contact Us",
		path: "contact-us",
		icon: PhoneIcon,
	},
];
