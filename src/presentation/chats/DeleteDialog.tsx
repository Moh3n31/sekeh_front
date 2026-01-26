import { useRef } from "react";
import Dialog from "../components/shared/Dialog";

export default function DeleteDialog({ id }: { id: string }) {
	const cancelButton = useRef(null);

	function handleDelete() {
		console.log("Deleted: ", id);
		if (cancelButton.current) {
			const btn = cancelButton.current as HTMLButtonElement;
			btn.click();
		}
	}

	return (
		<Dialog
			id="delete-dialog"
			title="Are you sure?"
			footer={
				<>
					<button
						onClick={handleDelete}
						className="py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
							hover:bg-primary-red hover:text-white transition-all duration-150">
						Delete
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
