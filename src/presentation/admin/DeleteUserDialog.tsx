import { useRef } from "react";
import Dialog from "../components/shared/Dialog";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { adminAPI } from "../../services/admin";
import { LoaderCircle, X } from "lucide-react";

interface DeleteUserDialogProps {
	id: number;
	username: string;
	onDeleted: () => void;
}

export default function DeleteUserDialog({
	id,
	username,
	onDeleted,
}: DeleteUserDialogProps) {
	const { mutate, isPending } = useCustomMutation(adminAPI.deleteUser, {
		onSuccess: () => {
			if (cancelButton.current) {
				(cancelButton.current as HTMLButtonElement).click();
			}
			onDeleted();
		}
	});
	const cancelButton = useRef(null);

	function handleDelete() {
		mutate(id);
	}

	return (
		<Dialog
			trigger={
				<div
					className="border-2 border-primary-red rounded-full hover:bg-primary-red transition-all duration-100 p-0.5 size-7 cursor-pointer
					hover:*:text-white">
					<X className="size-full text-primary-red" />
				</div>
			}
			title="Are you sure?"
			footer={
				<button
					onClick={handleDelete}
					className={`py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
						hover:bg-primary-red hover:text-white transition-all duration-150 w-20 flex items-center justify-center
						${isPending ? "pointer-events-none" : ""}`}>
					{isPending ? (
						<LoaderCircle className="text-primary-red animate-spin" />
					) : (
						"Delete"
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
			<p className="text-primary-action">
				Deleting user <span className="font-semibold">{username}</span> will{" "}
				<span className="font-semibold">permanently</span> remove all their
				data.
			</p>
		</Dialog>
	);
}
