import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Toaster } from "react-hot-toast";
import appStyles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: appStyles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "The Chess Centre: Leagues",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Toaster position="top-center" />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
