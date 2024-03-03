import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories } from "@/config/constants";
import { Category, Sample } from "@/types";
import React from "react";
import { Icons } from "./icons";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";
import { FileIcon } from "lucide-react";

export function ActionsTabs({
  getRootProps,
  getInputProps,
  isDragAccept,
  isDragReject,
  setSelectedCategory,
  setSelectedSample,
  selectedCategory,
  selectedSample,
}: any) {
  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="presets">Presets</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload your own file</CardTitle>
            <CardDescription>
              Select a <code>.wav</code> file from your computer to upload.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Wav File Input</Label>
              <div
                className=" mt-2 flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-neutral-600/40"
                {...getRootProps()}
              >
                <Input type="file" {...getInputProps()} required />
                <p className="text-center">
                  Drag & drop your file here or click to browse.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="presets">
        <Card>
          <CardHeader>
            <CardTitle>Presets</CardTitle>
            <CardDescription>
              Select one of our presets to add to your track.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
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
                        {categories.map((category: Category) => (
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
                        {selectedCategory?.samples.map((sample: Sample) => (
                          <div
                            key={sample.name}
                            className={`m-0 cursor-pointer p-1.5 text-sm hover:bg-neutral-800 ${
                              selectedSample?.name === sample.name
                                ? "bg-neutral-800"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedSample(sample);
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export function TrackActionsDialog({
  getRootProps,
  getInputProps,
  isDragAccept,
  isDragReject,
  onSampleSave,
  addTrack,
  tempTrack,
}: any) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);
  const [selectedSample, setSelectedSample] = React.useState<Sample | null>(
    null
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className=" container mt-10 flex w-full cursor-pointer select-none items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-600/40 p-1 hover:border-neutral-100">
          <Icons.plus className="size-4" />
          Track
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a track</DialogTitle>
          <DialogDescription>
            Let&apos;s add a new track to your session.
          </DialogDescription>
        </DialogHeader>

        {tempTrack.length === 0 ? (
          <>
            <p className="-mb-8 -mt-2 text-xs font-semibold text-neutral-100">
              Sample
            </p>
            <ActionsTabs
              {...{ getRootProps, getInputProps }}
              isDragAccept={isDragAccept}
              isDragReject={isDragReject}
              addTrack={onSampleSave}
              setSelectedCategory={setSelectedCategory}
              setSelectedSample={setSelectedSample}
              selectedCategory={selectedCategory}
              selectedSample={selectedSample}
            />
          </>
        ) : (
          <div className="flex gap-4">
            <FileIcon />
            <p>{tempTrack[0].name}</p>
          </div>
        )}
        <p className="-mb-8 -mt-2 text-xs text-neutral-400">
          This is the sample that will be played when the track is triggered.
        </p>
        <Separator />
        <DialogFooter>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              if (!selectedSample?.name || !selectedSample?.url) {
                toast({
                  title: "Error",
                  description:
                    "No sample selected. Please select a sample to add to the track.",
                  variant: "destructive",
                });
                return;
              }
              if (selectedSample?.name !== "" && selectedSample?.url !== "") {
                addTrack(selectedSample);
                setOpen(false);
                setSelectedCategory(null);
                setSelectedSample(null);
                toast({
                  title: "Success",
                  description: "Track added successfully.",
                  variant: "default",
                });
              } else if (!selectedSample && getInputProps().value !== "") {
                const file = getInputProps();
                if (file.value !== "") {
                  onSampleSave();
                  setOpen(false);
                  toast({
                    title: "Success",
                    description: "Track added successfully.",
                    variant: "default",
                  });
                } else {
                  toast({
                    title: "Error",
                    description:
                      "No file selected. Please select a file to upload first.",
                    variant: "destructive",
                  });
                }
              } else {
                toast({
                  title: "Error",
                  description:
                    "No sample selected. Please select a sample to add to the track.",
                  variant: "destructive",
                });
              }
            }}
          >
            Add Track
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
