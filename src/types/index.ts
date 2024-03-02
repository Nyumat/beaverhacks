import { Icons } from "@/components/icons";

export type SidebarNavItem = {
  title: string;
  icon: keyof typeof Icons;
  href: string;
};

export type RouteConfig = {
  sidebarNav: SidebarNavItem[];
};
