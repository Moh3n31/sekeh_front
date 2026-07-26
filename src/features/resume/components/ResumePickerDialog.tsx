import { FileText, LoaderCircle, MessageSquarePlus } from "lucide-react";
import { useCustomQuery } from "@/shared/hooks/useCustomQuery";
import { resumeAPI, type ResumeItem } from "@/features/resume/api/resumeApi";
import Dialog from "@/shared/components/ui/Dialog";
import { useDialogContext } from "@/app/contexts/useDialogContext";

interface ResumeModalProps {
	onSelectResume: (id: number | string) => void;
}

export default function ResumePickerDialog({
	onSelectResume,
}: ResumeModalProps) {
	const dialog = useDialogContext();
	const { data, isLoading } = useCustomQuery({
		key: ["resumes"],
		func: resumeAPI.getResumes,
	});

	const resumes = (data?.data ?? []) as ResumeItem[];

	const handleSelect = (resume: ResumeItem) => {
		onSelectResume(resume.id);
		dialog.closeDialog();
	};

	return (
		<Dialog
			trigger={
				<span
					aria-haspopup="dialog"
					aria-expanded={dialog.isOpen}
					onClick={dialog.openDialog}
					className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-primary-text shadow-sm transition-all duration-150 hover:bg-accent/10 hover:text-accent cursor-pointer">
					<FileText className="size-4" />
				</span>
			}
			title="رزومه‌های من"
			triggerClass="shrink-0"
			footer={<></>}>
			<div className="flex flex-col gap-3 min-w-[280px]">
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<LoaderCircle className="size-6 animate-spin text-accent" />
					</div>
				) : resumes.length === 0 ? (
					<div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-text-muted">
						هنوز رزومه‌ای ذخیره نشده است.
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{resumes.map((resume) => (
							<button
								type="button"
								key={resume.id}
								onClick={() => handleSelect(resume)}
								className="rounded-lg border border-border bg-background p-4 text-right transition-all duration-150 hover:border-accent hover:shadow-sm cursor-pointer">
								<div className="flex items-center gap-2 text-accent">
									<MessageSquarePlus className="size-4" />
									<span className="font-semibold text-primary-text">
										{resume.title}
									</span>
								</div>
								<p className="mt-2 text-sm text-text-muted line-clamp-3">
									{resume.content}
								</p>
							</button>
						))}
					</div>
				)}
			</div>
		</Dialog>
	);
}
