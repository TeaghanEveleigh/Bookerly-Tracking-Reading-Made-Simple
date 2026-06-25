import MuiList, { type ListProps as MuiListProps } from "@mui/material/List";
import MuiListItemButton, {
	type ListItemButtonProps as MuiListItemButtonProps,
} from "@mui/material/ListItemButton";
import MuiListItemText, {
	type ListItemTextProps as MuiListItemTextProps,
} from "@mui/material/ListItemText";
import MuiListItemIcon, {
	type ListItemIconProps as MuiListItemIconProps,
} from "@mui/material/ListItemIcon";

export type ListProps = MuiListProps;
export type ListItemButtonProps = MuiListItemButtonProps;
export type ListItemIconProps = MuiListItemIconProps;
export type ListItemTextProps = MuiListItemTextProps;

export const List = (props: ListProps) => {
	return <MuiList {...props} />;
};

export const ListItemButton = (props: ListItemButtonProps) => {
	return <MuiListItemButton {...props} />;
};

export const ListItemIcon = (props: ListItemIconProps) => {
	return <MuiListItemIcon {...props} />;
};

export const ListItemText = (props: ListItemTextProps) => {
	return <MuiListItemText {...props} />;
};
