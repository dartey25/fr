import { Cert } from "../pages/cert";
import {
  Route,
  Outlet,
  rootRouteWithContext,
  NotFoundRoute,
  redirect,
} from "@tanstack/react-router";
import queryClient from "../utils/query-client";
import { axios } from "../utils/axios";
import { ErrorFallback } from "@/ui";
import { Manual } from "../pages/manual";
import SettingsLayout, { sidebarNavItems } from "../pages/settings/layout";
import { LicenseForm } from "../pages/settings/license";
import { Database } from "../pages/settings/database";
import { Main } from "../pages/main";
import LicenseSetup from "../pages/setup/license";
import DatabaseSetup from "../pages/setup/database";
import RootLayout from "../root-layout";
import { AccountForm } from "../pages/settings/account";
import { useAuth } from "../store/auth";
import { useConfig } from "../store/config";

const rootRoute = rootRouteWithContext<{
  queryClient: typeof queryClient;
}>()({
  component: ({ useRouteContext: _useReactContext }) => {
    return <Outlet />;
  },
});

const layoutRoute = new Route({
  id: "layout",
  beforeLoad: async ({ location }) => {
    if (import.meta.env.MODE !== "production") return;
    try {
      const response = await axios.get("license").then((r) => r.data);
      if (!response.valid) {
        throw new Error("Not licensed");
      }
      // console.log(response);
      if (response.user) {
        useAuth.getState().setUser(response.user);
      }
    } catch {
      throw redirect({
        to: "/setup/license",
        search: {
          redirect: location.href,
        },
        replace: true,
      });
    }
    try {
      const response = await axios.get("settings/database").then((r) => r.data);
      if (response.database) {
        useConfig.getState().setDatabaseConfig(response.database);
      }
    } catch {
      throw redirect({
        to: "/setup/database",
        search: {
          redirect: location.href,
        },
        replace: true,
      });
    }
  },
  getParentRoute: () => rootRoute,
  component: ({ useRouteContext: _useReactContext }) => {
    return <RootLayout />;
  },
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: () => <h1>Page not found</h1>,
});

const indexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Main,
});

const setupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/setup",
  component: () => {
    return <RootLayout />;
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const setupLicenseRoute = new Route({
  getParentRoute: () => setupRoute,
  path: "/license",
  component: () => {
    return <LicenseSetup />;
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const setupDatabaseRoute = new Route({
  getParentRoute: () => setupRoute,
  path: "/database",
  component: () => {
    return <DatabaseSetup />;
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const settingsRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: "/settings",
  loader: async ({ location }) => {
    const currentItem = sidebarNavItems.find(
      (item) => item.href.toLowerCase() === location.href?.toLowerCase(),
    );
    return { currentItem };
  },
  component: ({ currentItem }) => {
    return <SettingsLayout />;
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const accountRoute = new Route({
  getParentRoute: () => settingsRoute,
  path: "/",
  component: () => {
    return <AccountForm />;
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const usersRoute = new Route({
  getParentRoute: () => settingsRoute,
  path: "/users",
  component: () => {
    return <AccountForm />;
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const licenseRoute = new Route({
  getParentRoute: () => settingsRoute,
  path: "/license",
  component: () => {
    return <LicenseForm />;
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const databaseRoute = new Route({
  getParentRoute: () => settingsRoute,
  path: "/database",
  component: () => {
    return <Database />;
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const manualRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: "/manual",
  component: Manual,
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const certIndexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: "/cert",
  validateSearch: (search: Record<string, unknown>): { tab: TCertTab } => {
    // validate and parse the search params into a typed state
    return {
      tab: (search?.tab as TCertTab) || "info",
    };
  },
  component: Outlet,
});

type TCertTab = "info" | "documents" | "receive";

const certRoute = new Route({
  getParentRoute: () => certIndexRoute,
  path: "/",
  component: () => {
    return <Cert />;
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <ErrorFallback />;
  },
});

const certRouteEdit = new Route({
  getParentRoute: () => certIndexRoute,
  path: `$certId`,
  loader: ({ params: { certId } }) => {
    return axios.get(`api/cert/${certId}`).then((r) => r.data);
  },
  component: Cert,
  errorComponent: ({ error }) => {
    console.log(error);
    return <ErrorFallback />;
  },
});

const certRouteNew = new Route({
  getParentRoute: () => certIndexRoute,
  path: `/new/$certId`,
  loader: ({ params: { certId } }) => {
    return axios.get(`api/cert/${certId}`).then((r) => r.data);
  },
  component: () => {
    return <Cert isNewByExample={true} />;
  },
  errorComponent: ({ error }) => {
    console.log(error);
    return <ErrorFallback />;
  },
});

export {
  rootRoute,
  layoutRoute,
  indexRoute,
  certIndexRoute,
  certRoute,
  certRouteEdit,
  certRouteNew,
  settingsRoute,
  licenseRoute,
  databaseRoute,
  manualRoute,
  setupLicenseRoute,
  setupDatabaseRoute,
  setupRoute,
  notFoundRoute,
  accountRoute,
  usersRoute,
};
export type { TCertTab };
