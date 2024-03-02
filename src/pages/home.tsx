import { Sequencer } from "@/ToggleGroupDemo";
import { motion } from "framer-motion";
import * as React from "react";

interface HomeProps {
  path?: string;
}

const Home: React.FC<HomeProps> = () => {
  return (
    <motion.div
      key="1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 1 }}
    >
      <Sequencer
        samples={[
          { url: "/hat-closed.wav", name: "Closed Hat" },
          { url: "/clap.wav", name: "Clap" },
          { url: "/snare.wav", name: "Snare Drum" },
          { url: "/kick.wav", name: "808 Kick" },
        ]}
      />
    </motion.div>
  );
};

export default Home;
