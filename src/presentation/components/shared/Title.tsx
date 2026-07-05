import { Sparkles } from "lucide-react";

export default function Title({
	wrapperClassName,
	mianColor,
	subColor,
}: {
	wrapperClassName?: string;
	mianColor?: string;
	subColor?: string;
}) {
	const mainstyle = {
		color: `var(--color-${mianColor})`,
	};
	const subStyle = {
		color: `var(--color-${subColor})`,
	};

	return (
		<div
			className={`flex items-center justify-start gap-2 ${wrapperClassName}`}>
			{/* <span className="size-7 rounded-full border-5 border-accent-hover"></span> */}
			<div className="relative md:size-10 max-md:size-5 rounded-full bg-linear-to-br from-accent to-accent-hover flex items-center justify-center">
				<Sparkles className="md:size-5 max-md:size-3 text-background" />
			</div>
			<p
				style={subStyle}
				className="font-semibold md:text-3xl max-md:text-lg text-center [&>span]:text-accent-hover text-primary-text -mt-1">
				<span style={mainstyle}>سـ.</span>امانه{" "}
				<span style={mainstyle}>کـ.</span>اریابی{" "}
				<span style={mainstyle}>هـ.</span>وشمند
			</p>
		</div>
	);
}
