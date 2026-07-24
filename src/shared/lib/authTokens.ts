interface AuthTokens {
	access: string;
	refresh: string;
}

export const addTokens = ({ access, refresh }: AuthTokens) => {
	localStorage.setItem("access_token", access);
	localStorage.setItem("refresh_token", refresh);
};

export const removeTokens = () => {
	localStorage.removeItem("access_token");
	localStorage.removeItem("refresh_token");
};

export const checkTokens = (): boolean => {
	return !!(
		localStorage.getItem("access_token") &&
		localStorage.getItem("refresh_token")
	);
};
