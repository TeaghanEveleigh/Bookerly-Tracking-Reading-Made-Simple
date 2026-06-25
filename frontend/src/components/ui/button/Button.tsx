import MuiButton, {
	type ButtonProps as MuiButtonProps,
} from "@mui/material/Button";

export type ButtonProps = MuiButtonProps & {
	isLoading?: boolean;
};

export const Button = ({
	children,
	disabled,
	isLoading = false,
	variant = "contained",
	...props
}: ButtonProps) => {
	return (
		<MuiButton disabled={disabled || isLoading} variant={variant} {...props}>
			{isLoading ? "Loading..." : children}
		</MuiButton>
	);
};
