import { Sequencer } from "@/components/sequencer";

export default function Page() {
  return (
    <>
      <Sequencer
        samples={[
          { url: "/0/clap.wav", name: "Clap" },
          { url: "/0/hat.wav", name: "Closed Hat" },
          { url: "/0/kick.wav", name: "808 Kick" },
          { url: "/0/kick2.wav", name: "808 Kick 2" },
          { url: "/0/ohat.wav", name: "Open Hat" },
          { url: "/0/snare.wav", name: "Snare" },
          { url: "/0/tom.wav", name: "Tom" },
          { url: "/0/tom2.wav", name: "Tom 2" },
        ]}
      />
    </>
  );
}
