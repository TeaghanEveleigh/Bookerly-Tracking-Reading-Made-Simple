import MuiDrawer, {
	type DrawerProps as MuiDrawerProps,
} from "@mui/material/Drawer";

export type DrawerProps = MuiDrawerProps;

export const Drawer = ({
	anchor = "left",
	ModalProps,
	...props
}: DrawerProps) => {
	return (
		<MuiDrawer
			anchor={anchor}
			ModalProps={{
				keepMounted: true,
				...ModalProps,
			}}
			{...props}
		/>
	);
};
