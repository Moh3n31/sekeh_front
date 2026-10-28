import type { Job, MessageObject } from "@/features/chat/api/chatApi";
import { createSeed } from "@/mocks/seed";
import type {
	MockAdminJob,
	MockChat,
	MockDatabase,
	MockResult,
	MockResume,
	MockUser,
	PublicUser,
} from "@/mocks/types";

const STORAGE_KEY = "sekeh-mock-db";
const DB_VERSION = 1;

let memory: MockDatabase | null = null;

function readStorage(): MockDatabase | null {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as MockDatabase;
		if (parsed.version !== DB_VERSION) return null;
		return parsed;
	} catch {
		return null;
	}
}

function writeStorage(db: MockDatabase) {
	sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function getDb(): MockDatabase {
	if (!memory) {
		memory = readStorage() ?? createSeed();
		writeStorage(memory);
	}
	return memory;
}

function persist() {
	if (memory) writeStorage(memory);
}

function fail(status: 400 | 401 | 403 | 404, error: string): MockResult<never> {
	return { ok: false, status, error };
}

export function publicUser(user: MockUser): PublicUser {
	return {
		username: user.username,
		email: user.email,
		phone_number: user.phone_number,
		role: user.role,
		created_at: user.created_at,
		updated_at: user.updated_at,
	};
}

function normalize(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replaceAll("ي", "ی")
		.replaceAll("ك", "ک")
		.replaceAll("\u200c", "");
}

function nextId(db: MockDatabase, key: keyof MockDatabase["sequences"]) {
	const id = db.sequences[key];
	db.sequences[key] += 1;
	return id;
}

function findUserByLogin(db: MockDatabase, login: string) {
	const normalized = normalize(login);
	if (!normalized) return undefined;

	if (normalized.includes("@")) {
		return db.users.find(
			(user) => user.email && normalize(user.email) === normalized,
		);
	}

	return db.users.find((user) => normalize(user.username) === normalized);
}

function issueTokens(db: MockDatabase, userId: number) {
	const access = `mock-access-${userId}-${crypto.randomUUID()}`;
	const refresh = `mock-refresh-${userId}-${crypto.randomUUID()}`;
	db.accessTokens[access] = userId;
	db.refreshTokens[refresh] = userId;
	return { access_token: access, refresh_token: refresh, token_type: "bearer" };
}

function clearUserTokens(db: MockDatabase, userId: number) {
	for (const [token, id] of Object.entries(db.accessTokens)) {
		if (id === userId) delete db.accessTokens[token];
	}
	for (const [token, id] of Object.entries(db.refreshTokens)) {
		if (id === userId) delete db.refreshTokens[token];
	}
}

function bearerToken(header: string | null) {
	if (!header) return "";
	const match = header.match(/^Bearer\s+(.+)$/i);
	return match?.[1]?.trim() ?? "";
}

export function userFromAuthorization(header: string | null): MockUser | null {
	const token = bearerToken(header);
	if (!token) return null;
	const db = getDb();
	const userId = db.accessTokens[token];
	if (!userId) return null;
	return db.users.find((user) => user.user_id === userId) ?? null;
}

export function login(username: string, password: string) {
	const db = getDb();
	const user = findUserByLogin(db, username);
	if (!user || user.password !== password) {
		return fail(401, "نام کاربری یا رمز عبور نادرست است.");
	}

	const tokens = issueTokens(db, user.user_id);
	persist();
	return {
		ok: true as const,
		data: {
			user: publicUser(user),
			...tokens,
		},
	};
}

export function refreshSession(header: string | null) {
	const token = bearerToken(header);
	const db = getDb();
	const userId = db.refreshTokens[token];
	if (!userId) return null;

	delete db.refreshTokens[token];
	const tokens = issueTokens(db, userId);
	persist();
	return {
		accessToken: tokens.access_token,
		refreshToken: tokens.refresh_token,
	};
}

export function logout(header: string | null) {
	const user = userFromAuthorization(header);
	if (!user) return;
	clearUserTokens(getDb(), user.user_id);
	persist();
}

export function register(username: string, password: string) {
	const db = getDb();
	const normalized = normalize(username);
	const taken = db.users.some((user) => normalize(user.username) === normalized);
	if (taken) return fail(400, "این نام کاربری قبلاً ثبت شده است.");

	const now = new Date().toISOString();
	const user: MockUser = {
		user_id: nextId(db, "user"),
		username: username.trim(),
		email: null,
		phone_number: null,
		role: "user",
		password,
		created_at: now,
		updated_at: null,
	};
	db.users.push(user);
	db.bookmarks[String(user.user_id)] = [];
	persist();
	return { ok: true as const, data: { user: publicUser(user) } };
}

export function updateProfile(
	userId: number,
	payload: { username: string; email: string | null; phone_number: string | null },
) {
	const db = getDb();
	const user = db.users.find((item) => item.user_id === userId);
	if (!user) return fail(404, "کاربر پیدا نشد.");

	const username = payload.username.trim();
	const email = payload.email?.trim() || null;
	const phone = payload.phone_number?.trim() || null;
	const normalizedName = normalize(username);

	const nameTaken = db.users.some(
		(item) =>
			item.user_id !== userId && normalize(item.username) === normalizedName,
	);
	if (nameTaken) return fail(400, "این نام کاربری قبلاً ثبت شده است.");

	if (email) {
		const emailTaken = db.users.some(
			(item) =>
				item.user_id !== userId &&
				item.email &&
				normalize(item.email) === normalize(email),
		);
		if (emailTaken) return fail(400, "این ایمیل قبلاً استفاده شده است.");
	}

	user.username = username;
	user.email = email;
	user.phone_number = phone;
	user.updated_at = new Date().toISOString();
	persist();
	return { ok: true as const, data: "پروفایل به‌روزرسانی شد." };
}

export function changePassword(
	userId: number,
	currentPassword: string,
	newPassword: string,
) {
	const db = getDb();
	const user = db.users.find((item) => item.user_id === userId);
	if (!user) return fail(404, "کاربر پیدا نشد.");
	if (user.password !== currentPassword) {
		return fail(400, "رمز عبور فعلی نادرست است.");
	}

	user.password = newPassword;
	user.updated_at = new Date().toISOString();
	persist();
	return { ok: true as const, data: "رمز عبور به‌روزرسانی شد." };
}

export function deleteAccount(userId: number) {
	const db = getDb();
	db.users = db.users.filter((user) => user.user_id !== userId);
	db.chats = db.chats.filter((chat) => chat.user_id !== userId);
	db.resumes = db.resumes.filter((resume) => resume.user_id !== userId);
	delete db.bookmarks[String(userId)];
	clearUserTokens(db, userId);
	persist();
	return { ok: true as const, data: "حساب حذف شد." };
}

function ownedChat(db: MockDatabase, userId: number, chatId: number) {
	return db.chats.find(
		(chat) => chat.chat_id === chatId && chat.user_id === userId,
	);
}

function toChatCard(chat: MockChat) {
	return {
		chat_id: chat.chat_id,
		created_at: chat.created_at,
		title: chat.title,
		updated_at: chat.updated_at,
	};
}

export function listChats(userId: number) {
	const chats = getDb()
		.chats.filter((chat) => chat.user_id === userId)
		.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
		.map(toChatCard);
	return { ok: true as const, data: { chats } };
}

export function createChat(userId: number) {
	const db = getDb();
	const now = new Date().toISOString();
	const chat: MockChat = {
		chat_id: nextId(db, "chat"),
		user_id: userId,
		created_at: now,
		title: "چت جدید",
		updated_at: now,
		messages: [],
	};
	db.chats.unshift(chat);
	persist();
	return { ok: true as const, data: { chat: toChatCard(chat) } };
}

export function deleteChat(userId: number, chatId: number) {
	const db = getDb();
	const chat = ownedChat(db, userId, chatId);
	if (!chat) return fail(404, "گفتگو پیدا نشد.");
	db.chats = db.chats.filter((item) => item.chat_id !== chatId);
	persist();
	return { ok: true as const, data: "گفتگو حذف شد." };
}

export function renameChat(userId: number, chatId: number, title: string) {
	const db = getDb();
	const chat = ownedChat(db, userId, chatId);
	if (!chat) return fail(404, "گفتگو پیدا نشد.");
	chat.title = title.trim() || "چت جدید";
	chat.updated_at = new Date().toISOString();
	persist();
	return { ok: true as const, data: { chat: toChatCard(chat) } };
}

export function getThread(userId: number, chatId: number) {
	const chat = ownedChat(getDb(), userId, chatId);
	if (!chat) return fail(404, "گفتگو پیدا نشد.");
	return {
		ok: true as const,
		data: {
			chat: toChatCard(chat),
			messages: chat.messages,
		},
	};
}

export function appendExchange(
	userId: number,
	chatId: number,
	userContent: string,
	assistantContent: string,
	jobs: Job[],
	startedAt: number,
) {
	const db = getDb();
	const chat = ownedChat(db, userId, chatId);
	if (!chat) return;

	const userMessage: MessageObject = {
		message_id: `msg-${nextId(db, "message")}`,
		role: "user",
		content: userContent,
		created_at: new Date(startedAt).toISOString(),
	};
	const assistantMessage: MessageObject = {
		message_id: `msg-${nextId(db, "message")}`,
		role: "assistant",
		content: assistantContent,
		created_at: new Date(startedAt + 1000).toISOString(),
		...(jobs.length ? { job_cards: jobs } : {}),
	};

	chat.messages.push(userMessage, assistantMessage);
	chat.updated_at = assistantMessage.created_at;
	persist();
}

function toResumeCard(resume: MockResume) {
	return {
		id: resume.id,
		title: resume.title,
		content: resume.content,
		created_at: resume.created_at,
		updated_at: resume.updated_at,
	};
}

export function listResumes(userId: number) {
	const resumes = getDb()
		.resumes.filter((resume) => resume.user_id === userId)
		.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
		.map(toResumeCard);
	return { ok: true as const, data: resumes };
}

export function getResume(userId: number, resumeId: number) {
	const resume = getDb().resumes.find(
		(item) => item.id === resumeId && item.user_id === userId,
	);
	if (!resume) return fail(404, "رزومه پیدا نشد.");
	return { ok: true as const, data: toResumeCard(resume) };
}

export function createResume(
	userId: number,
	form: { title: string; content: string },
) {
	const db = getDb();
	const now = new Date().toISOString();
	const resume: MockResume = {
		id: nextId(db, "resume"),
		user_id: userId,
		title: form.title.trim(),
		content: form.content.trim(),
		created_at: now,
		updated_at: now,
	};
	db.resumes.unshift(resume);
	persist();
	return { ok: true as const, data: null };
}

export function updateResume(
	userId: number,
	resumeId: number,
	form: { title: string; content: string },
) {
	const resume = getDb().resumes.find(
		(item) => item.id === resumeId && item.user_id === userId,
	);
	if (!resume) return fail(404, "رزومه پیدا نشد.");
	resume.title = form.title.trim();
	resume.content = form.content.trim();
	resume.updated_at = new Date().toISOString();
	persist();
	return { ok: true as const, data: null };
}

export function deleteResume(userId: number, resumeId: number) {
	const db = getDb();
	const resume = db.resumes.find(
		(item) => item.id === resumeId && item.user_id === userId,
	);
	if (!resume) return fail(404, "رزومه پیدا نشد.");
	db.resumes = db.resumes.filter((item) => item.id !== resumeId);
	persist();
	return { ok: true as const, data: null };
}

function asJob(payload: Partial<Job>): Job | null {
	if (!payload.job_url || !payload.job_title || !payload.company_name) return null;
	return {
		job_title: payload.job_title,
		company_name: payload.company_name,
		match_percent: Number(payload.match_percent ?? 0),
		requirements: Array.isArray(payload.requirements) ? payload.requirements : [],
		job_url: payload.job_url,
		source_site: payload.source_site ?? "",
		company_reviews: payload.company_reviews ?? null,
		paycheck: payload.paycheck ?? null,
	};
}

export function listBookmarks(userId: number) {
	const bookmarks = getDb().bookmarks[String(userId)] ?? [];
	return { ok: true as const, data: { bookmarks } };
}

export function toggleBookmark(userId: number, payload: Partial<Job>) {
	const job = asJob(payload);
	if (!job) return fail(400, "اطلاعات شغل ناقص است.");

	const db = getDb();
	const key = String(userId);
	const current = db.bookmarks[key] ?? [];
	const exists = current.some((item) => item.job_url === job.job_url);
	db.bookmarks[key] = exists
		? current.filter((item) => item.job_url !== job.job_url)
		: [job, ...current];
	persist();
	return {
		ok: true as const,
		data: { bookmarked: !exists, job_url: job.job_url },
	};
}

export function adminStats() {
	const db = getDb();
	const messageCount = db.chats.reduce(
		(total, chat) => total + chat.messages.length,
		0,
	);
	return {
		ok: true as const,
		data: {
			total_users: db.users.length,
			total_jobs: db.jobs.length,
			total_chats: db.extraChats + db.chats.length,
			total_messages: db.extraMessages + messageCount,
		},
	};
}

function paginate<T>(items: T[], page: number, perPage: number) {
	const pages = Math.max(1, Math.ceil(items.length / perPage));
	const safePage = Math.min(page, pages);
	const start = (safePage - 1) * perPage;
	return {
		items: items.slice(start, start + perPage),
		total: items.length,
		page: safePage,
		pages,
	};
}

export function searchUsers(query: string, page: number, perPage: number) {
	const needle = normalize(query);
	const users = getDb()
		.users.filter((user) => {
			if (!needle) return true;
			return (
				normalize(user.username).includes(needle) ||
				normalize(user.email ?? "").includes(needle)
			);
		})
		.map((user) => ({
			user_id: user.user_id,
			username: user.username,
			email: user.email,
			phone_number: user.phone_number,
			role: user.role,
			created_at: user.created_at,
			updated_at: user.updated_at ?? user.created_at,
		}));

	const result = paginate(users, page, perPage);
	return {
		ok: true as const,
		data: {
			users: result.items,
			total: result.total,
			page: result.page,
			pages: result.pages,
		},
	};
}

export function deleteAdminUser(userId: number) {
	const db = getDb();
	const user = db.users.find((item) => item.user_id === userId);
	if (!user) return fail(404, "کاربر پیدا نشد.");
	deleteAccount(userId);
	return { ok: true as const, data: null };
}

function jobSearchText(job: MockAdminJob) {
	return normalize(
		[
			job.job_title,
			job.company_name,
			job.location,
			job.source_site,
			job.paycheck,
			job.raw_text,
			...(job.requirements ?? []),
		]
			.filter(Boolean)
			.join(" "),
	);
}

export function searchJobs(query: string, page: number, perPage: number) {
	const needle = normalize(query);
	const jobs = getDb().jobs.filter((job) => {
		if (!needle) return true;
		return jobSearchText(job).includes(needle);
	});
	const result = paginate(jobs, page, perPage);
	return {
		ok: true as const,
		data: {
			jobs: result.items,
			total: result.total,
			page: result.page,
			pages: result.pages,
		},
	};
}

export function getAdminJob(jobId: number) {
	const job = getDb().jobs.find((item) => item.job_id === jobId);
	if (!job) return fail(404, "شغل پیدا نشد.");
	return { ok: true as const, data: job };
}

export function updateAdminJob(
	jobId: number,
	payload: Partial<MockAdminJob>,
) {
	const job = getDb().jobs.find((item) => item.job_id === jobId);
	if (!job) return fail(404, "شغل پیدا نشد.");

	if (payload.job_title !== undefined) job.job_title = payload.job_title;
	if (payload.company_name !== undefined) job.company_name = payload.company_name;
	if (payload.location !== undefined) job.location = payload.location;
	if (payload.paycheck !== undefined) job.paycheck = payload.paycheck;
	if (payload.source_site !== undefined) job.source_site = payload.source_site;
	if (payload.raw_text !== undefined) job.raw_text = payload.raw_text;
	if (payload.requirements !== undefined) job.requirements = payload.requirements;

	persist();
	return { ok: true as const, data: job };
}

export function deleteAdminJob(jobId: number) {
	const db = getDb();
	const job = db.jobs.find((item) => item.job_id === jobId);
	if (!job) return fail(404, "شغل پیدا نشد.");
	db.jobs = db.jobs.filter((item) => item.job_id !== jobId);
	persist();
	return { ok: true as const, data: null };
}
