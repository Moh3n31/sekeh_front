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
		label: "پروفایل",
		path: "profile",
		icon: UserIcon,
	},
	{
		label: "ذخیره‌ها",
		path: "marks",
		icon: BoxIcon,
	},
	{
		label: "چت‌ها",
		path: "chats",
		icon: ChatIcon,
	},
	{
		label: "ارتباط با ما",
		path: "contact-us",
		icon: PhoneIcon,
	},
];
