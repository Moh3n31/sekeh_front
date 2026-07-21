export default function JobCards() {
	return (
		<div className="w-full flex flex-col gap-5 border-2 border-border bg-background rounded-2xl p-4">
			<header className="flex gap-5 items-center">
				<div className="bg-accent size-5 shrink-0 rounded-full"></div>
				<div>Title</div>
			</header>
			<main>
				<div>
					<p>Location:</p>
					<p>Remote</p>
				</div>
				<div>
					<p>Paycheck:</p>
					<p>200$ per month</p>
				</div>
			</main>
		</div>
	);
}
