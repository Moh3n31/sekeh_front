import { useRef } from "react";
// import Dialog from "../components/shared/Dialog";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { chatAPI } from "../../services/chat";
import GrowableButton from "../components/shared/GrowableButton";
import { PenBox } from "lucide-react";
// import LoadingIcon from "../../assets/icons/LoadingIcon";

export default function NewChatDialog() {
	const queryClient = useQueryClient();
	const { mutate } = useCustomMutation(chatAPI.newChat, {
		onSuccess: (res) => {
			const { chat } = res.data;

			if (cancelButton.current) {
				const btn = cancelButton.current as HTMLButtonElement;
				btn.click();
			}

			queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
			navigate("/chats/" + chat.chat_id);
		},
	}); //isPending
	const cancelButton = useRef(null);
	const navigate = useNavigate();

	function handleNewChat() {
		mutate();
	}

	return (
		// <Dialog
		// 	trigger={
		<GrowableButton
			fullWidth="33"
			onClick={handleNewChat}
			label="چت جدید"
			icon={
				<PenBox
					strokeWidth={1.5}
					className="w-5 h-5 transition-colors duration-200 text-primary-action group-hover:text-white"
				/>
			}
		/>
		// 	}
		// 	title="Enter A Title"
		// 	footer={
		// 		<button
		// 			type="submit"
		// 			form="new-chat-form"
		// 			className={`w-20 py-1 px-3 border-2 border-accent text-accent rounded-md font-semibold cursor-pointer
		//      hover:bg-accent hover:text-white transition-all duration-150 flex justify-center items-center
		// 			${isPending ? "pointer-events-none" : ""}`}>
		// 			{isPending ? <LoadingIcon color="accent" /> : "Submit"}
		// 		</button>
		// 	}
		// closeButton={
		// 		<button
		// 			ref={cancelButton}
		// 			popoverTarget="new-chat-dialog"
		// 			popoverTargetAction="hide"
		// 			className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
		//      hover:bg-primary-action hover:text-white transition-all duration-150">
		// 			Cancel
		// 		</button>
		// }>
		// 	<form
		// 		id="new-chat-form"
		// 		onSubmit={(e) => {
		// 			e.preventDefault();
		// 			handleNewChat();
		// 		}}
		// 		className="flex flex-col gap-2">
		// 		<label className="text-[16px] text-primary-action">Title</label>
		// 		<input
		// 			className="border-2 border-border rounded-md py-2 px-2 w-80 outline-0"
		// 			placeholder="New Chat..."
		// 			value={formData}
		// 			onChange={(e) => setFormData(e.target.value)}></input>
		// 	</form>
		// </Dialog>
	);
}
