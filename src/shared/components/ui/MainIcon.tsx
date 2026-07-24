import iconSrc from "@/assets/sekeh-icon.png";

export default function MainIcon({ className }: { className?: string }) {
	return (
		<div className={`${className}`}>
			<img
				className="size-full object-contain pointer-events-none select-none"
				src={iconSrc}
			/>
		</div>
	);
}
