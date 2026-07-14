import {
	Archive,
	File,
	MessageCircle,
	Phone,
	User,
	type LucideIcon,
} from "lucide-react";

interface MenuItems {
	path: string;
	label: string;
	icon: LucideIcon;
}

export const menuItems: MenuItems[] = [
	{
		label: "پروفایل",
		path: "profile",
		icon: User,
	},
	{
		label: "ذخیره‌ها",
		path: "marks",
		icon: Archive,
	},
	{
		label: "چت‌ها",
		path: "chats",
		icon: MessageCircle,
	},
	{
		label: "رزومه‌ها",
		path: "resume",
		icon: File,
	},
	{
		label: "ارتباط با ما",
		path: "contact-us",
		icon: Phone,
	},
];
