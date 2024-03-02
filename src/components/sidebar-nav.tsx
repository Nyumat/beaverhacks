"use client";

import { routeConfig } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Music } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import ThemeToggle from "./theme-toggle";

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full  flex-col gap-5">
      <div className="flex items-center gap-2">
        <Music className="size-4 md:size-8 text-purple-700 dark:text-purple-700 mr-2 font-light" />
        <h1 className="text-3xl font-medium">BeatBytes</h1>
      </div>
      <nav className="flex flex-1  flex-col gap-2">
        {routeConfig.sidebarNav.map((link) => {
          return (
            <Link
              href={link.href}
              className={cn(
                "gap-5 py-1 text-sm md:text-lg lg:text-xl xl:text-2xl px-2 rounded-lg flex flex-row transition-colors items-center hover:bg-purple-900",
                {
                  "bg-purple-900/50": pathname === link.href,
                  "text-gray-900": pathname === link.href,
                  "hover:bg-purple-900 text-neutral-200":
                    pathname === link.href,
                }
              )}
              key={link.title}
            >
              {link.title}
            </Link>
          );
        })}
      </nav>

      <div className="flex w-full justify-end">
        <ThemeToggle />
      </div>
    </div>
  );
}
