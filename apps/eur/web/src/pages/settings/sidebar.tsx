import { useLoaderData, useNavigate } from "@tanstack/react-router";

import { cn } from "../../utils";
import { buttonVariants } from "@/ui";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const navigate = useNavigate();
  const { currentItem } = useLoaderData({ from: "/layout/settings" });

  return (
    <nav
      className={cn(
        "tw-flex tw-space-x-2 lg:tw-flex-col lg:tw-space-x-0 lg:tw-space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <div
          className={cn(
            "tw-w-full tw-py-2 tw-px-4 tw-rounded-[5px] hover:tw-bg-gray-100 hover:tw-cursor-pointer",
            currentItem.href === item.href && "tw-bg-gray-100",
          )}
          onClick={() => navigate({ to: item.href })}
        >
          <span
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "tw-justify-start",
            )}
          >
            {item.title}
          </span>
        </div>
      ))}
    </nav>
  );
}
