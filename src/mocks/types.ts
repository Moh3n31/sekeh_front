import type { Job, MessageObject } from "@/features/chat/api/chatApi";

export interface MockUser {
	user_id: number;
	username: string;
	email: string | null;
	phone_number: string | null;
	role: "user" | "admin";
	password: string;
	created_at: string;
	updated_at: string | null;
}

export interface MockChat {
	chat_id: number;
	user_id: number;
	created_at: string;
	title: string;
	updated_at: string;
	messages: MessageObject[];
}

export interface MockResume {
	id: number;
	user_id: number;
	title: string;
	content: string;
	created_at: string;
	updated_at: string;
}

export interface MockAdminJob {
	job_id: number;
	job_url: string;
	source_site: string | null;
	job_title: string | null;
	company_name: string | null;
	location: string | null;
	paycheck: string | null;
	requirements: string[];
	has_embedding: boolean;
	raw_text: string;
}

export interface CatalogJob extends MockAdminJob {
	job_title: string;
	company_name: string;
	requirements: string[];
	match_percent: number;
	company_reviews: { rating: number; count: number } | null;
}

export interface MockDatabase {
	version: number;
	users: MockUser[];
	chats: MockChat[];
	resumes: MockResume[];
	bookmarks: Record<string, Job[]>;
	jobs: MockAdminJob[];
	extraChats: number;
	extraMessages: number;
	accessTokens: Record<string, number>;
	refreshTokens: Record<string, number>;
	sequences: {
		user: number;
		chat: number;
		resume: number;
		message: number;
		job: number;
	};
}

export interface PublicUser {
	phone_number: string | null;
	username: string;
	email: string | null;
	role: "user" | "admin";
	created_at: string;
	updated_at: string | null;
}

export type MockFailure = {
	ok: false;
	status: 400 | 401 | 403 | 404;
	error: string;
};

export type MockSuccess<T> = { ok: true; data: T };

export type MockResult<T> = MockSuccess<T> | MockFailure;
