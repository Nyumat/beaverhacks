import { Sequencer } from "@/components/sequencer";

export default function Page() {
  return (
    <>
      <div className="flex h-full flex-col items-center justify-center">
        <Sequencer
          samples={[
            { url: "/0/clap.wav", name: "Clap" },
            { url: "/0/hat.wav", name: "Closed Hat" },
            { url: "/0/kick.wav", name: "808 Kick" },
            { url: "/0/kick2.wav", name: "808 Kick 2" },
          ]}
        />
      </div>
    </>
  );
}
