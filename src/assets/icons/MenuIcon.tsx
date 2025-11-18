import type { IconProps } from "../../services/types";

export default function MenuIcon({
	className,
	mainFill,
	subFill,
}: IconProps) {
	return (
		<svg
			height="35px"
			width="35px"
			className={`rotate-z-180 ${className}`}
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
					d="M22 7.81V16.19C22 19.83 19.83 22 16.19 22H9V2H16.19C19.83 2 22 4.17 22 7.81Z"
					fill="#292D32"></path>{" "}
				<path
					className={subFill ?? "fill-[#292D32]"}
					d="M9 2V22H7.81C4.17 22 2 19.83 2 16.19V7.81C2 4.17 4.17 2 7.81 2H9Z"
					fill="#292D32"></path>{" "}
			</g>
		</svg>
	);
}
