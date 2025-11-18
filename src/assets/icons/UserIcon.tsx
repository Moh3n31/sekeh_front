import type { IconProps } from "../../services/types";

export default function UserIcon({
	className,
	mainFill,
	subFill,
}: IconProps) {
	return (
		<svg
			height="35px"
			width="35px"
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g
				id="SVGRepo_tracerCarrier"
				strokeLinecap="round"
				strokeLinejoin="round"></g>
			<g id="SVGRepo_iconCarrier">
				{" "}
				<path
					className={mainFill ?? "fill-[#292D32]"}
					opacity="0.4"
					d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
					fill="#292D32"></path>{" "}
				<path
					className={subFill ?? "fill-[#292D32]"}
					d="M12.0002 14.5C6.99015 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5901C20.8701 22.5 21.0901 22.28 21.0901 22C21.0901 17.86 17.0102 14.5 12.0002 14.5Z"
					fill="#292D32"></path>{" "}
			</g>
		</svg>
	);
}
