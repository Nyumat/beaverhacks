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

export interface TeamCardItem {
  name: string;
  role: string;
  image: string;
  other?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  biography?: string;
}

export type ProjectCardItem = {
  title: string;
  description: string;
  href: string;
  github?: string;
  live?: string;
  images: string[];
  video: string;
  tags?: string[];
};

export type MainNavItem = NavItem;

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type NavMenuConfig = {
  links: MenuItem[];
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
};
