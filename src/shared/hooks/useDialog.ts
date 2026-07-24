import { useCallback, useMemo, useState } from "react";

export interface UseDialogReturn {
	isOpen: boolean;
	openDialog: () => void;
	closeDialog: () => void;
	toggleDialog: () => void;
	setDialogOpen: (open: boolean) => void;
	dialogProps: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
	};
}

export function useDialog(initialOpen = false): UseDialogReturn {
	const [isOpen, setIsOpen] = useState(initialOpen);

	const openDialog = useCallback(() => setIsOpen(true), []);
	const closeDialog = useCallback(() => setIsOpen(false), []);
	const toggleDialog = useCallback(() => setIsOpen((current) => !current), []);
	const setDialogOpen = useCallback((open: boolean) => setIsOpen(open), []);

	const dialogProps = useMemo(
		() => ({ open: isOpen, onOpenChange: setDialogOpen }),
		[isOpen, setDialogOpen],
	);

	return {
		isOpen,
		openDialog,
		closeDialog,
		toggleDialog,
		setDialogOpen,
		dialogProps,
	};
}
