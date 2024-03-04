"use client";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { Reorder } from "framer-motion";
import { InfoIcon, TrashIcon } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../../convex/_generated/api";
import ManageSample from "./sample-manager";
import SequencerCommand from "./sequencer-command";
import { SequencerMenu } from "./sequencer-menu";

import { Sample } from "@/types";
import { useUser } from "@clerk/clerk-react";
import * as Tone from "tone";
import { TrackActionsDialog } from "./add-track-action";
import { useToast } from "./ui/use-toast";
const NOTE = "C2";

type Track = {
  id: number;
  sampler: Tone.Sampler;
  volume: Tone.Volume;
};

type Props = {
  samples: { url: Tone.ToneAudioBuffer | any; name: string | undefined }[];
  numOfSteps?: number;
};

const shadeToColor = (shade: string, step: number) => {
  const shades = ["800", "700", "600"];
  const index = Math.floor(step / 3);
  return `bg-${shade}-${shades[index] ?? "500"}`;
};

type TempTrack = {
  url: Tone.ToneAudioBuffer;
  name: string;
};

export function Sequencer({ samples, numOfSteps = 16 }: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [checkedSteps, setCheckedSteps] = React.useState([] as string[]);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [tempTrack, setTempTrack] = React.useState<TempTrack[] | null>([]);
  const [samplesState, setSampleState] = React.useState(
    samples.map((s) => {
      return { url: new Tone.Buffer(s.url), name: s.name };
    })
  );
  const [trackIds, setTrackIds] = React.useState([
    ...Array(samples.length).keys(),
  ]);
  const [isLayoutUnlocked, setIsLayoutUnlocked] = React.useState(false);
  const { user } = useUser();

  const tracksRef = React.useRef<Track[]>([]);
  const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
  const lampsRef = React.useRef<HTMLInputElement[]>([]);
  const seqRef = React.useRef<Tone.Sequence | null>(null);
  const stepIds = [...Array(numOfSteps).keys()] as const;

  // Sound Effects
  const [sfxList, setSfxList] = React.useState<Tone.InputNode[]>([]);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const sendFile = useMutation(api.files.sendFile);
  const deleteTrack = useMutation(api.sequencer.deleteTrack);
  /**@ts-ignore */
  const storedFiles = useQuery(api.files.getFiles, { userId: user?.id });

  React.useEffect(() => {
    if (storedFiles && tempTrack && tempTrack.length === 0) {
      const formattedStoredFiles = storedFiles.map((file: any) => ({
        name: file.name,
        url: new Tone.Buffer(file.url),
      }));
      /**@ts-ignore */
      setSampleState((prev) => [...prev, ...formattedStoredFiles]);
    }
  }, [storedFiles, tempTrack]);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const formattedAcceptedFiles = acceptedFiles.map((file) => {
      const url = new Tone.Buffer(URL.createObjectURL(file));
      const name = file.name.split(".");
      name.pop();
      return {
        url,
        name: name.join(""),
      };
    });
    setTempTrack(formattedAcceptedFiles);

    const postUrl = await generateUploadUrl();

    //Upload file to backend, probably move this to the add track handler
    try {
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": acceptedFiles[0]!.type },
        body: acceptedFiles[0],
      });
      const json = await result.json();
      if (!result.ok) {
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }
      if (!user?.id) {
        throw new Error(`User is not authenticated`);
      }
      const { storageId } = json;
      await sendFile({
        storageId,
        name: formattedAcceptedFiles[0].name,
        userId: user?.id,
        sessionId: "temp",
      });
      setTempTrack(null);
    } catch (err) {
      console.error(err);
      setTempTrack(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTrack = (sample: Sample) => {
    const url = new Tone.Buffer(sample.url);
    const name = sample.name;
    const track = { url, name };
    setSampleState((prev) => {
      return [...prev, track];
    });
  };

  const handleAddTrack = () => {
    if (tempTrack === null) return;
    setSampleState((prev) => [...prev, ...tempTrack]);
    setTempTrack(null);
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, multiple: false, accept: { "audio/wav": [] } });

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
        mutatedPrev[track[0]].url = new Tone.Buffer(url);
        return mutatedPrev;
      });
    },
    []
  );

  const handleSaveClick = React.useCallback(async () => {
    try {
      const samplesBase64 = await Promise.all(
        samplesState.map(async ({ url, name }) => {
          const actualUrl = url instanceof Tone.Buffer ? url.name : url;
          const response = await fetch(actualUrl);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          const fileBlob = new Blob([byteArray], {
            type: "audio/mp3",
          });

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
  }, [checkedSteps, samplesState, seqRef, tracksRef, lampsRef]);

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
  }, []);

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
  }, [samplesState]);

  React.useEffect(() => {
    tracksRef.current.forEach((track) => {
      if (sfxList.length > 0) {
        track.sampler.disconnect();
        track.sampler.chain(...sfxList, track.volume);
        console.log(sfxList);
      } else {
        track.sampler.disconnect();
        track.sampler.chain(track.volume);
      }
    });
  }, [sfxList]);

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
    const file = storedFiles?.find(
      (file: any) => file.name === samplesState[index].name
    );
    if (file) deleteTrack({ name: samplesState[index].name ?? "" });
    setTrackIds((prev) => {
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
    setSampleState((prev) => {
      const modifiedArr = [...prev];
      modifiedArr.splice(index, 1);
      return [...modifiedArr];
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
                    removeTrack(trackId);
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
                    key={trackId}
                    url={samplesState[trackId].url.toString()}
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
          <TrackActionsDialog
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragAccept={isDragAccept}
            isDragReject={isDragReject}
            onSampleSave={handleAddTrack}
            addTrack={addTrack}
            tempTrack={tempTrack}
          />
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
            <span>Master Volume</span>
            <Slider
              min={0}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              defaultValue={[0.5]}
            />
          </label>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Button
            onMouseDown={() => {
              setSfxList([new Tone.PitchShift(6), new Tone.Volume(-10)]);
            }}
            onMouseUp={() => {
              setSfxList([]);
            }}
            onMouseLeave={() => {
              setSfxList([]);
            }}
          >
            Octave Up
          </Button>
          <Button
            onMouseDown={() => {
              setSfxList([new Tone.PitchShift(-6), new Tone.Reverb()]);
            }}
            onMouseUp={() => {
              setSfxList([]);
            }}
            onMouseLeave={() => {
              setSfxList([]);
            }}
          >
            Octave Down
          </Button>
          <Button
            onMouseDown={() => {
              setSfxList([new Tone.BitCrusher(), new Tone.Volume(-10)]);
            }}
            onMouseUp={() => {
              setSfxList([]);
            }}
            onMouseLeave={() => {
              setSfxList([]);
            }}
          >
            Crunch
          </Button>
          <Button
            onMouseDown={() => {
              setSfxList([new Tone.Phaser(), new Tone.Volume(-6)]);
            }}
            onMouseUp={() => {
              setSfxList([]);
            }}
            onMouseLeave={() => {
              setSfxList([]);
            }}
          >
            Phaser
          </Button>
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
