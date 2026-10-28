import type { Job } from "@/features/chat/api/chatApi";
import { pickJobs } from "@/mocks/seed";

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

export function replyFor(content: string): ChatReply {
	const text = normalize(content);

	if (!text) {
		return {
			content: "پیامت خالی به نظر می‌رسد. یک جمله از سابقه یا شهر مدنظرت بنویس.",
			jobs: [],
		};
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

	const mentionsFrontend = hasAny(text, [
		"فرانت",
		"ریاکت",
		"react",
		"typescript",
		"رزومه",
		"رابط کاربری",
	]);

	if (
		!mentionsFrontend &&
		hasAny(text, ["بکاند", "بک اند", "backend", "django", "پایتون", "node"])
	) {
		return {
			content: `${hello(text)}

اگر بخواهی به بک‌اند هم سر بزنی، این سه موقعیت به استک‌های رایج تهران نزدیک‌اند. برای رزومه فعلی‌ات هنوز فرانت‌اند انتخاب طبیعی‌تر است، ولی دیدن سطح آگهی‌های بک‌اند برای مقایسه حقوق مفید است.`,
			jobs: backendJobs,
		};
	}

	if (!mentionsFrontend && hasAny(text, ["حقوق", "دریافتی", "میلیون"])) {
		return {
			content: `${hello(text)}

برای سطح میانی در شرکت‌های محصول‌محور تهران، بازه واقع‌بینانه حدود **۴۰ تا ۶۵ میلیون تومان** خالص در ماه است. تیم‌های جاافتاده معمولاً وسط بازه یا کمی بالاتر می‌ایستند.

این آگهی‌ها حقوق را نسبتاً شفاف نوشته‌اند.`,
			jobs: salaryJobs,
		};
	}

	if (mentionsFrontend || text.length > 240) {
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
