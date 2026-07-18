import { Mail, BookOpen, GraduationCap } from "lucide-react";

export default function ContactUs() {
	return (
		<div className="flex items-center justify-center h-full px-4 py-10">
			<div className="w-full max-w-3xl rounded-3xl border border-border bg-background p-8 shadow-lg shadow-border flex flex-col gap-8">
				<div className="flex items-center gap-5 text-primary-action">
					<BookOpen className="size-6" />
					<div className="flex flex-col items-start gap-3">
						<p className="text-3xl font-bold">تماس و اطلاعات پروژه</p>
						<p className="text-sm text-text-muted">این پروژه دانشگاهی زیر نظر دکتر جلالی انجام شده است.</p>
					</div>
				</div>

				<div className="grid gap-6 sm:grid-cols-2">
					<div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<Mail className="size-5 text-primary-action" />
							<div>
								<p className="font-semibold text-primary-text">ایمیل‌ها</p>
								<p className="text-sm text-text-muted">پشتیبانی و سوالات</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 text-primary-text text-sm">
							<p>moh3nmahmoudi82@gmail.com</p>
							<p>mohammad@fmail.com</p>
						</div>
					</div>

					<div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
						<div className="flex items-center gap-3">
							{/* <Github className="size-5 text-primary-action" /> */}
							<div>
								<p className="font-semibold text-primary-text">گیت‌هاب</p>
								<p className="text-sm text-text-muted">کد پروژه و مخزن عمومی</p>
							</div>
						</div>
						<a
							href="https://github.com/your-org/your-repo"
							target="_blank"
							rel="noreferrer"
							className="text-sm font-semibold text-accent hover:underline">
							github.com/your-org/your-repo
						</a>
					</div>
				</div>

				<div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<GraduationCap className="size-5 text-primary-action" />
						<div>
							<p className="font-semibold text-primary-text">مشخصات پروژه</p>
							<p className="text-sm text-text-muted">پروژه‌ای دانشگاهی در دوره کارشناسی</p>
						</div>
					</div>
					<p className="text-sm text-primary-text leading-7">
						این پروژه به عنوان یک کار دانشگاهی زیر نظر دکتر جلالی طراحی و پیاده‌سازی شده است. هدف ایجاد یک سامانه هوشمند برای کمک به کاریابی و رزومه‌‌سازی کاربران بود.
					</p>
				</div>
			</div>
		</div>
	);
}
