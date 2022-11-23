import { Outlet } from "@remix-run/react";
import Header from "~/components/header";

const ADMIN_LINKS = [
  { label: "Players", link: "/admin/players" },
  { label: "Teams", link: "/admin/teams" },
  { label: "Leagues", link: "/admin/leagues" },
  { label: "Divisions", link: "/admin/divisions" },
  { label: "Fixtures", link: "/admin/fixtures" },
  { label: "Venues", link: "/admin/venues" },
];

export default function Sales() {
  return (
    <div className="min-h-full">
      <Header links={ADMIN_LINKS} />
      <div className="py-10">
        <main className="mx-auto max-w-7xl p-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
