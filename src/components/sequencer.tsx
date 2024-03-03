"use client";

import { Input } from "@/components/ui/input";

import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Reorder } from "framer-motion";
import { InfoIcon, PlusIcon, TrashIcon } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import ManageSample from "./sample-manager";
import SequencerCommand from "./sequencer-command";
import { SequencerMenu } from "./sequencer-menu";

import * as Tone from "tone";
import { useToast } from "./ui/use-toast";
const NOTE = "C2";

type Track = {
  id: number;
  sampler: Tone.Sampler;
  volume: Tone.Volume;
};

type Props = {
  samples: { url: string; name: string | undefined }[];
  numOfSteps?: number;
};

const shadeToColor = (shade: string, step: number) => {
  const shades = ["800", "700", "600"];
  const index = Math.floor(step / 3);
  return `bg-${shade}-${shades[index] ?? "500"}`;
};

export function Sequencer({ samples, numOfSteps = 16 }: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [checkedSteps, setCheckedSteps] = React.useState([] as string[]);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [samplesState, setSampleState] = React.useState(samples);
  const [trackIds, setTrackIds] = React.useState([
    ...Array(samples.length).keys(),
  ]);
  const [isLayoutUnlocked, setIsLayoutUnlocked] = React.useState(false);

  const tracksRef = React.useRef<Track[]>([]);
  const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
  const lampsRef = React.useRef<HTMLInputElement[]>([]);
  const seqRef = React.useRef<Tone.Sequence | null>(null);
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setSampleState((prev) => {
      const formatedAcceptedFiles = acceptedFiles.map((file) => {
        const url = URL.createObjectURL(file);
        const name = file.name.split(".");
        name.pop();
        return {
          url,
          name: name.join(""),
        };
      });
      return [...prev, ...formatedAcceptedFiles];
    });
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, maxSize: 41943040, accept: { "audio/wav": [] } });

  const { toast } = useToast();

  const handleStartClick = React.useCallback(async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  }, [setIsPlaying]);

  const changeSample = React.useCallback(
    (url: string, id: string, track: [number, number]) => {
      setSampleState((prev) => {
        const mutatedPrev = [...prev];
        mutatedPrev[track[0]].url = url;
        return mutatedPrev;
      });
    },
    []
  );

  const handleSaveClick = React.useCallback(async () => {
    try {
      const samplesBase64 = await Promise.all(
        samplesState.map(async ({ url, name }) => {
          const response = await fetch(url);
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                data: reader.result,
                name,
              });
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(blob);
          });
        })
      );
      const data = {
        samples: samplesBase64,
        numOfSteps: numOfSteps,
        checkedSteps: checkedSteps,
      };
      localStorage.setItem("data", JSON.stringify(data));
      toast({
        title: "Session Saved!",
      });
    } catch (err) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: "There was an error saving your session",
        variant: "destructive",
      });
      console.error(err);
    }
  }, [samplesState, numOfSteps, checkedSteps, toast]);

  const handleClearSessionClick = React.useCallback(async () => {
    try {
      localStorage.removeItem("data");
      toast({
        title: "Session Deleted!",
      });
      setSampleState(samples);
      setCheckedSteps([]);
    } catch (err) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: "There was an error clearing your session",
        variant: "destructive",
      });
      console.error(err);
    }
  }, [toast]);

  React.useEffect(() => {
    const data = localStorage.getItem("data");
    if (data) {
      const parsedData = JSON.parse(data);
      const samplesWithBlobUrls = parsedData.samples.map(
        ({ data: base64Data, name }: { data: string; name: string }) => {
          const byteCharacters = atob(base64Data.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const fileBlob = new Blob([byteArray], { type: "audio/mp3" });

          const blobUrl = URL.createObjectURL(fileBlob);

          return { url: blobUrl, name };
        }
      );
      setCheckedSteps(parsedData.checkedSteps);
      setSampleState(samplesWithBlobUrls);
    }
  }, []);

  React.useEffect(() => {
    setTrackIds([...Array(samplesState.length).keys()]);
  }, [samplesState]);

  React.useEffect(() => {
    if (seqRef.current) {
      seqRef.current.callback = (time, step) => {
        setCurrentStep(step);
        tracksRef.current.map((trk) => {
          const id = trk.id + "-" + step;
          if (checkedSteps.includes(id)) {
            trk.sampler.triggerAttack(NOTE, time);
          }
          lampsRef.current[step].checked = true;
        });
      };
    }
  }, [checkedSteps]);

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Transport.bpm.value = Number(e.target.value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  const handleTrackVolumeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    trackId: number
  ) => {
    tracksRef.current[trackId].volume.volume.value = Tone.gainToDb(
      Number(e.target.value)
    );
  };

  const clearSteps = React.useCallback(() => {
    setCheckedSteps([]);
    stepsRef.current.map((track) => {
      track.map((step) => {
        step.checked = false;
      });
    });
  }, [setCheckedSteps, stepsRef]);

  React.useEffect(() => {
    tracksRef.current = samplesState.map((sample, i) => {
      const volume = new Tone.Volume(0).toDestination();
      const sampler = new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).connect(volume);
      return {
        id: i,
        sampler,
        volume,
      };
    });
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
          lampsRef.current[step].checked = true;
        });
      },
      [...stepIds],
      "16n"
    );
    seqRef.current.start(0);

    return () => {
      seqRef.current?.dispose();
      tracksRef.current.map((trk) => void trk.sampler.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samplesState, numOfSteps]);

  const handleRename = (
    e: React.ChangeEvent<HTMLInputElement>,
    trackId: number
  ) => {
    setSampleState((prev) => {
      const mutatedPrev = [...prev];
      mutatedPrev[trackId].name = e.target.value;
      return mutatedPrev;
    });
  };

  const removeTrack = (index: number) => {
    setSampleState((prev) => {
      const modifiedArr = [...prev];
      modifiedArr.splice(index, 1);
      return [...modifiedArr];
    });
    setCheckedSteps((prev) => {
      return prev.filter((box) => {
        const parsedStringArr = box.split("-");
        return !parsedStringArr.includes(index.toString());
      });
    });
  };

  const handleReorder = (newItems: number[]) => {
    if (isLayoutUnlocked) {
      setTrackIds(newItems);
    } else {
      toast({
        /**@ts-ignore */
        title: (
          <div className="flex gap-4">
            <InfoIcon />
            Unlock layout before reordering!
          </div>
        ),
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start space-y-4">
        <div className="flex w-full p-3">
          <SequencerMenu
            handleStartClick={handleStartClick}
            handleSaveClick={handleSaveClick}
            handleClearSessionClick={handleClearSessionClick}
            clearSteps={clearSteps}
            setIsLayoutUnlocked={setIsLayoutUnlocked}
            isLayoutUnlocked={isLayoutUnlocked}
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-row space-x-2">
            {stepIds.map((stepId) => (
              <label key={stepId} className="hidden">
                <input
                  key={stepId}
                  id={`lamp-${stepId}`}
                  type="checkbox"
                  className="hidden"
                  ref={(elm) => {
                    if (!elm) return;
                    lampsRef.current[stepId] = elm;
                  }}
                />
              </label>
            ))}
          </div>
          <Reorder.Group
            className="flex flex-col space-y-2"
            values={trackIds}
            onReorder={handleReorder}
            as="div"
          >
            {trackIds.map((trackId, index) => (
              <Reorder.Item
                value={trackId}
                className="relative flex w-full cursor-grab flex-row items-center justify-center gap-2 space-y-2 align-middle"
                key={trackId}
                as="div"
              >
                <TrashIcon
                  onClick={() => {
                    removeTrack(index);
                    toast({
                      /** @ts-ignore */
                      title: (
                        <div className="flex gap-3">
                          <InfoIcon />
                          {samplesState[trackId].name} deleted
                        </div>
                      ),
                    });
                  }}
                  className="absolute -left-11 cursor-pointer"
                />
                {samplesState[trackId] !== undefined && (
                  <ManageSample
                    url={"/0/calp.wav"}
                    name={samplesState[trackId].name ?? ""}
                    id={trackId.toString()}
                    track={[trackId, index + 1]}
                    handleSampleChange={changeSample}
                  />
                )}
                <div className="-my-2 mx-3 flex flex-row gap-0 space-x-[8px]">
                  {stepIds.map((stepId, stepIndex) => {
                    const id = trackId + "-" + stepId;
                    const checkedStep = checkedSteps.includes(id) ? id : null;
                    const isCurrentStep = stepId === currentStep && isPlaying;
                    const shade = 800;
                    return (
                      <label
                        key={id}
                        className={cn(
                          `w-10 h-10 rounded-sm flex items-center justify-center transition-transform duration-75 cursor-default transform bg-neutral-${shade} active:scale-90`,
                          {
                            "bg-green-500": checkedStep,
                            "bg-purple-500 scale-110 transition-transform duration-100":
                              isCurrentStep,
                            "drop-shadow-[0_0_0.4rem_#a855f7]": isCurrentStep,
                            "active:scale-90": true,
                          }
                        )}
                      >
                        <Input
                          key={id}
                          id={id}
                          type="checkbox"
                          className="hidden"
                          ref={(elm) => {
                            if (!elm) return;
                            if (!stepsRef.current[trackId]) {
                              stepsRef.current[trackId] = [];
                            }
                            stepsRef.current[trackId][stepId] = elm;
                          }}
                          onChange={() => {
                            setCheckedSteps((prev) => {
                              if (prev.includes(id)) {
                                return prev.filter((step) => step !== id);
                              }
                              return [...prev, id];
                            });
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
                <label className="flex flex-col items-center">
                  <Slider
                    className="w-36 rounded-full"
                    min={0}
                    max={10}
                    step={0.1}
                    // @ts-ignore
                    onChange={(e) => handleTrackVolumeChange(e, trackId)}
                    defaultValue={[5]}
                  />
                </label>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <div className="w-full">
            <div
              className="container mt-10 w-full border-gray-700 border-2 p-5 rounded-md border-dashed flex justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="flex gap-3">
                <PlusIcon />
                <p>
                  Drag &lsquo;n&lsquo; drop some files here, or click to select
                  files
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* <button
            onClick={handleStartClick}
            className="h-12 w-36 rounded bg-blue-500 text-white"
          >
            {isPlaying ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleSaveClick}
            className="h-12 w-36 rounded bg-blue-500 text-white"
          >
            Save Set
          </button>
          <button
            onClick={clearSteps}
            className="h-12 w-36 rounded bg-red-500 text-white"
          >
            Clear Steps
          </button>
          <button
            onClick={handleClearSessionClick}
            className="h-12 w-36 rounded bg-red-500 text-white"
          >
            Clear Session
          </button> */}
          <label className="col-span-2 flex flex-col items-center">
            <span>BPM</span>
            <Slider
              min={30}
              max={300}
              step={1}
              onChange={handleBpmChange}
              defaultValue={[120]}
            />
          </label>
          <label className="col-span-2 flex flex-col items-center">
            <span>Volume</span>
            <Slider
              min={0}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              defaultValue={[33]}
            />
          </label>
        </div>
        <Toaster />
        <SequencerCommand
          toast={toast}
          samples={samplesState}
          numOfSteps={numOfSteps}
          checkedSteps={checkedSteps}
          handleSaveClick={handleSaveClick}
          handleClearSessionClick={handleClearSessionClick}
          handleStartClick={handleStartClick}
        />
      </div>
    </>
  );
}
