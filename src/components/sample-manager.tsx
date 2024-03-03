"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface SampleProps {
  url?: string;
  name: string;
  id: string;
  track: [number, number];
  handleSampleChange: (
    url: string,
    id: string,
    track: [number, number]
  ) => void;
}

interface Sample {
  url: string;
  name: string;
}

interface Category {
  name: string;
  samples: Sample[];
}

const categories: Category[] = [
  {
    name: "Kicks",
    samples: [
      { url: "/0/kick.wav", name: "808 Kick" },
      { url: "/0/kick2.wav", name: "808 Kick 2" },
    ],
  },
  {
    name: "Hats",
    samples: [
      { url: "/0/hat.wav", name: "Closed Hat" },
      { url: "/0/ohat.wav", name: "Open Hat" },
    ],
  },
  {
    name: "Snares",
    samples: [{ url: "/0/snare.wav", name: "Snare" }],
  },
  {
    name: "Toms",
    samples: [
      { url: "/0/tom.wav", name: "Tom" },
      { url: "/0/tom2.wav", name: "Tom 2" },
    ],
  },
  {
    name: "Percussion",
    samples: [{ url: "/0/clap.wav", name: "Clap" }],
  },
];

function ManageSample({ name, id, track, handleSampleChange }: SampleProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className="flex w-40 flex-row items-center justify-between rounded-sm bg-neutral-900 hover:bg-neutral-700">
            <span className="text-white">{selectedSample?.name || name}</span>
            <Icons.settings className="size-6 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Track {track[1]} Settings</DialogTitle>
            <DialogDescription>
              Adjust the track settings here
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1">
            <div className="flex rounded border">
              <div className="w-32 border-r">
                <div>
                  <div className="p-2 text-xs font-medium text-neutral-400">
                    Category
                  </div>
                  <Separator />
                  <ScrollArea className="h-52 w-full border-r-black">
                    <div className="space-y-[0.5px]">
                      {categories.map((category) => (
                        <div
                          key={category.name}
                          className={`m-0 cursor-pointer p-1.5 text-sm hover:bg-neutral-800 ${
                            selectedCategory?.name === category.name
                              ? "bg-neutral-800"
                              : ""
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="flex-1">
                <div>
                  <div className="p-2 text-xs font-medium text-neutral-400">
                    Category
                  </div>
                  <Separator />
                  <ScrollArea className="h-52 w-full">
                    <div className="space-y-[0.5px]">
                      {selectedCategory?.samples.map((sample) => (
                        <div
                          key={sample.name}
                          className={`m-0 cursor-pointer p-1.5 text-sm hover:bg-neutral-800 ${
                            selectedSample?.name === sample.name
                              ? "bg-neutral-800"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedSample(sample);
                            handleSampleChange(sample.url, id, track);
                          }}
                        >
                          {sample.name}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageSample;
