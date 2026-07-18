import {
	Archive,
	File,
	MessageCircle,
	Phone,
	Settings,
	User,
	type LucideIcon,
} from "lucide-react";

interface MenuItems {
	path: string;
	label: string;
	icon: LucideIcon;
	admin?: true;
}

export const menuItems: MenuItems[] = [
	{
		label: "پروفایل",
		path: "profile",
		icon: User,
	},
	{
		label: "پنل ادمین",
		path: "admin",
		icon: Settings,
		admin: true,
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
