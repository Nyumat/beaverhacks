import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { Drum } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navMenuConfig } from "@/config/nav-menu";
import { cn } from "@/lib/utils";

export default function NavigationBar() {
  const user = useAuth();
  const userData = useUser();
  return (
    <header className="fixed top-0 z-50 mx-auto flex w-full flex-row items-center justify-between border-b-[1px] dark:bg-neutral-950/50 py-4 backdrop-blur-md md:sticky">
      <div className="flex items-center justify-between gap-1 align-middle">
        <Link href="/" title="Home">
          <h1
            className="mt-1 inline-flex cursor-pointer select-none items-center justify-center gap-1 pl-6 md:pl-8 md:text-2xl"
            title="BeatBytes"
          >
            <Drum className="mr-2 size-4 font-light text-purple-700 dark:text-purple-700 md:size-8" />
            <span className="font-medium text-purple-600 dark:font-light dark:text-white dark:drop-shadow-sm">
              BeatBytes
            </span>
          </h1>
        </Link>

        <NavigationMenu className={cn("hidden md:flex ml-4")}>
          <NavigationMenuList>
            <NavigationMenuItem className="flex flex-row gap-4">
              {navMenuConfig.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg dark:font-light font-medium text-neutral-950 dark:text-white dark:drop-shadow-[0_0_0.2rem_#6b46c1]",
                    navigationMenuTriggerStyle
                  )}
                >
                  {link.title}
                </a>
              ))}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="">
        <nav className="mx-6 flex items-center justify-center px-6 align-middle md:hidden">
          <ul className="flex flex-row items-center justify-center gap-4">
            <li title="Toggle Theme">
              <ThemeToggle />
            </li>

            {user.isSignedIn ? (
              <>
                <li className="text-lg">
                  <Link href="/sequencer" title="sequencer">
                    Sequencer
                  </Link>
                </li>
                <li
                  className="text-lg"
                  title={userData.user?.username ?? "Your User"}
                >
                  <UserButton afterSignOutUrl="/" />
                </li>
              </>
            ) : (
              <>
                <li className="text-lg" title="Sequencer">
                  <SignInButton mode="modal" afterSignInUrl="/" />
                </li>

                <li className="text-lg" title="Sign Up">
                  <SignUpButton mode="modal" afterSignUpUrl="/" />
                </li>
              </>
            )}
          </ul>
        </nav>

        <nav className="mx-6 hidden items-center md:flex">
          <ul className="flex flex-row items-center space-x-8">
            <li>
              <ThemeToggle />
            </li>
            {user.isSignedIn ? (
              <>
                <li
                  className="text-lg"
                  title={userData.user?.username ?? "Your User"}
                >
                  <UserButton afterSignOutUrl="/" />
                </li>
              </>
            ) : (
              <>
                <li className="text-lg" title="Sequencer">
                  <SignInButton mode="modal" afterSignInUrl="/" />
                </li>

                <li className="text-lg" title="Sign Up">
                  <SignUpButton mode="modal" afterSignUpUrl="/" />
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
