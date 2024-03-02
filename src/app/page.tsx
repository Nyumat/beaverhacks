"use client";
import NavigationBar from "@/components/navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <NavigationBar />
      <main className="flex flex-col items-center p-12">
        <h4 className="text-md max-w-xl text-center font-semibold my-12 md:my-0 md:mb-12 text-gray-200">
          Welcome to BeatBytes
        </h4>
        <div className="flex flex-row space-y-4 justify-center w-full mx-auto">
          <h1 className="text-4xl lg:text-8xl max-w-5xl text-center font-semibold">
            <h1 className="text-4xl lg:text-6xl max-w-5xl text-center font-semibold">
              The
            </h1>
            <motion.span
              className="whitespace-nowrap dark:drop-shadow-[0_0_0.2rem_#a855f7] bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-600"
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
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 dark:drop-shadow-[0_0_0.2rem_#4299e1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Hobbyists
            </motion.span>
            {""}
            <br /> and {""}
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600 dark:drop-shadow-[0_0_0.2rem_#48bb78]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              Professionals
            </motion.span>
          </h1>
        </div>
        <p className="text-lg lg:text-2xl text-center max-w-xl mt-14 text-medium">
          Create, share, and collaborate on custom beats and melodies all in one
          place.
        </p>
      </main>
    </>
  );
}
