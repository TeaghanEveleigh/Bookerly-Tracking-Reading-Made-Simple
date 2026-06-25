import MuiIconButton, {
	type IconButtonProps as MuiIconButtonProps,
} from "@mui/material/IconButton";

export type IconButtonProps = MuiIconButtonProps;

export const IconButton = ({ color = "inherit", ...props }: IconButtonProps) => {
	return <MuiIconButton color={color} {...props} />;
};
