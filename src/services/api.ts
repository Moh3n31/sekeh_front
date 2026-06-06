import axios from "axios";
import { toast } from "./toast";

interface ApiResponse<T> {
	status: "200" | "201";
	message: string;
	data: T;
}
interface Exceptions {
	status: "401" | "500" | "404";
	error: string;
	data: null;
}

export const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}api`,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

const getNewToken = async () => {
	const refreshToken = localStorage.getItem("refresh_token");

	const res = await axios.post(
		`${import.meta.env.VITE_API_URL}api/auth/refresh`,
		{},
		{
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		},
	);
	return res.data;
};

api.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshResponse = await getNewToken();

				const { accessToken, refreshToken } = refreshResponse.data;

				localStorage.setItem("access_token", accessToken);

				localStorage.setItem("refresh_token", refreshToken);

				originalRequest.headers.Authorization = `Bearer ${accessToken}`;

				return api(originalRequest);
			} catch (err) {
				localStorage.clear();

				toast.error("Your session has expired. Please sign in again.");

				setTimeout(() => {
					window.location.href = "/auth/login";
				}, 1000);

				return Promise.reject(err);
			}
		}

		const message =
			error.response?.data?.message ||
			error.response?.data?.error ||
			"Something went wrong. Please try again.";

		toast.error(message);

		return Promise.reject(error);
	},
);

export type { Exceptions, ApiResponse };
