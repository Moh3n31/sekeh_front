import { useState, type FormEvent } from "react";
import {
	FileText,
	LoaderCircle,
	MessageSquarePlus,
	Pencil,
	Plus,
	SendHorizonal,
	Trash2,
} from "lucide-react";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { useCustomQuery } from "../components/hooks/useCostumQuery";
import { toast } from "../../services/toast";
import { resumeAPI, type ResumeForm, type ResumeItem } from "../../services/resume";

export default function Resume() {
	const [formData, setFormData] = useState<ResumeForm>({
		title: "",
		content: "",
	});
	const [editingId, setEditingId] = useState<number | string | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);

	const { data, isLoading } = useCustomQuery({
		key: ["resumes"],
		func: resumeAPI.getResumes,
	});
	const resumes = (data?.data ?? []) as ResumeItem[];

	const createMutation = useCustomMutation(resumeAPI.createResume, ["resumes"]);
	const updateMutation = useCustomMutation(
		(vars: { id: number | string; form: ResumeForm }) =>
			resumeAPI.updateResume(vars.id, vars.form),
		["resumes"],
	);
	const deleteMutation = useCustomMutation(resumeAPI.deleteResume, ["resumes"]);

	const validate = !!(formData.title.trim() && formData.content.trim());

	const handleChange = <K extends keyof ResumeForm>(
		key: K,
		value: ResumeForm[K],
	) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const openNewForm = () => {
		setEditingId(null);
		setFormData({ title: "", content: "" });
		setIsFormOpen(true);
	};

	const handleEdit = async (resume: ResumeItem) => {
		try {
			const response = await resumeAPI.getResumeById(resume.id);
			setEditingId(resume.id);
			setFormData({
				title: response.data.title,
				content: response.data.content,
			});
			setIsFormOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const payload = {
			title: formData.title.trim(),
			content: formData.content.trim(),
		};

		if (!payload.title || !payload.content) {
			toast.error("عنوان و متن رزومه را کامل وارد کنید.");
			return;
		}

		if (editingId !== null) {
			updateMutation.mutate(
				{ id: editingId, form: payload },
				{
					onSuccess: () => {
						toast.success("رزومه با موفقیت ویرایش شد.");
						setIsFormOpen(false);
						setEditingId(null);
						setFormData({ title: "", content: "" });
					},
					onError: (err: Error) => toast.error(err.message),
				},
			);
			return;
		}

		createMutation.mutate(payload, {
			onSuccess: () => {
				toast.success("رزومه جدید با موفقیت ثبت شد.");
				setIsFormOpen(false);
				setFormData({ title: "", content: "" });
			},
			onError: (err: Error) => toast.error(err.message),
		});
	};

	const handleDelete = (id: number | string) => {
		if (!window.confirm("این رزومه حذف شود؟")) return;

		deleteMutation.mutate(id, {
			onSuccess: () => toast.success("رزومه حذف شد."),
			onError: (err: Error) => toast.error(err.message),
		});
	};

	const handlePasteToChat = (resume: ResumeItem) => {
		window.dispatchEvent(
			new CustomEvent<{ resumeContent: string }>("resume:paste-to-chat", {
				detail: { resumeContent: resume.content },
			}),
		);
		toast.success("رزومه به چت اضافه شد.");
	};

	return (
		<div className="md:p-7 max-md:py-5 max-md:px-6 flex flex-col gap-8 w-full">
			<header className="flex max-md:flex-col max-md:items-start md:items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center rounded-full size-12 bg-linear-30 from-accent-hover to-match">
						<FileText className="size-6 text-background" />
					</div>
					<div className="flex flex-col gap-1">
						<p className="font-semibold text-2xl text-primary-text">رزومه‌ها</p>
						<p className="text-text-muted">
							رزومه‌های ذخیره‌شده خود را مدیریت کنید.
						</p>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={openNewForm}
						className="flex items-center gap-2 px-4 h-10 rounded-full bg-primary-action text-white font-semibold cursor-pointer">
						<Plus className="size-4" />
						<span>افزودن رزومه</span>
					</button>
				</div>
			</header>

			<section className="flex flex-col gap-4">
				{isLoading ? (
					<div className="flex items-center justify-center py-10">
						<LoaderCircle className="size-6 animate-spin text-accent" />
					</div>
				) : resumes.length === 0 ? (
					<div className="rounded-lg border border-dashed border-border p-8 text-center text-text-muted">
						هنوز رزومه‌ای ذخیره نشده است.
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{resumes.map((resume) => (
							<div
								key={resume.id}
								className="border border-border rounded-lg p-4 flex flex-col gap-3 bg-background">
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="font-semibold text-primary-text">{resume.title}</p>
										<p className="text-sm text-text-muted mt-1 line-clamp-3">
											{resume.content}
										</p>
									</div>
								</div>

								<div className="flex flex-wrap gap-2">
									<button
										type="button"
										onClick={() => handlePasteToChat(resume)}
										className="flex items-center gap-1 px-3 h-9 rounded-full bg-accent text-white cursor-pointer">
										<MessageSquarePlus className="size-4" />
										<p>چسباندن در چت</p>
									</button>
									<button
										type="button"
										onClick={() => handleEdit(resume)}
										className="flex items-center gap-1 px-3 h-9 rounded-full border border-border cursor-pointer">
										<Pencil className="size-4" />
										<p>ویرایش</p>
									</button>
									<button
										type="button"
										onClick={() => handleDelete(resume.id)}
										className="flex items-center gap-1 px-3 h-9 rounded-full border border-red-400 text-red-500 cursor-pointer">
										<Trash2 className="size-4" />
										<p>حذف</p>
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			{isFormOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-accent/10 p-4">
					<div className="w-full max-w-2xl rounded-lg border border-border bg-background p-5 shadow-2xl">
						<div className="flex items-center justify-between gap-3 mb-5">
							<div>
								<p className="font-semibold text-xl text-primary-text">
									{editingId ? "ویرایش رزومه" : "رزومه جدید"}
								</p>
								<p className="text-sm text-text-muted">
									اطلاعات رزومه را وارد کنید.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsFormOpen(false)}
								className="text-2xl text-text-muted cursor-pointer">
								&times;
							</button>
						</div>

						<form onSubmit={handleSubmit} className="flex flex-col gap-6">
							<div className="flex flex-col gap-2">
								<label className="font-semibold text-primary-text">عنوان</label>
								<input
									value={formData.title}
									onChange={(e) => handleChange("title", e.target.value)}
									placeholder="مثلاً تجربه شغلی یا مدرک"
									className="px-2 border-2 border-border rounded-md h-10 placeholder:text-text-muted text-[16px]
										outline-0 focus:border-accent transition-all duration-150"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label className="font-semibold text-primary-text">محتوا</label>
								<textarea
									value={formData.content}
									onChange={(e) => handleChange("content", e.target.value)}
									rows={8}
									placeholder="توضیحات رزومه خود را اینجا بنویسید..."
									className="px-2 py-2 border-2 border-border rounded-md placeholder:text-text-muted text-[16px]
										outline-0 focus:border-accent transition-all duration-150 resize-y"
								/>
							</div>

							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={() => setIsFormOpen(false)}
									className="px-4 h-10 rounded-full border border-border cursor-pointer">
									لغو
								</button>
								<button
									type="submit"
									disabled={!validate || createMutation.isPending || updateMutation.isPending}
									className={`px-5 h-10 rounded-full bg-primary-action text-white cursor-pointer font-semibold
										flex items-center justify-center gap-2 disabled:pointer-events-none disabled:opacity-40`}>
									{createMutation.isPending || updateMutation.isPending ? (
										<LoaderCircle className="size-4 animate-spin" />
									) : (
										<SendHorizonal className="size-4" />
									)}
									<span>{editingId ? "ذخیره تغییرات" : "ثبت رزومه"}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
