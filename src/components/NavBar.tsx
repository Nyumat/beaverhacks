import {
  SignInButton,
  SignUpButton,
  UserButton,
  currentUser,
} from "@clerk/nextjs";
import { Drum } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { useAuth, useUser } from "@clerk/nextjs";

export default function NavigationBar() {
  const user = useAuth();
  const userData = useUser();
  return (
    <header className="fixed top-0 z-50 flex w-full flex-row items-center justify-between py-4 md:sticky mx-auto">
      <Link href="/" title="Home">
        <h1
          className="inline-flex cursor-pointer select-none items-center justify-center gap-1 pl-6 md:pl-8 text-md md:text-2xl"
          title="BeatBytes"
        >
          <Drum className="size-4 md:size-8 text-purple-700 dark:text-purple-700 mr-2 font-light" />
          <h1 className=" dark:drop-shadow-[0_0_0.3rem_#ffffff70] font-light text-neutral-950 dark:text-white">
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
            {user ? (
              <>
                <li className="text-lg" title="Sequencer">
                  <Link href="/sequencer">Go To Sequencer</Link>
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
      </div>
    </header>
  );
}
