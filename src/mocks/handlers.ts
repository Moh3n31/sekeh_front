import { delay, http, HttpResponse } from "msw";
import { chunkText, replyFor } from "@/mocks/chatReplies";
import {
	adminStats,
	appendExchange,
	changePassword,
	createChat,
	createResume,
	deleteAccount,
	deleteAdminJob,
	deleteAdminUser,
	deleteChat,
	deleteResume,
	getAdminJob,
	getResume,
	getThread,
	listBookmarks,
	listChats,
	listResumes,
	login,
	logout,
	publicUser,
	refreshSession,
	register,
	renameChat,
	searchJobs,
	searchUsers,
	toggleBookmark,
	updateAdminJob,
	updateProfile,
	updateResume,
	userFromAuthorization,
} from "@/mocks/db";
import type { MockResult, MockUser } from "@/mocks/types";

function ok<T>(data: T, message = "عملیات با موفقیت انجام شد.", status: 200 | 201 = 200) {
	return HttpResponse.json(
		{ status: String(status), message, data },
		{ status },
	);
}

function fail(status: 400 | 401 | 403 | 404, error: string) {
	return HttpResponse.json(
		{ status: String(status), error, data: null },
		{ status },
	);
}

function fromResult<T>(result: MockResult<T>, message?: string, status: 200 | 201 = 200) {
	if (!result.ok) return fail(result.status, result.error);
	return ok(result.data, message, status);
}

async function pause() {
	await delay(420 + Math.floor(Math.random() * 220));
}

function authorize(request: Request, admin = false): MockUser | Response {
	const user = userFromAuthorization(request.headers.get("Authorization"));
	if (!user) return fail(401, "لطفا وارد حساب کاربری خود شوید.");
	if (admin && user.role !== "admin") {
		return fail(403, "شما به پنل مدیریتی دسترسی ندارید.");
	}
	return user;
}

function isUser(value: MockUser | Response): value is MockUser {
	return !(value instanceof Response);
}

function routeId(value: string | readonly string[] | undefined) {
	const raw = Array.isArray(value) ? value[0] : value;
	return Number(raw);
}

function pageQuery(url: string) {
	const params = new URL(url).searchParams;
	const page = Number(params.get("page") ?? "1");
	const perPage = Number(params.get("per_page") ?? "20");
	return {
		q: params.get("q") ?? "",
		page: Number.isFinite(page) && page > 0 ? page : 1,
		perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : 20,
	};
}

async function readJson<T>(request: Request): Promise<T> {
	return (await request.json()) as T;
}

function wait(ms: number, signal: AbortSignal) {
	return new Promise<void>((resolve, reject) => {
		if (signal.aborted) {
			reject(new DOMException("Aborted", "AbortError"));
			return;
		}

		const timer = setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		}, ms);

		const onAbort = () => {
			clearTimeout(timer);
			reject(new DOMException("Aborted", "AbortError"));
		};

		signal.addEventListener("abort", onAbort, { once: true });
	});
}

