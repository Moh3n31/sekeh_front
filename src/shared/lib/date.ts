export function formatDate(d: string, hasHours: boolean = false) {
	const date = new Date(d);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	if (hasHours) {
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		return `${year} / ${month} / ${day} - ${hours} : ${minutes}`;
	}

	return `${year} / ${month} / ${day}`;
}
