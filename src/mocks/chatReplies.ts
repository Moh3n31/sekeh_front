import type { Job } from "@/features/chat/api/chatApi";
import {
	BACKEND_RESUME_MARKER,
	FRONTEND_RESUME_MARKER,
	pickJobs,
} from "@/mocks/seed";

export interface ChatReply {
	content: string;
	jobs: Job[];
}

const frontendJobs = pickJobs([1, 2, 3]);
const backendJobs = pickJobs([8, 9, 10]);
const remoteJobs = pickJobs([11, 12, 13]);
const interviewJobs = pickJobs([15, 16]);
const salaryJobs = pickJobs([1, 11, 20]);
const isfahanJobs = pickJobs([19, 18]);
const comparisonJobs = pickJobs([1, 2]);
const defaultJobs = pickJobs([16, 12, 20]);

function normalize(value: string) {
	return value
		.toLowerCase()
		.replaceAll("ي", "ی")
		.replaceAll("ك", "ک")
		.replaceAll("\u200c", "");
}

function hasAny(text: string, words: string[]) {
	return words.some((word) => text.includes(normalize(word)));
}

function hello(text: string) {
	return text.includes("محسن") ? "سلام محسن." : "سلام.";
}

function isGreeting(content: string) {
	const trimmed = content.trim();
	return /^(hi|hello|hey|سلام|درود|سلام علیکم)[!?.…\s]*$/iu.test(trimmed);
}

function isIntroFollowUp(content: string) {
	const text = normalize(content);
	return (
		text.includes("wow it's good") ||
		text.includes("wow its good") ||
		text.includes("وای خوبه") ||
		text.includes("واو خوبه") ||
		text.includes("عالیه پس") ||
		text.includes("خوبه پس")
	);
}

function looksLikeBackendResume(text: string, original: string) {
	if (original.includes(BACKEND_RESUME_MARKER)) return true;
	if (original.includes("رزومه بک‌اند")) return true;
	return (
		hasAny(text, ["fastapi", "django", "postgresql", "redis"]) &&
		hasAny(text, ["بکاند", "بک اند", "backend", "پایتون", "python"]) &&
		text.length > 180
	);
}

function looksLikeFrontendResume(text: string, original: string) {
	if (original.includes(FRONTEND_RESUME_MARKER)) return true;
	if (original.includes("رزومه فرانت‌اند") || original.includes("نسخه کوتاه برای جابینجا")) {
		return true;
	}
	return (
		hasAny(text, ["فرانت", "ریاکت", "react", "tailwind"]) &&
		text.length > 180
	);
}

function frontendResumeReply(text: string): ChatReply {
	return {
		content: `${hello(text)}

سابقه‌ات برای موقعیت **فرانت‌اند میانی** در تهران قابل دفاع است. React و TypeScript همان چیزی است که تیم‌های محصول‌محور در آگهی می‌نویسند، و پروژه سکه نشان می‌دهد با یک محصول واقعی درگیر بوده‌ای.

- **دیجی‌کالا** از نظر استک و مقیاس از بقیه نزدیک‌تر است.
- **اسنپ** روی رابط شلوغ و کار تیمی جدی است.
- **کافه‌بازار** کمی پایین‌تر است، چون وزن بیشتری به وب موبایل می‌دهد.

اگر بخواهی، رزومه را برای یکی از این‌ها کوتاه‌تر می‌کنم.`,
		jobs: frontendJobs,
	};
}

function backendResumeReply(text: string): ChatReply {
	return {
		content: `${hello(text)}

با این رزومه، مسیر طبیعی‌ات **بک‌اند میانی** است. Python، FastAPI و Django دقیقاً همان چیزی است که تیم‌های محصول در تهران برای API و داده می‌خواهند، و کار روی سکه نشان می‌دهد با احراز هویت، استریم و ذخیره شغل درگیر بوده‌ای.

- **همراه اول** روی FastAPI و پایداری سرویس حساب کاربری نزدیک‌تر است.
- **ایرانسل** برای Django و کار با PostgreSQL مناسب‌تر است.
- **اسنپ‌فود** اگر بخواهی Node.js و TypeScript را هم در بک‌اند ببینی، گزینه رشد است.

اگر بخواهی، خلاصه این رزومه را برای یکی از این سه تا کوتاه‌تر می‌کنم.`,
		jobs: backendJobs,
	};
}

