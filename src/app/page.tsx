"use client";
import NavigationBar from "@/components/navbar";
import { motion } from "framer-motion";
import { Music, AudioLines, KeyboardMusic, Users } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <NavigationBar />
      <main className="flex flex-col items-center p-12">
        <div className="h-screen">
          <h4 className="my-12 max-w-xl text-center font-semibold text-gray-200 md:my-0 md:mb-12 mx-auto">
            Welcome to BeatBytes
          </h4>
          <div className="mx-auto flex w-full flex-row justify-center space-y-4">
            <h1 className="max-w-5xl text-center text-4xl font-semibold lg:text-8xl">
              <h1 className="max-w-5xl text-center text-4xl font-semibold lg:text-6xl">
                The
              </h1>
              <motion.span
                className="whitespace-nowrap bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent dark:drop-shadow-[0_0_0.2rem_#a855f7]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {" "}
                Ultimate Sequencer
              </motion.span>{" "}
              <br />
              for {""}
              <motion.span
                className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent dark:drop-shadow-[0_0_0.2rem_#4299e1]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                Hobbyists
              </motion.span>
              {""}
              <br /> and {""}
              <motion.span
                className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent dark:drop-shadow-[0_0_0.2rem_#48bb78]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                Professionals
              </motion.span>
            </h1>
          </div>
          <p className="mt-14 max-w-xl text-center text-lg lg:text-2xl mx-auto">
            Create, share, and collaborate on custom beats and melodies all in
            one place.
          </p>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.1 }}
        >
          <div className="mx-auto max-w-7xl py-8 px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="lg:pr-8 lg:pt-4">
                <div className="lg:max-w-lg -mt-1">
                  <h2 className="text-xl font-semibold leading-7 text-purple-500">
                    Make Music Happen
                  </h2>
                  <p className="mt-2 text-5xl font-bold tracking-tight text-white sm:text-4xl">
                    A better workflow
                  </p>
                  <p className="mt-6 text-lg leading-8 text-gray-150">
                    BeatBytes a compact, collaborative, music-making computer.
                    Make any beat or melody you desire by yourself or with your
                    friends.
                  </p>
                  <dl className="mt-8 max-w-xl space-y-6 text-base leading-7 text-gray-150 lg:max-w-none">
                    <div className="relative pl-9 ring-white rounded-lg ring-2 ring-opacity-10 p-2 hover:bg-white hover:bg-opacity-5 transition-all">
                      <dt className="inline font-semibold text-white">
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
                    <div className="relative pl-9 ring-white rounded-lg ring-2 ring-opacity-10 p-2 hover:bg-white hover:bg-opacity-5 transition-all">
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
                    <div className="relative pl-9 ring-white rounded-lg ring-2 ring-opacity-10 p-2 hover:bg-white hover:bg-opacity-5 transition-all">
                      <dt className="inline font-semibold text-white">
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
                className="w-[48rem] shadow-[0_35px_75px_-15px_rgba(90,0,170,0.475)]                max-w-none rounded-lg ring-2 ring-white ring-opacity-10 border-8 border-white border-opacity-5 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                width="2432"
                height="1442"
              />
            </div>
          </div>
        </motion.span>
      </main>
    </>
  );
}
