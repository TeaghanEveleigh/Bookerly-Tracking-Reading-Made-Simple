import { createFileRoute } from "@tanstack/react-router";

import { Book } from "../pages/book";

export const Route = createFileRoute("/book")({
	component: Book,
});
