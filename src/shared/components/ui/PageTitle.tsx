import MainIcon from "./MainIcon";

export default function PageTitle({
	wrapperClassName,
	mianColor,
	subColor,
	iconClass,
}: {
	wrapperClassName?: string;
	mianColor?: string;
	subColor?: string;
	iconClass?: string;
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
			<MainIcon className={`md:size-15 max-md:size-10 ${iconClass}`} />
			<p
				style={subStyle}
				className="select-none font-semibold md:text-3xl max-md:text-lg text-center [&>span]:text-accent-hover text-primary-text -mt-1">
				<span style={mainstyle}>سـ.</span>امانه{" "}
				<span style={mainstyle}>کـ.</span>اریابی{" "}
				<span style={mainstyle}>هـ.</span>وشمند
			</p>
		</div>
	);
}