export function replyFor(content: string): ChatReply {
	const original = content.trim();
	const text = normalize(original);

	if (!text) {
		return {
			content: "پیامت خالی به نظر می‌رسد. یک جمله از سابقه یا شهر مدنظرت بنویس.",
			jobs: [],
		};
	}

	if (isGreeting(original)) {
		return {
			content: `سلام! من **سکه** هستم، سامانه کاریابی هوشمند.

اینجا می‌تونی رزومه‌ات را بفرستی، درباره شغل و مصاحبه بپرسی، یا بگویی دنبال چه نقشی هستی تا چند پیشنهاد مرتبط برات پیدا کنم.

هر وقت آماده بودی، رزومه‌ات را بفرست یا بگو دنبال فرانت‌اند هستی یا بک‌اند.`,
			jobs: [],
		};
	}

	if (isIntroFollowUp(original)) {
		return {
			content: `سؤال خوبیه. برای رزومه، این بخش‌ها معمولاً کافی‌اند و لازم نیست شلوغش کنی:

- **خلاصه کوتاه** در سه چهار خط: نقش مدنظرت، سابقه تقریبی، و یک نتیجه مشخص از کار قبلی
- **مهارت‌ها** فقط همان‌هایی که واقعاً باهاشون کار کرده‌ای، نه یک فهرست بلند
- **تجربه کاری** با فعل و نتیجه؛ مثلاً چی ساختی، چی بهتر شد، یا چه مشکلی را حل کردی
- **یک یا دو پروژه** که لینک یا توضیح کوتاه داشته باشند
- **تحصیلات** مختصر؛ فقط مدرک و پروژه پایانی اگر مرتبط است

از عنوان شغلی مبهم، توضیح کلی بدون عدد یا نتیجه، و تکرار مهارت در چند بخش مختلف پرهیز کن. اگر بخوای، متن فعلی رزومه‌ات را بفرست تا بگویم کدام قسمت را قوی‌تر یا کوتاه‌تر کنی.`,
			jobs: [],
		};
	}

	if (looksLikeBackendResume(text, original)) {
		return backendResumeReply(text);
	}

	if (looksLikeFrontendResume(text, original)) {
		return frontendResumeReply(text);
	}

	if (hasAny(text, ["دیزاین سیستم", "کامپوننت مشترک", "کامپوننت‌های مشترک"])) {
		return {
			content: `${hello(text)}

کامپوننت مشترک را وقتی جدا کن که حداقل دو صفحه همان رفتار را لازم داشته باشند. برای دکمه، ورودی و کارت شغل یک API کوچک با حالت‌های مختلف کافی است و رنگ را از توکن بگیر.

کارت پیشنهاد شغل مثال روشنی است: عنوان، شرکت، درصد تطابق و دکمه‌ها یک‌بار نوشته می‌شوند و هم در چت و هم در ذخیره‌ها استفاده می‌شوند.`,
			jobs: [],
		};
	}

	if (hasAny(text, ["کوتاه", "بازنویس", "جابینجا"])) {
		return {
			content: `${hello(text)}

خلاصه را در چهار خط نگه دار و پایینش فقط نتیجه‌ها را بیاور.

**خلاصه پیشنهادی**

توسعه‌دهنده فرانت‌اند با حدود سه سال تجربه React و TypeScript. در پروژه سکه گفتگوی شغلی، رزومه و کارت پیشنهاد را پیاده کردم. دنبال نقش میانی در تیم محصول.

مهارت‌ها را در یک خط بنویس و توضیح دانشگاه را به پروژه پایانی محدود کن.`,
			jobs: [],
		};
	}

	if (hasAny(text, ["مصاحبه", "interview"])) {
		return {
			content: `${hello(text)}

برای مصاحبه فرانت‌اند میانی معمولاً از state و props، یک فرم با خطا و حالت بارگذاری، و یک درخواست API شروع می‌کنند. اگر وقتت کم است، یک کارت شغل با دکمه ذخیره را از صفر بنویس و حالت در حال ارسال را هم نشان بده.

این دو موقعیت مصاحبه فنی مشابهی دارند.`,
			jobs: interviewJobs,
		};
	}

	if (hasAny(text, ["دورکار", "دورکاری", "ریموت", "remote"])) {
		return {
			content: `${hello(text)}

چند تیم محصول نقش فرانت‌اند را واقعاً دورکار بسته‌اند. برای این مدل کار، نمونه کار قابل دیدن مهم‌تر از حضور در دفتر است. این سه مورد شهر را محدود نکرده‌اند و با کار React جور درمی‌آیند.`,
			jobs: remoteJobs,
		};
	}

	if (hasAny(text, ["اصفهان", "جونیور", "تازه کار", "تازه‌کار"])) {
		return {
			content: `${hello(text)}

با حدود سه سال سابقه، عنوان جونیور برایت پایین است و بازار میانی بیرون از تهران نازک‌تر است. اگر جابه‌جایی جدی است، دورکاری با تیم تهران معمولاً انتخاب بهتری است. این دو آگهی را برای مقایسه سطح و حقوق گذاشتم.`,
			jobs: isfahanJobs,
		};
	}

	if (hasAny(text, ["کدام", "کدوم", "نزدیکتر", "نزدیک تر"])) {
		return {
			content: `${hello(text)}

بین گزینه‌های محصول‌محور، **دیجی‌کالا** به کارت نزدیک‌تر است: استک React و TypeScript روشن است و مقیاس ویترین با تجربه پروژه سکه جور درمی‌آید.

**اسنپ** انتخاب رشد است. رابط شلوغ‌تر است و کار تیمی سنگین‌تری می‌خواهد، ولی اگر بخواهی از صفحه ساده فاصله بگیری ارزشش را دارد.

اگر فقط یکی را برای مصاحبه این هفته انتخاب می‌کنی، از دیجی‌کالا شروع کن.`,
			jobs: comparisonJobs,
		};
	}

	if (hasAny(text, ["بکاند", "بک اند", "backend", "django", "پایتون", "python", "node"])) {
		return {
			content: `${hello(text)}

این سه موقعیت بک‌اند به استک‌های رایج تهران نزدیک‌اند. اگر رزومه بک‌اندت را هم بفرستی، پیشنهادها را دقیق‌تر روی FastAPI یا Django تنظیم می‌کنم.`,
			jobs: backendJobs,
		};
	}

	if (hasAny(text, ["حقوق", "دریافتی", "میلیون"])) {
		return {
			content: `${hello(text)}

برای سطح میانی در شرکت‌های محصول‌محور تهران، بازه واقع‌بینانه حدود **۴۰ تا ۶۵ میلیون تومان** خالص در ماه است. تیم‌های جاافتاده معمولاً وسط بازه یا کمی بالاتر می‌ایستند.

این آگهی‌ها حقوق را نسبتاً شفاف نوشته‌اند.`,
			jobs: salaryJobs,
		};
	}

	if (hasAny(text, ["فرانت", "ریاکت", "react", "typescript", "رابط کاربری"])) {
		return frontendResumeReply(text);
	}

	if (text.length > 240) {
		return frontendResumeReply(text);
	}

	return {
		content: `${hello(text)}

اگر هدفت پیدا کردن کار است، یک پاراگراف از سابقه‌ات، شهر مدنظرت و حقوق را بفرست تا پیشنهادها دقیق‌تر شود. تا آن موقع این موقعیت‌ها با پروفایل یک توسعه‌دهنده رابط کاربری در تهران جور درمی‌آیند.`,
		jobs: defaultJobs,
	};
}

export function chunkText(text: string): string[] {
	const parts = text.split(/(\s+)/);
	const chunks: string[] = [];
	let current = "";

	for (const part of parts) {
		current += part;
		if (current.trim().length >= 18 && /\s$/u.test(current)) {
			chunks.push(current);
			current = "";
		}
	}

	if (current) chunks.push(current);
	return chunks.length > 0 ? chunks : [text];
}
