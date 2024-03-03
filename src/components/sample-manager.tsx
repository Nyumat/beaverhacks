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
import { Sample, Category } from "@/types";
import { categories } from "@/config/constants";

interface SampleProps {
  url: string;
  name: string;
  id: string;
  track: [number, number];
  handleSampleChange: (
    url: string,
    id: string,
    track: [number, number]
  ) => void;
}

function ManageSample({
  url,
  name,
  id,
  track,
  handleSampleChange,
}: SampleProps) {
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
                    Samples
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
                            handleSampleChange(
                              sample.url.toString(),
                              id,
                              track
                            );
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
