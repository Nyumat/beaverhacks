import { Icons } from "@/components/icons";

export type SidebarNavItem = {
  title: string;
  icon: keyof typeof Icons;
  href: string;
};

export type SideNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: MenuItem[];
    }
);

export type RouteConfig = {
  sidebarNav: SidebarNavItem[];
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};
export type MenuItem = NavItem & {
  description?: string;
  launched?: boolean;
  external?: boolean;
};

export type MainNavItem = NavItem;

export type NavMenuConfig = {
  links: MenuItem[];
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export interface Sample {
  url: string;
  name: string;
}

export interface Category {
  name: string;
  samples: Sample[];
}
