import { useRef, useState } from "react";
import Dialog from "../components/shared/Dialog";
import useToast from "../components/hooks/useToast";

export default function EditDialog({ id }: { id: string }) {
	const [formData, setFormData] = useState<string>("");
	const cancelButton = useRef(null);
	const popToast = useToast();

	function handleEdit() {
		const payload = { id: id, title: formData };
		console.log("Edited: ", payload);

		popToast({ id: "1", message: "message", type: "success" });

		if (cancelButton.current) {
			const btn = cancelButton.current as HTMLButtonElement;
			btn.click();
		}
	}

	return (
		<Dialog
			id="edit-dialog"
			title="Edit Chat Title"
			footer={
				<>
					<button
						type="submit"
						form="edit-chat-form"
						className="py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
              hover:bg-accent hover:text-white transition-all duration-150">
						Submit
					</button>
					<button
						ref={cancelButton}
						popoverTarget="edit-dialog"
						popoverTargetAction="hide"
						className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
              hover:bg-primary-action hover:text-white transition-all duration-150">
						Cancel
					</button>
				</>
			}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleEdit();
				}}
				id="edit-chat-form"
				className="flex flex-col gap-2">
				<label className="text-[16px] text-primary-action">Title</label>
				<input
					className="border-2 border-border rounded-md py-2 px-2 w-80 outline-0"
					placeholder="New Chat..."
					value={formData}
					onChange={(e) => setFormData(e.target.value)}></input>
			</form>
		</Dialog>
	);
}
