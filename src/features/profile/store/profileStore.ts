import { create } from "zustand";
import type { UserInfo } from "@/features/auth/api/authApi";

interface ProfileStorage {
	profile: UserInfo | null;
	setProfile: (profile: UserInfo) => void;
}

const useProfile = create<ProfileStorage>((set) => ({
	profile: null,
	setProfile: (profile) => set((state) => ({ ...state, profile: profile })),
}));

export default useProfile;