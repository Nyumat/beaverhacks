"use client";
import NavigationBar from "@/components/navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <NavigationBar />
      <main className="flex flex-col items-center p-12">
        <h4 className="my-12 max-w-xl text-center font-semibold text-gray-200 md:my-0 md:mb-12">
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
        <p className="mt-14 max-w-xl text-center text-lg lg:text-2xl">
          Create, share, and collaborate on custom beats and melodies all in one
          place.
        </p>
      </main>
    </>
  );
}
