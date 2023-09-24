export const dateFormatter = (date: Date | undefined) => {
	if (date) return date.toISOString().split("T")[0];
	return "invalid date";
};

const unformattedToday = new Date()
const unformattedTomorrow = new Date()
unformattedTomorrow.setDate(unformattedTomorrow.getDate() + 1)
export const today: string = dateFormatter(unformattedToday);
export const tomorrow: string = dateFormatter(unformattedTomorrow);
