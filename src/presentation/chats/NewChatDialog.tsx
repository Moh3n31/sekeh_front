import { useRef, useState } from "react";
import Dialog from "../components/shared/Dialog";
import { useNavigate } from "react-router";
import NewChatIcon from "../../assets/icons/NewChatIcon";

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
			trigger={
				<div
					className="group flex items-center justify-end h-10 w-10 hover:w-33
					bg-surface hover:bg-primary-action border-2 border-primary-action rounded-full 
					transition-all duration-200 ease-in-out overflow-hidden">
					<div className="flex items-center justify-center gap-2 min-w-max px-2">
						<span
							className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 
							group-hover:pr-2 text-white transition-all duration-200 ease-in-out whitespace-nowrap font-medium">
							New Chat
						</span>
						<NewChatIcon
							className="w-5 h-5 transition-colors duration-200
						[&>g>path]:first:stroke-primary-action [&>g>path]:last:fill-primary-action 
						group-hover:[&>g>path]:first:stroke-white group-hover:[&>g>path]:last:fill-white"
						/>
					</div>
				</div>
			}
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
