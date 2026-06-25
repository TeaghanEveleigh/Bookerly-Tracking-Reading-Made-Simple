import MuiTypography, {
	type TypographyProps as MuiTypographyProps,
} from "@mui/material/Typography";

export type TypographyProps = MuiTypographyProps;

export const Typography = (props: TypographyProps) => {
	return <MuiTypography {...props} />;
};
