import { Router } from "@tanstack/react-router";
import {
  accountRoute,
  certIndexRoute,
  certRoute,
  certRouteEdit,
  certRouteNew,
  databaseRoute,
  indexRoute,
  layoutRoute,
  licenseRoute,
  manualRoute,
  notFoundRoute,
  rootRoute,
  settingsRoute,
  setupDatabaseRoute,
  setupLicenseRoute,
  setupRoute,
  usersRoute,
} from "./routes";
import queryClient from "../utils/query-client";

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

//Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    manualRoute,
    setupRoute.addChildren([setupDatabaseRoute, setupLicenseRoute]),
    settingsRoute.addChildren([
      licenseRoute,
      databaseRoute,
      accountRoute,
      usersRoute,
    ]),
    certIndexRoute.addChildren([certRoute, certRouteEdit, certRouteNew]),
    notFoundRoute,
  ]),
]);

// const routeTree = rootRoute.addChildren([mainRoute, certRoute, certRouteEdit]);

// Set up a Router instance
const router = new Router({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient,
  },
});

export { router };
