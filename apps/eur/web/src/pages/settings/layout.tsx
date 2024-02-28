import { SidebarNav } from "./sidebar";
import { Card } from "@/ui";
import { Outlet, useLoaderData } from "@tanstack/react-router";

type TSettingsItem = { title: string; href: string };

export const sidebarNavItems: TSettingsItem[] = [
  // {
  //   title: "Аккаунт",
  //   href: "/settings",
  // },
  // {
  //   title: "Користувачі",
  //   href: "/settings/users",
  // },
  // {
  //   title: "Ліцензія",
  //   href: "/settings/license",
  // },
  {
    title: "База данних",
    href: "/settings/database",
  },
];

export default function SettingsLayout() {
  const { currentItem } = useLoaderData({ from: "/layout/settings" });
  return (
    <div className="tw-container tw-mt-5">
      <Card>
        <div className="tw-space-y-6 tw-p-10 tw-pb-16">
          <div className="tw-flex tw-flex-col tw-space-y-8 lg:tw-flex-row lg:tw-space-x-12 lg:tw-space-y-0">
            <aside className="-tw-mx-4 lg:tw-w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="tw-flex-1 lg:tw-max-w-2xl">
              <fieldset>
                <legend className="tw-text-base tw-font-semibold tw-text-gray-700 tw-mb-4">
                  {currentItem.title}
                </legend>
                <Outlet />
              </fieldset>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
