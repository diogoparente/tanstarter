import { FileRoutesByPath } from "@tanstack/react-router";

const ROUTES: { [key: string]: keyof FileRoutesByPath } = {
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  DASHBOARD: "/dashboard",
};

export { ROUTES };
