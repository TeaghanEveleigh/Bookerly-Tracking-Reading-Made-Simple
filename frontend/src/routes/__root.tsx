import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

const RootLayout = () => {
	return (
		<>
			<nav>
				<Link to="/dashboard">Home</Link>
				<Link to="/library">Library</Link>
				<Link to="/book">Book</Link>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
			</nav>
			<Outlet />
		</>
	);
};

export const Route = createRootRoute({
	component: RootLayout,
});
