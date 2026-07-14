import { BanIcon, HeartCrack } from "lucide-react";
import { authAPI } from "../../services/authentication";
import { removeTokens } from "../../utils/authTokens";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import Dialog from "../components/shared/Dialog";

export default function DeleteAcountDialog() {
	const { deleteProfile } = authAPI;
	const { mutate } = useCustomMutation(deleteProfile);

	function handleDeleteAcount() {
		mutate(null, {
			onSuccess: removeTokens,
			onError: (err) => alert(err.message),
		});
	}

	return (
		<Dialog
			trigger={
				<div className="flex gap-2 cursor-pointer items-center bg-primary-red py-1.5 px-3 rounded-full">
					<BanIcon
						strokeWidth={1.5}
						className="size-5 transition-colors duration-200 text-white"
					/>
					<span className="align-middle text-white pb-2">حذف حساب</span>
				</div>
			}
			title="حذف حساب کاربری"
			footer={
				<button
					onClick={handleDeleteAcount}
					className="group py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
						hover:bg-primary-red hover:text-white transition-all duration-150 flex gap-2 items-center">
					<span>حذف</span>
					<HeartCrack
						strokeWidth={1.5}
						className="size-5 text-primary-red group-hover:text-white transition-all duration-150"
					/>
				</button>
			}
			closeButton={
				<button
					className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
              hover:bg-primary-action hover:text-white transition-all duration-150">
					بازگشت
				</button>
			}>
			<p className="text-primary-action">
				حذف حساب کاربری یک عملیات{" "}
				<span className="font-semibold">بدون برگشت</span> است و در صورت تایید
				تمامی اطلاعات شما <span className="font-semibold">حذف خواهند شد</span>.
			</p>
		</Dialog>
	);
}
