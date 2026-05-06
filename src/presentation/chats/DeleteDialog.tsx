import { useRef } from "react";
import Dialog from "../components/shared/Dialog";
import BinIcon from "../../assets/icons/BinIcon";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { chatAPI } from "../../services/chat";
import LoadingIcon from "../../assets/icons/LoadingIcon";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteDialog({ id }: { id: number }) {
	const { mutate, isPending } = useCustomMutation(chatAPI.deleteChat);
	const queryClient = useQueryClient();
	const cancelButton = useRef(null);

	function handleDelete() {
		mutate(id, {
			onSuccess: () => {
				console.log("Deleted: ", id);
				if (cancelButton.current) {
					const btn = cancelButton.current as HTMLButtonElement;
					btn.click();
				}

				queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
			},
			onError: (err) => alert(err.message),
		});
	}

	return (
		<Dialog
			trigger={
				<div
					className="border-2 border-primary-red rounded-full hover:bg-primary-red transition-all duration-100 p-0.5 size-7 cursor-pointer
					hover:*:[&>g>path]:stroke-white">
					<BinIcon className="size-full [&>g>path]:stroke-primary-red" />
				</div>
			}
			id="delete-dialog"
			title="Are you sure?"
			footer={
				<>
					<button
						onClick={handleDelete}
						className={`py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
							hover:bg-primary-red hover:text-white transition-all duration-150 w-20 flex items-center justify-center
							${isPending ? "pointer-events-none" : ""}`}>
						{isPending ? <LoadingIcon color="primary-red" /> : "Delete"}
					</button>
					<button
						ref={cancelButton}
						popoverTarget="delete-dialog"
						popoverTargetAction="hide"
						className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
              hover:bg-primary-action hover:text-white transition-all duration-150">
						Cancel
					</button>
				</>
			}>
			<p className="text-primary-action">
				This chat <span className="font-semibold">can not</span> be restored
				once deleted
			</p>
		</Dialog>
	);
}
