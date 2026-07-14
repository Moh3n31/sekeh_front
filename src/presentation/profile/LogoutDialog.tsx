import Dialog from "../components/shared/Dialog";
import { useCustomMutation } from "../components/hooks/useCostumMutation";
import { authAPI } from "../../services/authentication";
import type { Exceptions } from "../../services/api";
import { removeTokens } from "../../utils/authTokens";
import { useNavigate } from "react-router";
import { DoorOpen, LoaderCircle } from "lucide-react";

export default function LogoutDialog() {
	const { mutate, isPending } = useCustomMutation(authAPI.logout);
	const navigate = useNavigate();

	function handleLogout() {
		mutate({
			onSuccess: () => {
				removeTokens();
				navigate("/auth/login");
			},
			onError: (err: Exceptions) => alert(err.error),
		});
	}

	return (
		<Dialog
			triggerClass="w-full"
			trigger={
				<div
					className="group cursor-pointer py-1 px-3 rounded-lg flex gap-7 items-center w-full
					hover:bg-primary-action border-2 border-primary-action transition-all duration-150
					max-md:bg-primary-action">
					<DoorOpen
						strokeWidth={1.5}
						className="size-5 group-hover:text-background text-primary-action max-md:text-background"
					/>
					<p className="font-semibold group-hover:text-background text-primary-action max-md:text-background text-[14px]">
						<span className="max-md:hidden">خروج از حساب</span>
						<span className="md:hidden">خروج</span>
					</p>
				</div>
			}
			title="خروج از حساب کاربری"
			footer={
				<button
					onClick={handleLogout}
					className={`group py-1 px-3 border-2 border-primary-red text-primary-red rounded-md font-semibold cursor-pointer
						hover:bg-primary-red hover:text-white transition-all duration-150 w-25 flex items-center justify-center
						${isPending ? "pointer-events-none" : ""}`}>
					{isPending ? <LoaderCircle color="primary-red" /> : "خروج"}
				</button>
			}
			closeButton={
				<button
					className="py-1 px-3 border-2 border-primary-action text-primary-action rounded-md font-semibold cursor-pointer
              hover:bg-primary-action hover:text-white transition-all duration-150">
					بازگشت
				</button>
			}>
			<div>
				<p>
					با خارج شدن از حساب کاربری، به صفحه لاگین هدایت می‌شوید و برای استفاده
					مجدد از سایت باید وارد حساب کاربری خود شوید.
				</p>
			</div>
		</Dialog>
	);
}
