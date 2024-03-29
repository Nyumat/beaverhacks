//@ts-nocheck
/** @jsxImportSource react */ // Ensure JSX support
"use client";

import { keys, notes } from "@/config/constants";
// this is unfinished and a lil nasty rn, will refactor and add track visual sometime on Saturday

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import * as Tone from "tone";
import { cn } from "../../lib/utils";

type Note = {
  note: string;
  keyName: string;
};

type NoteKeyMap = {
  [key: string]: Note;
};

type PianoKeyProps = {
  note: string;
  playNote: (note: string, isKeyDown: boolean) => void;
  keyName: string;
  keyDown: boolean;
};

const generateNotes = (startOctave: number, numOctaves: number) => {
  let result: Note[] = [];
  for (let i = 0; i < numOctaves; i++) {
    let octave = startOctave + i;
    result = result.concat(
      notes.map((note: string, index: number) => ({
        note: `${note}${octave}`,
        keyName: keys[i * 12 + index],
      }))
    );
  }
  return result;
};

const PianoKey = ({ note, playNote, keyName, keyDown }: PianoKeyProps) => {
  const isSharp = note.includes("#");
  const octave = parseInt(note.slice(-1));
  const octaveStyles = [
    "border-blue-500",
    "border-red-500",
    "border-green-500",
    "border-yellow-500",
  ];
  return (
    <div className={cn("relative", isSharp ? "top-12" : "w-60")}>
      <button
        onMouseDown={() => playNote(note, true)}
        onMouseUp={() => playNote(note, false)}
        onContextMenu={(e) => {
          // This addresses right click indefinite play issue
          e.preventDefault();
          playNote(note, false);
        }}
        className={`${
          isSharp
            ? "absolute z-10 h-12 w-40 bg-black text-white"
            : "h-16 w-full text-black"
        } 
        ${octaveStyles[octave - 4]} rounded-sm border-2 border-solid 
        ${isSharp ? "border-black" : "border-neutral-800"} 
        ${keyDown ? "bg-neutral-400" : isSharp ? "bg-black" : "bg-white"}`}
      >
        <div className="flex flex-col items-center gap-0">
          <span
            className={`${isSharp ? "text-white" : "text-purple-500"} text-xs`}
          >
            {keyName === undefined
              ? "?"
              : String(keyName).toLocaleUpperCase() ?? ""}
          </span>
          <span
            className={`${
              isSharp ? "text-white" : "text-black"
            } text-xs font-bold`}
          >
            {note.replace(/\d/, "")}
          </span>
        </div>
      </button>
    </div>
  );
};

export default function Home() {
  //remember to remove setOctave and just display the entire set of keys and octaves as a single scrollable col of keys
  // ^ made it controlled, we can discuss the UX we want together
  const [octave, setOctave] = useState(3);
  const [startOctave, setStartOctave] = useState(3);
  const [synth, setSynth] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [keysDown, setKeysDown] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSynth(new Tone.PolySynth(Tone.Synth).toDestination());

    return () => synth?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleCapsLock = (e) => {
      if (e.getModifierState("CapsLock")) {
        alert("Notice: Caps Lock is on. This will affect the piano keys.");
      }
    };
    window.addEventListener("keydown", handleCapsLock);
    return () => window.removeEventListener("keydown", handleCapsLock);
  }, []);

  useEffect(() => {
    const noteKeyMap = generateNotes(startOctave, octave).reduce(
      (acc: NoteKeyMap, noteObj: Note) => {
        acc[noteObj.keyName] = noteObj;
        return acc;
      },
      {}
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (noteKeyMap[event.key] && !keysDown[noteKeyMap[event.key].note]) {
        const { note } = noteKeyMap[event.key];
        playNote(note, true);
        setKeysDown((prevKeysDown) => ({
          ...prevKeysDown,
          [noteKeyMap[event.key].note]: true,
        }));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (noteKeyMap[event.key]) {
        const { note } = noteKeyMap[event.key];
        playNote(note, false);
        setKeysDown((prevKeysDown) => ({
          ...prevKeysDown,
          [noteKeyMap[event.key].note]: false,
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
    // You need to include keysDown in the dependency array here,
    // but be cautious as this could cause the effect to run too often.
    // Consider dependencies carefully to avoid excessive re-renders or effect executions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth, isRecording, startOctave, octave, keysDown]);

  const playNote = (note, isKeyDown) => {
    if (isKeyDown) {
      synth?.triggerAttack(note);
      setKeysDown((prevKeysDown) => ({ ...prevKeysDown, [note]: true }));
      if (isRecording) {
        setRecordedNotes((prevNotes) => [
          ...prevNotes,
          { note, time: Tone.now() },
        ]);
      }
    } else {
      synth?.triggerRelease(note);
      setKeysDown((prevKeysDown) => ({ ...prevKeysDown, [note]: false }));
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordedNotes([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const playBackRecording = () => {
    if (recordedNotes.length === 0) return;
    setIsPlayingBack(true);
    const now = Tone.now();
    recordedNotes.forEach(({ note, time }) => {
      synth.triggerAttackRelease(
        note,
        "8n",
        now + (time - recordedNotes[0].time)
      );
    });
    setTimeout(
      () => setIsPlayingBack(false),
      (recordedNotes[recordedNotes.length - 1].time - recordedNotes[0].time) *
        1000
    );
  };

  return (
    <div className="relative flex min-h-screen bg-black text-white">
      <div className="min-w-48">
        <div className="fixed top-3.5 h-full">
          <div className="flex h-fit max-w-full flex-col p-2">
            <div className="flex flex-row">
              <button
                onClick={startRecording}
                disabled={isRecording || isPlayingBack}
                className="mr-2 h-fit rounded border-[1px] px-4 py-2 text-lg border-neutral-800"
              >
                <div className="size-5 rounded-full bg-red-500"></div>
              </button>
              <button
                onClick={stopRecording}
                disabled={!isRecording}
                className="mr-2 h-fit rounded border-[1px] px-4 py-2 text-lg border-neutral-800"
              >
                <div className="size-5 rounded-sm bg-white"></div>
              </button>
              <button
                onClick={playBackRecording}
                disabled={
                  isRecording || isPlayingBack || recordedNotes.length === 0
                }
                className="h-fit rounded border-[1px] px-3 py-1.5 text-lg border-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class=" text-white"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>
            <div className="mt-2 flex w-full flex-row justify-center">
              <div className="flex w-full flex-col">
                <p className="text-lg">Number of Octaves</p>
                <Input
                  type="number"
                  value={octave}
                  onChange={(e) => setOctave(parseInt(e.target.value))}
                  min={1}
                  //   maybe we want to allow more? i don't think the styling will work for that though.
                  max={4}
                  className="size-12 w-full text-center"
                />
              </div>
            </div>
            <div className="mt-2 flex w-full flex-row justify-center">
              <div className="flex w-full flex-col">
                <p className="text-lg">Start Octave</p>
                <Input
                  type="number"
                  value={startOctave}
                  onChange={(e) => setStartOctave(parseInt(e.target.value))}
                  min={1}
                  max={8}
                  className="size-12 w-full text-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-fit flex-col justify-center overflow-visible">
        {/* TODO: Don't allow non visualized notes to be played */}
        {generateNotes(startOctave, octave).map((noteObj) => (
          <PianoKey
            key={noteObj.note}
            note={noteObj.note}
            keyName={noteObj.keyName}
            playNote={playNote}
            keyDown={keysDown[noteObj.note] || false}
          />
        ))}
      </div>
    </div>
  );
}
