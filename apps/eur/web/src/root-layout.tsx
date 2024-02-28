import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Navbar } from "./components/navbar";

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
