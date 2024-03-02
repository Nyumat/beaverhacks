import {
  SignInButton,
  SignUpButton,
  UserButton,
  currentUser,
} from "@clerk/nextjs";
import { Drum } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default async function NavigationBar() {
  const user = await currentUser();
  return (
    <header className="fixed top-0 z-50 flex w-full flex-row items-center justify-between bg-neutral-100/10 py-4 dark:bg-neutral-800/10 md:sticky">
      <Link href="/" title="Home">
        <h1
          className="inline-flex cursor-pointer select-none items-center justify-center gap-1 pl-8 text-2xl"
          title="BeatBytes"
        >
          <Drum className="size-8 text-[#6c9a23] dark:text-[#A3E635]" />
          <h1 className="font-bold text-neutral-950 dark:text-white">
            BeatBytes
          </h1>
        </h1>
      </Link>

      <div className="">
        <nav className="mx-6 flex items-center justify-center px-6 align-middle md:hidden">
          <ul className="flex flex-row items-center justify-center gap-4">
            <li title="Toggle Theme">
              <ThemeToggle />
            </li>

            {user ? (
              <>
                <li className="text-lg">
                  <Link href="/dashboard" title="Dashboard">
                    Dashboard
                  </Link>
                </li>
                <li
                  className="text-lg"
                  title={user.firstName ?? user.username ?? "Your User"}
                >
                  <UserButton afterSignOutUrl="/" />
                </li>
              </>
            ) : (
              <>
                <li className="text-lg" title="Sequencer">
                  <SignInButton mode="modal" afterSignInUrl="/sequencer" />
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
            {user ? (
              <li className="text-lg" title="Sequencer">
                <Link href="/sequencer">Sequencer</Link>
              </li>
            ) : (
              <>
                <li className="text-lg" title="Dashboard">
                  <SignInButton mode="modal" afterSignInUrl="/sequencer" />
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
