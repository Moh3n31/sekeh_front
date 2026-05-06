import { useRef, useState } from "react";
import Dialog from "../components/shared/Dialog";
import NewChatIcon from "../../assets/icons/NewChatIcon";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { chatAPI } from "../../services/chat";
import LoadingIcon from "../../assets/icons/LoadingIcon";
import { useQueryClient } from "@tanstack/react-query";

export default function EditDialog({ id }: { id: number }) {
	const { mutate, isPending } = useCustomMutation(chatAPI.editTitle);
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState<string>("");
	const cancelButton = useRef(null);

	function handleEdit() {
		mutate(
			{ chat_id: id, payload: formData },
			{
				onSuccess: () => {
					console.log("Deleted: ", id);
					if (cancelButton.current) {
						const btn = cancelButton.current as HTMLButtonElement;
						btn.click();
					}

					queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
				},
				onError: (err) => alert(err.message),
			},
		);
	}

	return (
		<Dialog
			trigger={
				<div
					className="border-2 border-primary-action rounded-full hover:bg-primary-action transition-all duration-100 p-1 size-7 cursor-pointer
					hover:*:[&>g>path]:first:stroke-white hover:*:[&>g>path]:last:fill-white">
					<NewChatIcon className="size-full [&>g>path]:first:stroke-primary-action [&>g>path]:last:fill-primary-action" />
				</div>
			}
			id="edit-dialog"
			title="Edit Chat Title"
			footer={
				<>
					<button
						type="submit"
						form="edit-chat-form"
						className={`py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
            hover:bg-accent hover:text-white transition-all duration-150 w-20 flex items-center justify-center ${isPending ? "pointer-events-none" : ""}`}>
						{isPending ? (
							<LoadingIcon className={`[&>g>path]:stroke-accent!`} />
						) : (
							"Submit"
						)}
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
