import { Link, Outlet } from "@tanstack/react-router";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from '@mui/icons-material/Menu';

import { useState } from "react";
import {
	AppBar,
	Box,
	Container,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from "../ui";

const navigationItems = [
	{ Icon: HomeIcon, label: "Home", to: "/dashboard" },
	{ Icon: CollectionsBookmarkIcon, label: "My Books", to: "/library" },
	{ Icon: ExploreIcon, label: "Discover", to: "/discover" },
] as const;

const drawerWidth = 240;

export const AppShell = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	const navigation = (
		<List>
			{navigationItems.map((item) => (
				<Link
					key={item.to}
					onClick={closeDrawer}
					style={{ color: "inherit", textDecoration: "none" }}
					to={item.to}
				>
					<ListItemButton>
						<ListItemIcon>
							<item.Icon />
						</ListItemIcon>
						<ListItemText primary={item.label} />
					</ListItemButton>
				</Link>
			))}
		</List>
	);

	return (
		<Box sx={{ minHeight: "100vh" }}>
			<AppBar>
				<Toolbar>
					<IconButton
						aria-label="Open navigation"
						edge="start"
						onClick={openDrawer}
						sx={{ display: { md: "none" }, mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography component="div" sx={{ flexGrow: 1 }} variant="h6">
						Bookerly
					</Typography>
					<Box
						component="nav"
						sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}
					>
						{navigationItems.map((item) => (
							<Link
								key={item.to}
								style={{
									color: "inherit",
									textDecoration: "none",
								}}
								to={item.to}
							>
								<Typography
									sx={{
										alignItems: "center",
										display: "flex",
										gap: 0.75,
										px: 1,
										py: 0.5,
									}}
								>
									<item.Icon fontSize="small" />
									{item.label}
								</Typography>
							</Link>
						))}
					</Box>
				</Toolbar>
			</AppBar>
			<Drawer
				onClose={closeDrawer}
				open={isDrawerOpen}
				sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
			>
				<Toolbar />
				{navigation}
			</Drawer>
			<Container component="main" sx={{ py: 4 }}>
				<Outlet />
			</Container>
		</Box>
	);
};
