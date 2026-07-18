import { useRef, useState } from "react";
import Dialog from "../components/shared/Dialog";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { chatAPI } from "../../services/chat";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, PenBoxIcon } from "lucide-react";
import { getRequiredError, sanitizeText } from "../../utils/formValidation";

export default function EditDialog({ id }: { id: number }) {
	const { mutate, isPending } = useCustomMutation(chatAPI.editTitle, {
		onSuccess: () => {
			console.log("Deleted: ", id);
			if (cancelButton.current) {
				const btn = cancelButton.current as HTMLButtonElement;
				btn.click();
			}

			queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
		},
	});
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState<string>("");
	const [error, setError] = useState("");
	const cancelButton = useRef(null);

	function handleEdit() {
		const nextError = getRequiredError(formData, "عنوان چت");
		if (nextError) {
			setError(nextError);
			return;
		}

		mutate({ chat_id: id, payload: sanitizeText(formData) });
	}

	return (
		<Dialog
			variant="fullscreen"
			trigger={
				<div
					className="border-2 border-primary-action rounded-full hover:bg-primary-action transition-all duration-100 p-1 size-7 cursor-pointer
				hover:*:text-white">
					<PenBoxIcon
						strokeWidth={1.5}
						className="size-full text-primary-actio"
					/>
				</div>
			}
			title="ویرایش چت"
			footer={
				<button
					type="submit"
					form="edit-chat-form"
					className={`py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
            hover:bg-accent hover:text-white transition-all duration-150 w-20 flex items-center justify-center ${isPending ? "pointer-events-none" : ""}`}>
					{isPending ? (
						<LoaderCircle className={`text-accent! animate-spin`} />
					) : (
						"تایید"
					)}
				</button>
			}
			closeButton={
				<button
					ref={cancelButton}
					className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
          hover:bg-primary-action hover:text-white transition-all duration-150">
					بازگشت
				</button>
			}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleEdit();
				}}
				id="edit-chat-form"
				className="flex flex-col gap-2">
				<label className="text-[16px] text-primary-action">عنوان</label>
				<input
					className={`border-2 rounded-md py-2 px-2 w-80 outline-0 ${error ? "border-red-500" : "border-border"}`}
					placeholder="چت جدید"
					value={formData}
					onChange={(e) => {
						setFormData(e.target.value);
						if (error) setError("");
					}}
				/>
				{error ? <p className="text-sm text-red-500">{error}</p> : null}
			</form>
		</Dialog>
	);
}
