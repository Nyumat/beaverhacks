/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import NavigationBar from "@/components/navbar";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { AudioLines, KeyboardMusic, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const auth = useAuth();
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);
  return (
    <>
      <NavigationBar />
      <main className="flex flex-col items-center">
        <div className="mt-24 flex h-screen flex-col gap-4 md:mt-16 lg:mt-8">
          <h4 className="pointer-events-none mx-auto mb-6 mt-8 w-fit max-w-xl  select-none rounded-3xl border-[0.5px] bg-gradient-to-r from-purple-500 from-40% via-blue-500 via-50% to-green-500  to-60% bg-clip-text px-4 py-2 text-center font-semibold text-transparent ring-2 ring-neutral-100 ring-opacity-20 dark:ring-neutral-100 dark:ring-opacity-5">
            Welcome to BeatBytes
          </h4>
          <div className="mx-auto flex w-full flex-row justify-center space-y-4">
            <h1 className="xs:scale-[0.6] max-w-3xl scale-[0.8] whitespace-normal text-center text-6xl font-bold md:max-w-5xl md:scale-100 md:text-7xl lg:text-8xl">
              <motion.span
                className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent dark:drop-shadow-[0_0_0.15rem_#a855f7]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Accelerate
              </motion.span>{" "}
              Your{" "}
              <div className="whitespace-nowrap">
                <motion.span
                  className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent dark:drop-shadow-[0_0_0.15rem_#4299e1]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  Music{" "}
                </motion.span>
                <motion.span
                  className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent dark:drop-shadow-[0_0_0.15rem_#48bb78]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                >
                  Production
                </motion.span>
              </div>
              Journey Today.
            </h1>
          </div>
          <p className="mx-auto mt-6 max-w-xs text-center text-xl font-semibold text-neutral-900/70 dark:text-neutral-300/80 md:max-w-md md:text-2xl lg:mt-14 lg:max-w-2xl lg:text-2xl">
            Create, share, and collaborate on custom beats and melodies,{" "}
            <span className="bg-gradient-to-r from-purple-500 from-20%  via-blue-500 via-50% to-green-500 to-80% bg-clip-text text-center font-semibold text-transparent md:my-0 md:mb-12">
              all in one place.
            </span>
          </p>
          <div className="mt-12 hidden items-center justify-center lg:flex">
            <Image
              src="/synth.png"
              alt="Synth Screenshot"
              className="w-[48rem] max-w-none rounded-lg border-8 border-purple-700 border-opacity-5 shadow-[0_35px_75px_-15px_rgba(90,0,170,0.475)] ring-2 ring-opacity-10 dark:ring-purple-500/50 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width="2432"
              height="1442"
            />
          </div>
        </div>
        <div
          className="mt-2 flex h-full flex-col items-center justify-center sm:h-screen"
          id="features"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.1 }}
          >
            <div className="mx-auto  w-full py-12 pl-12">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-full lg:grid-cols-2 lg:overflow-x-clip">
                <div className="mr-10 rounded-2xl border-8 border-purple-700 border-opacity-5 bg-neutral-950/80  px-6 py-2 shadow-[0_35px_75px_-15px_rgba(90,0,170,0.475)] ring-2 ring-purple-500 ring-opacity-10 dark:ring-purple-500/50 lg:ml-10">
                  <div className="lg:max-w-lg ">
                    <h2 className="text-xl font-semibold leading-7 text-purple-500">
                      Make Music Happen
                    </h2>
                    <p className="mt-2 text-5xl font-bold tracking-tight dark:text-white sm:text-4xl">
                      A better workflow
                    </p>
                    <p className="mt-6 text-lg leading-8 dark:text-gray-200">
                      BeatBytes is a compact, collaborative, music-making
                      computer. Make any beat or melody you desire by yourself
                      or with your friends.
                    </p>
                    <dl className="mt-8 max-w-xl space-y-6 text-base leading-7 dark:text-gray-200 lg:max-w-none">
                      <div className="relative rounded-lg p-2 pl-9 ring-2 ring-opacity-10 transition-all dark:ring-white/10 dark:hover:bg-white dark:hover:bg-opacity-5">
                        <dt className="inline font-semibold dark:text-white">
                          <AudioLines
                            className="absolute left-1.5 top-2.5 h-6 w-6 text-purple-500"
                            aria-hidden="true"
                          />
                          Sequencer
                        </dt>
                        <dd className="inline pl-2">
                          Sequence rhythms and patterns with simplicity and
                          precision.
                        </dd>
                      </div>
                      <div className="relative rounded-lg p-2 pl-9 ring-2 ring-opacity-10 transition-all dark:ring-white/10 dark:hover:bg-white dark:hover:bg-opacity-5">
                        <dt className="inline font-semibold">
                          <KeyboardMusic
                            className="absolute left-1.5 top-2.5 h-6 w-6 text-purple-500"
                            aria-hidden="true"
                          />{" "}
                          Synth
                        </dt>
                        <dd className="inline pl-2">
                          Generate a wide array of melodies with an intuitive
                          interface.
                        </dd>
                      </div>
                      <div className="relative rounded-lg p-2 pl-9 ring-2 ring-opacity-10 transition-all dark:ring-white/10 dark:hover:bg-white dark:hover:bg-opacity-5">
                        <dt className="inline font-semibold dark:text-white">
                          <Users
                            className="absolute left-1.5 top-2.5 h-5 w-5 text-purple-500"
                            aria-hidden="true"
                          />
                          Share
                        </dt>
                        <dd className="inline pl-2">
                          Collaborate on projects with friends seamlessly and
                          share your work with the world.
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <Image
                  src="/features.png"
                  alt="Product screenshot"
                  className="w-[48rem] max-w-none rounded-lg border-8 border-purple-700 border-opacity-5 shadow-[0_35px_75px_-15px_rgba(90,0,170,0.475)] ring-2 ring-opacity-10 dark:ring-purple-500/50 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                  width="2432"
                  height="1442"
                />
              </div>
            </div>
          </motion.span>
        </div>
        <div className="my-48 flex flex-col items-center justify-center sm:my-0 sm:h-screen">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-5xl 2xl:text-5xl">
                Start creating today.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-2xl leading-8 text-gray-300">
                There is no better time than now to make music, gather some
                friends and start building.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {auth.isSignedIn ? (
                  <Link
                    href="/sequencer"
                    className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-md hover:from-purple-600 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-purple-700"
                  >
                    Get Started
                  </Link>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <span className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-md hover:from-purple-600 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-purple-700">
                        Get Started
                      </span>
                    </SignInButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
