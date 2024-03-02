'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Reorder } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import React, { useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as Tone from 'tone';
const NOTE = 'C2';

type Track = {
  id: number;
  sampler: Tone.Sampler;
  volume: Tone.Volume;
};

type Props = {
  samples: { url: string; name: string }[];
  numOfSteps?: number;
};

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: 'border-neutral-800',
  borderStyle: 'dashed',
  cursor: 'pointer',
  backgroundColor: '#404040',
  color: '#f7fff0',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#99c8ff',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

export function Sequencer({ samples, numOfSteps = 16 }: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [checkedSteps, setCheckedSteps] = React.useState([] as string[]);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [samplesState, setSampleState] = React.useState(samples);
  const [trackIds, setTrackIds] = React.useState([
    ...Array(samples.length).keys(),
  ]);

  const tracksRef = React.useRef<Track[]>([]);
  const stepsRef = React.useRef<HTMLInputElement[][]>([[]]);
  const lampsRef = React.useRef<HTMLInputElement[]>([]);
  const seqRef = React.useRef<Tone.Sequence | null>(null);
  const stepIds = [...Array(numOfSteps).keys()] as const;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSampleState((prev) => {
      const formatedAcceptedFiles = acceptedFiles.map((file) => {
        const url = URL.createObjectURL(file);
        return {
          url,
          name: file.name,
        };
      });
      return [...prev, ...formatedAcceptedFiles];
    });
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, accept: { 'audio/wav': [] } });

  const handleStartClick = async () => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const handleSaveClick = async () => {
    const data = {
      samples: samplesState,
      numOfSteps: numOfSteps,
      checkedSteps: checkedSteps,
    };
    localStorage.setItem('data', JSON.stringify(data));
  };

  useEffect(() => {
    const data = localStorage.getItem('data');
    if (data) {
      const parsedData = JSON.parse(data);
      setCheckedSteps(parsedData.checkedSteps);
    }
  }, []);

  useEffect(() => {
    setTrackIds([...Array(samplesState.length).keys()]);
  }, [samplesState]);

  useEffect(() => {
    if (seqRef.current) {
      seqRef.current.callback = (time, step) => {
        setCurrentStep(step);
        tracksRef.current.map((trk) => {
          const id = trk.id + '-' + step;
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

  const clearSteps = () => {
    setCheckedSteps([]);
    stepsRef.current.map((track) => {
      track.map((step) => {
        step.checked = false;
      });
    });
  };

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
      '16n'
    );
    seqRef.current.start(0);

    return () => {
      seqRef.current?.dispose();
      tracksRef.current.map((trk) => void trk.sampler.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samplesState, numOfSteps]);

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

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

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
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
            onReorder={setTrackIds}
          >
            {trackIds.map((trackId) => (
              <Reorder.Item
                value={trackId}
                className="flex w-full flex-row items-center justify-center gap-2 space-y-2 align-middle"
                key={trackId}
              >
                <Input
                  className="mr-2  whitespace-nowrap text-white cursor-text w-32"
                  value={samplesState[trackId].name}
                  onChange={(e) => handleRename(e, trackId)}
                />

                <div className="mx-auto flex w-2/3 flex-row space-x-2">
                  {stepIds.map((stepId, stepIndex) => {
                    const id = trackId + '-' + stepId;
                    const checkedStep = checkedSteps.includes(id) ? id : null;
                    const isCurrentStep = stepId === currentStep && isPlaying;
                    const shade = stepIndex % 4 === 0 ? 600 : 800;
                    // TODO: Figure out why shade not applying
                    return (
                      <label
                        key={id}
                        className={cn(
                          `w-12 h-10 rounded-sm flex items-center justify-center bg-neutral-700 transition-colors duration-100 scale-100 hover:scale-110 cursor-pointer`,
                          {
                            'bg-green-500': checkedStep,
                            'bg-purple-500 scale-110 transition-colors duration-100':
                              isCurrentStep,
                            'drop-shadow-[0_0_0.4rem_#a855f7]': isCurrentStep,
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
                  <input
                    type="range"
                    className="w-36 rounded-full"
                    min={0}
                    max={10}
                    step={0.1}
                    onChange={(e) => handleTrackVolumeChange(e, trackId)}
                    defaultValue={5}
                  />
                </label>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <div className="w-full">
            <div
              className="container mt-10 w-full"
              {...getRootProps({ style })}
            >
              <input {...getInputProps()} />
              <div className="flex gap-3">
                <PlusIcon />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button
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
            Clear
          </button>
          <label className="flex flex-col items-center">
            <span>BPM</span>
            <input
              type="range"
              min={30}
              max={300}
              step={1}
              onChange={handleBpmChange}
              defaultValue={120}
            />
          </label>
          <label className="flex flex-col items-center">
            <span>Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              defaultValue={1}
            />
          </label>
        </div>
      </div>
    </>
  );
}
