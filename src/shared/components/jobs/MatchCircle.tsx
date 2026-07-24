import { useEffect, useMemo, useState } from "react";

interface MatchCircleProps {
	percentage: number;
}

export default function MatchCircle({ percentage }: MatchCircleProps) {
	const [animatedValue, setAnimatedValue] = useState(0);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setAnimatedValue(percentage);
		}, 100);

		return () => clearTimeout(timeout);
	}, [percentage]);

	const radius = 42;
	const circumference = 2 * Math.PI * radius;

	const dashOffset = useMemo(() => {
		return circumference * (1 - animatedValue / 100);
	}, [animatedValue, circumference]);

	return (
		<div className="relative aspect-square w-full">
			<svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
				<defs>
					<linearGradient
						id="match-gradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%">
						<stop offset="0%" stopColor="var(--color-accent)" />
						<stop offset="100%" stopColor="var(--color-primary-green)" />
					</linearGradient>
				</defs>

				{/* Background ring */}
				<circle
					cx="50"
					cy="50"
					r={radius}
					fill="none"
					stroke="var(--color-border)"
					strokeWidth="10"
				/>

				{/* Progress ring */}
				<circle
					cx="50"
					cy="50"
					r={radius}
					fill="none"
					stroke="url(#match-gradient)"
					strokeWidth="10"
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={dashOffset}
					style={{
						transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
					}}
				/>
			</svg>

			<div
				className=" absolute inset-0 flex items-center justify-center font-normal text-text-muted text-lg">
				{Math.round(animatedValue)}%
			</div>
		</div>
	);
}
