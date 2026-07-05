import BinIcon from "../../assets/icons/BinIcon";
import BrokenHeartIcon from "../../assets/icons/BrokenHeartIcon";
import { authAPI } from "../../services/authentication";
import { removeTokens } from "../../utils/authTokens";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import Dialog from "../components/shared/Dialog";
import GrowableButton from "../components/shared/GrowableButton";

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
				<GrowableButton
					fullWidth="43"
					variant="destructable"
					label="حذف حساب"
					icon={
						<BinIcon
							className="w-5 h-5 transition-colors duration-200
							[&>g>path]:stroke-primary-red group-hover:[&>g>path]:stroke-white"
						/>
					}
				/>
			}
			title="حذف حساب کاربری"
			footer={
				<button
					onClick={handleDeleteAcount}
					className="group py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
						hover:bg-primary-red hover:text-white transition-all duration-150 flex gap-2 items-center">
					<span>حذف</span>
					<BrokenHeartIcon
						className="size-5 [&>g>path]:first:fill-primary-red [&>g>path]:last:stroke-primary-red
						group-hover:[&>g>path]:first:fill-white group-hover:[&>g>path]:last:stroke-white transition-all duration-150"
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
