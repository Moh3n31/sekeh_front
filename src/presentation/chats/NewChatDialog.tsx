import { useRef, useState } from "react";
import Dialog from "../components/shared/Dialog";
import { useNavigate } from "react-router";

export default function NewChatDialog() {
	const [formData, setFormData] = useState<string>("");
	const cancelButton = useRef(null);
	const navigate = useNavigate();

	function handleNewChat() {
		console.log("Added a new chat: ", formData ?? "New Chat");
		if (cancelButton.current) {
			const btn = cancelButton.current as HTMLButtonElement;
			btn.click();
		}
		const response = { id: "something" };
		navigate(response.id);
	}

	return (
		<Dialog
			id="new-chat-dialog"
			title="Enter A Title"
			footer={
				<>
					<button
						type="submit"
						form="new-chat-form"
						className="py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
              hover:bg-accent hover:text-white transition-all duration-150">
						Submit
					</button>
					<button
						ref={cancelButton}
						popoverTarget="new-chat-dialog"
						popoverTargetAction="hide"
						className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
              hover:bg-primary-action hover:text-white transition-all duration-150">
						Cancel
					</button>
				</>
			}>
			<form
				id="new-chat-form"
				onSubmit={(e) => {
					e.preventDefault();
					handleNewChat();
				}}
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
