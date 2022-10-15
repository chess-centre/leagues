import { Outlet } from "@remix-run/react";
import Header from "~/components/header";

const ADMIN_LINKS = [
  { label: "Players", link: "/admin/players" },
  { label: "Clubs", link: "/admin/clubs" },
  { label: "Leagues", link: "/admin/leagues" },
  { label: "Fixtures", link: "/admin/fixtures" },
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