function sse(event: string, data: unknown) {
	return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export const handlers = [
	http.post("*/api/auth/login", async ({ request }) => {
		await pause();
		const body = await readJson<{ username?: string; password?: string }>(request);
		return fromResult(login(body.username ?? "", body.password ?? ""), "ورود انجام شد.");
	}),

	http.post("*/api/auth/register", async ({ request }) => {
		await pause();
		const body = await readJson<{ username?: string; password?: string }>(request);
		return fromResult(
			register(body.username ?? "", body.password ?? ""),
			"ثبت‌نام انجام شد.",
			201,
		);
	}),

	http.post("*/api/auth/logout", async ({ request }) => {
		await pause();
		logout(request.headers.get("Authorization"));
		return ok("خروج انجام شد.");
	}),

	http.post("*/api/auth/refresh", async ({ request }) => {
		const tokens = refreshSession(request.headers.get("Authorization"));
		if (!tokens) return fail(401, "نشست شما منقضی شده است.");
		return HttpResponse.json({ data: tokens });
	}),

	http.get("*/api/user/me", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return ok({ user: publicUser(auth) });
	}),

	http.patch("*/api/user/me/password", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		const body = await readJson<{
			current_password?: string;
			new_password?: string;
		}>(request);
		return fromResult(
			changePassword(auth.user_id, body.current_password ?? "", body.new_password ?? ""),
		);
	}),

	http.patch("*/api/user/me", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		const body = await readJson<{
			username?: string;
			email?: string | null;
			phone_number?: string | null;
		}>(request);
		return fromResult(
			updateProfile(auth.user_id, {
				username: body.username ?? "",
				email: body.email ?? null,
				phone_number: body.phone_number ?? null,
			}),
		);
	}),

	http.delete("*/api/user/me", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return fromResult(deleteAccount(auth.user_id));
	}),

	http.get("*/api/chats/:chatId/messages", async ({ request, params }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return fromResult(getThread(auth.user_id, routeId(params.chatId)));
	}),

	http.post("*/api/chats/:chatId/messages", async ({ request, params }) => {
		const auth = authorize(request);
		if (!isUser(auth)) return auth;

		const chatId = routeId(params.chatId);
		const body = await readJson<{ content?: string }>(request);
		const content = (body.content ?? "").trim();
		const reply = replyFor(content);
		const startedAt = Date.now();
		const encoder = new TextEncoder();

		const stream = new ReadableStream({
			async start(controller) {
				const send = (event: string, data: unknown) => {
					controller.enqueue(encoder.encode(sse(event, data)));
				};

				try {
					await wait(680, request.signal);
					for (const delta of chunkText(reply.content)) {
						await wait(38, request.signal);
						send("content", { delta });
					}
					if (reply.jobs.length > 0) {
						await wait(180, request.signal);
						send("jobs", { items: reply.jobs });
					}
					appendExchange(
						auth.user_id,
						chatId,
						content,
						reply.content,
						reply.jobs,
						startedAt,
					);
					send("done", {});
					controller.close();
				} catch {
					controller.close();
				}
			},
		});

		return new HttpResponse(stream, {
			status: 200,
			headers: {
				"Content-Type": "text/event-stream; charset=utf-8",
				"Cache-Control": "no-cache",
			},
		});
	}),

	http.patch("*/api/chats/:chatId/title", async ({ request, params }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		const body = await readJson<{ title?: string }>(request);
		return fromResult(renameChat(auth.user_id, routeId(params.chatId), body.title ?? ""));
	}),

	http.delete("*/api/chats/:chatId", async ({ request, params }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return fromResult(deleteChat(auth.user_id, routeId(params.chatId)));
	}),

	http.get("*/api/chats", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return fromResult(listChats(auth.user_id));
	}),

	http.post("*/api/chats", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return fromResult(createChat(auth.user_id), "گفتگوی جدید ساخته شد.", 201);
	}),

	http.get("*/api/resumes/:resumeId", async ({ request, params }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return fromResult(getResume(auth.user_id, routeId(params.resumeId)));
	}),

	http.put("*/api/resumes/:resumeId", async ({ request, params }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		const body = await readJson<{ title?: string; content?: string }>(request);
		return fromResult(
			updateResume(auth.user_id, routeId(params.resumeId), {
				title: body.title ?? "",
				content: body.content ?? "",
			}),
		);
	}),

	http.delete("*/api/resumes/:resumeId", async ({ request, params }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return fromResult(deleteResume(auth.user_id, routeId(params.resumeId)));
	}),

	http.get("*/api/resumes", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return fromResult(listResumes(auth.user_id));
	}),

	http.post("*/api/resumes", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		const body = await readJson<{ title?: string; content?: string }>(request);
		return fromResult(
			createResume(auth.user_id, {
				title: body.title ?? "",
				content: body.content ?? "",
			}),
			"رزومه ثبت شد.",
			201,
		);
	}),

	http.get("*/api/bookmarks", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		return fromResult(listBookmarks(auth.user_id));
	}),

	http.post("*/api/bookmarks/toggle", async ({ request }) => {
		await pause();
		const auth = authorize(request);
		if (!isUser(auth)) return auth;
		const body = await readJson<Parameters<typeof toggleBookmark>[1]>(request);
		return fromResult(toggleBookmark(auth.user_id, body));
	}),

	http.get("*/api/admin/stats", async ({ request }) => {
		await pause();
		const auth = authorize(request, true);
		if (!isUser(auth)) return auth;
		return fromResult(adminStats());
	}),

	http.get("*/api/admin/users", async ({ request }) => {
		await pause();
		const auth = authorize(request, true);
		if (!isUser(auth)) return auth;
		const query = pageQuery(request.url);
		return fromResult(searchUsers(query.q, query.page, query.perPage));
	}),

	http.delete("*/api/admin/users/:userId", async ({ request, params }) => {
		await pause();
		const auth = authorize(request, true);
		if (!isUser(auth)) return auth;
		return fromResult(deleteAdminUser(routeId(params.userId)));
	}),

	http.get("*/api/admin/jobs/:jobId", async ({ request, params }) => {
		await pause();
		const auth = authorize(request, true);
		if (!isUser(auth)) return auth;
		return fromResult(getAdminJob(routeId(params.jobId)));
	}),

	http.patch("*/api/admin/jobs/:jobId", async ({ request, params }) => {
		await pause();
		const auth = authorize(request, true);
		if (!isUser(auth)) return auth;
		const body = await readJson<{
			job_title?: string;
			company_name?: string;
			location?: string;
			paycheck?: string;
			requirements?: string[];
			raw_text?: string;
			source_site?: string;
		}>(request);
		return fromResult(updateAdminJob(routeId(params.jobId), body));
	}),

	http.delete("*/api/admin/jobs/:jobId", async ({ request, params }) => {
		await pause();
		const auth = authorize(request, true);
		if (!isUser(auth)) return auth;
		return fromResult(deleteAdminJob(routeId(params.jobId)));
	}),

	http.get("*/api/admin/jobs", async ({ request }) => {
		await pause();
		const auth = authorize(request, true);
		if (!isUser(auth)) return auth;
		const query = pageQuery(request.url);
		return fromResult(searchJobs(query.q, query.page, query.perPage));
	}),
];
