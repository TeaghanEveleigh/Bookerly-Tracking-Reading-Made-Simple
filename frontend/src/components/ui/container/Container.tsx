import MuiContainer, {
	type ContainerProps as MuiContainerProps,
} from "@mui/material/Container";

export type ContainerProps = MuiContainerProps;

export const Container = ({ maxWidth = "lg", ...props }: ContainerProps) => {
	return <MuiContainer maxWidth={maxWidth} {...props} />;
};
