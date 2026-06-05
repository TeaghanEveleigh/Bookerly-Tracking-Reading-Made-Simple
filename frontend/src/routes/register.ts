// src/routes/about.tsx

import { createFileRoute } from "@tanstack/react-router";

import { Library } from "../pages/library";

export const Route = createFileRoute("/register")({
  component: Library,
});