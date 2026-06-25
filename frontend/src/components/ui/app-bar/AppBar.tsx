import MuiAppBar, {
	type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";

export type AppBarProps = MuiAppBarProps;

export const AppBar = ({
	color = "default",
	elevation = 1,
	position = "sticky",
	...props
}: AppBarProps) => {
	return (
		<MuiAppBar
			color={color}
			elevation={elevation}
			position={position}
			{...props}
		/>
	);
};
