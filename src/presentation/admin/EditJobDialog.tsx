import { useRef, useState } from "react";
import Dialog from "../components/shared/Dialog";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { adminAPI, type AdminJob } from "../../services/admin";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, PenBoxIcon } from "lucide-react";

interface EditJobDialogProps {
	job: AdminJob;
}

function Field({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="flex flex-col gap-1">
			<label className="text-[14px] text-primary-action font-semibold">
				{label}
			</label>
			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="border-2 border-border rounded-md h-9 px-2 outline-0 focus:border-accent transition-all duration-150 text-[14px]"
			/>
		</div>
	);
}

export default function EditJobDialog({ job }: EditJobDialogProps) {
	const queryClient = useQueryClient();
	const cancelButton = useRef(null);

	const [form, setForm] = useState({
		job_title: job.job_title ?? "",
		company_name: job.company_name ?? "",
		location: job.location ?? "",
		paycheck: job.paycheck ?? "",
		source_site: job.source_site ?? "",
		requirements: Array.isArray(job.requirements)
			? job.requirements.join(", ")
			: "",
		raw_text: "",
	});
	const [loadedRawText, setLoadedRawText] = useState(false);

	async function loadFullJob() {
		if (loadedRawText) return;
		const res = await adminAPI.job(job.job_id);
		setForm((prev) => ({ ...prev, raw_text: res.data.raw_text }));
		setLoadedRawText(true);
	}

	const { mutate, isPending } = useCustomMutation(adminAPI.updateJob);

	function handleSubmit() {
		mutate(
			{
				job_id: job.job_id,
				payload: {
					job_title: form.job_title,
					company_name: form.company_name,
					location: form.location,
					paycheck: form.paycheck,
					source_site: form.source_site,
					requirements: form.requirements
						.split(",")
						.map((r) => r.trim())
						.filter(Boolean),
					raw_text: form.raw_text,
				},
			},
			{
				onSuccess: () => {
					if (cancelButton.current) {
						(cancelButton.current as HTMLButtonElement).click();
					}
					queryClient.invalidateQueries({ queryKey: ["adminJobs"] });
				},
				onError: (err) => alert(err.message),
			},
		);
	}

	return (
		<Dialog
			trigger={
				<div
					onClick={loadFullJob}
					className="border-2 border-primary-action rounded-full hover:bg-primary-action transition-all duration-100 p-1 size-7 cursor-pointer
					hover:*:text-white">
					<PenBoxIcon className="size-full text-primary-action" />
				</div>
			}
			title="Edit Job"
			footer={
				<button
					onClick={handleSubmit}
					className={`py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
					hover:bg-accent hover:text-white transition-all duration-150 w-20 flex items-center justify-center
					${isPending ? "pointer-events-none" : ""}`}>
					{isPending ? (
						<LoaderCircle className="text-accent animate-spin" />
					) : (
						"Save"
					)}
				</button>
			}
			closeButton={
				<button
					ref={cancelButton}
					className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
					hover:bg-primary-action hover:text-white transition-all duration-150">
					Cancel
				</button>
			}>
			<div className="flex flex-col gap-3 w-90 max-md:w-full">
				<div className="grid grid-cols-2 gap-3">
					<Field
						label="Title"
						value={form.job_title}
						onChange={(v) => setForm({ ...form, job_title: v })}
					/>
					<Field
						label="Company"
						value={form.company_name}
						onChange={(v) => setForm({ ...form, company_name: v })}
					/>
					<Field
						label="Location"
						value={form.location}
						onChange={(v) => setForm({ ...form, location: v })}
					/>
					<Field
						label="Paycheck"
						value={form.paycheck}
						onChange={(v) => setForm({ ...form, paycheck: v })}
					/>
					<Field
						label="Source"
						value={form.source_site}
						onChange={(v) => setForm({ ...form, source_site: v })}
					/>
				</div>

				<Field
					label="Requirements (comma separated)"
					value={form.requirements}
					onChange={(v) => setForm({ ...form, requirements: v })}
				/>

				<div className="flex flex-col gap-2">
					<label className="text-[14px] text-primary-action font-semibold">
						Raw Text
					</label>
					<textarea
						value={form.raw_text}
						onChange={(e) => setForm({ ...form, raw_text: e.target.value })}
						rows={6}
						className="border-2 border-border rounded-md p-2 outline-0 focus:border-accent transition-all duration-150 text-[14px] resize-none"
					/>
				</div>
			</div>
		</Dialog>
	);
}
