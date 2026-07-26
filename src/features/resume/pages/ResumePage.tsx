import { useEffect, useState, type FormEvent } from "react";
import { FileText, LoaderCircle, Pencil, Plus } from "lucide-react";
import ResumeForm from "@/features/resume/components/ResumeForm";
import DeleteDialog from "@/features/resume/components/DeleteResumeDialog";
import { useCustomMutation } from "@/shared/hooks/useCustomMutation";
import { useCustomQuery } from "@/shared/hooks/useCustomQuery";
import { toast } from "@/shared/lib/toast";
import {
	resumeAPI,
	type ResumeFormObject,
	type ResumeItem,
} from "@/features/resume/api/resumeApi";
import { getRequiredError, sanitizeText } from "@/shared/lib/formValidation";
import PageTitle from "@/shared/components/layout/PageTitle";
import { useDialogContext } from "@/app/contexts/useDialogContext";

export default function ResumePage() {
	const [formData, setFormData] = useState<ResumeFormObject>({
		title: "",
		content: "",
	});
	const [editingId, setEditingId] = useState<number | string | null>(null);
	const [errors, setErrors] = useState<{ title?: string; content?: string }>(
		{},
	);
	const { isOpen, closeDialog, openDialog } = useDialogContext();

	const { data, isLoading } = useCustomQuery({
		key: ["resumes"],
		func: resumeAPI.getResumes,
	});
	const resumes = (data?.data ?? []) as ResumeItem[];

	const { data: singleResume, isLoading: isSinglePending } = useCustomQuery({
		key: ["single.resume", editingId],
		func: () => resumeAPI.getResumeById(editingId ?? 0),
		options: { enabled: !!editingId },
	});
	useEffect(() => {
		(() => {
			if (!singleResume) return;
			setFormData({
				title: singleResume.data.title,
				content: singleResume.data.content,
			});
			openDialog();
		})();
	}, [singleResume, openDialog]);

	const createMutation = useCustomMutation(
		resumeAPI.createResume,
		{
			onSuccess: () => {
				toast.success("رزومه جدید با موفقیت ثبت شد.");
				closeDialog();
				setErrors({});
				setFormData({ title: "", content: "" });
			},
		},
		["resumes"],
	);
	const updateMutation = useCustomMutation(
		(vars: { id: number | string; form: ResumeFormObject }) =>
			resumeAPI.updateResume(vars.id, vars.form),
		{
			onSuccess: () => {
				toast.success("رزومه با موفقیت ویرایش شد.");
				setEditingId(null);
				setErrors({});
				setFormData({ title: "", content: "" });
			},
		},
		["resumes"],
	);

	const validate = !!(
		sanitizeText(formData.title) && sanitizeText(formData.content)
	);

	const handleChange = <K extends keyof ResumeFormObject>(
		key: K,
		value: ResumeFormObject[K],
	) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	useEffect(() => {
		const open = () => {
			openDialog();
			setEditingId(null);
			setErrors({});
			setFormData({ title: "", content: "" });
		};
		const close = () => {
			closeDialog();
			setEditingId(null);
			setErrors({});
			setFormData({ title: "", content: "" });
		};

		if (isOpen) open();
		else close();
	}, [isOpen, closeDialog, openDialog]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const payload = {
			title: sanitizeText(formData.title),
			content: sanitizeText(formData.content),
		};
		const nextErrors: { title?: string; content?: string } = {};

		if (!payload.title)
			nextErrors.title = getRequiredError(formData.title, "عنوان");
		if (!payload.content)
			nextErrors.content = getRequiredError(formData.content, "محتوا");
		if (payload.title.length > 80)
			nextErrors.title = "عنوان نباید بیشتر از 80 کاراکتر باشد.";
		if (payload.content.length > 4000)
			nextErrors.content = "محتوا نباید بیشتر از 4000 کاراکتر باشد.";

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) return;

		if (editingId !== null) {
			updateMutation.mutate({ id: editingId, form: payload });
			return;
		}

		createMutation.mutate(payload);
	};

	return (
		<div className="md:p-7 max-md:py-5 max-md:px-6 flex flex-col gap-8 w-full">
			<header className="flex max-md:flex-col max-md:items-start md:items-center justify-between gap-4">
				<PageTitle
					icon={FileText}
					title="رزومه‌ها"
					desc="رزومه‌های ذخیره‌شده خود را مدیریت کنید."
				/>

				<div className="flex flex-wrap gap-2">
					<button
						type="button"
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
										<p className="font-semibold text-primary-text">
											{resume.title}
										</p>
										<p className="text-sm text-text-muted mt-1 line-clamp-3">
											{resume.content}
										</p>
									</div>
								</div>

								<div className="flex flex-wrap gap-2">
									<button
										type="button"
										onClick={() => setEditingId(resume.id)}
										className="flex items-center gap-1 px-3 h-9 rounded-full border border-border cursor-pointer">
										{!isSinglePending ? (
											<>
												<Pencil className="size-4" />
												<p>ویرایش</p>
											</>
										) : (
											<LoaderCircle className="size-5 animate-spin" />
										)}
									</button>
									<DeleteDialog id={resume.id} />
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			<ResumeForm
				open={isOpen}
				onClose={closeDialog}
				editingId={editingId}
				formData={formData}
				onChange={handleChange}
				onSubmit={handleSubmit}
				validate={validate}
				isPending={createMutation.isPending || updateMutation.isPending}
				errors={errors}
			/>
		</div>
	);
}
