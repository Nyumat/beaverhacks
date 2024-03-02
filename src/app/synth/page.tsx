//@ts-nocheck
/** @jsxImportSource react */ // Ensure JSX support
"use client";

// this is unfinished and a lil nasty rn, will refactor and add track visual sometime on Saturday

import { useState, useEffect } from "react";
import * as Tone from "tone";

const generateNotes = (octave) => {
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  return notes.map((note) => `${note}${octave}`).concat(`${"C"}${octave + 1}`);
};

const noteKeyMap = {
  a: "C",
  w: "C#",
  s: "D",
  e: "D#",
  d: "E",
  f: "F",
  t: "F#",
  g: "G",
  y: "G#",
  h: "A",
  u: "A#",
  j: "B",
  k: "C",
};

const PianoKey = ({ note, playNote }) => {
  const isSharp = note.includes("#");
  return (
    <button
      onMouseDown={() => playNote(note, true)}
      onMouseUp={() => playNote(note, false)}
      className={`${
        isSharp
          ? "h-20 w-6 rounded-r-md bg-black"
          : "h-12 w-32 rounded-r-md border-2 bg-white md:w-44"
      } ${isSharp ? "z-10 -ml-3" : "mr-1"} relative cursor-pointer`}
    >
      {note.replace(/\d/, "")}
    </button>
  );
};

export default function Home() {
  //remember to remove setOctave and just display the entire set of keys and octaves as a single scrollable col of keys
  const [octave, setOctave] = useState(4);
  const [synth, setSynth] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [isPlayingBack, setIsPlayingBack] = useState(false);

  useEffect(() => {
    setSynth(new Tone.PolySynth(Tone.Synth).toDestination());

    return () => synth?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const notesPlaying = {};

    const handleKeyDown = (event) => {
      const note = noteKeyMap[event.key];
      if (note && synth && !notesPlaying[note]) {
        synth.triggerAttack(`${note}${octave}`);
        notesPlaying[note] = true;
        if (isRecording) {
          setRecordedNotes((prevNotes) => [
            ...prevNotes,
            { note: `${note}${octave}`, time: Tone.now() },
          ]);
        }
      }
    };

    const handleKeyUp = (event) => {
      const note = noteKeyMap[event.key];
      if (note && synth) {
        synth.triggerRelease(`${note}${octave}`);
        notesPlaying[note] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [synth, octave, isRecording]);

  const playNote = (note, isKeyDown) => {
    const fullNote = `${note}${octave}`;
    if (isKeyDown) {
      synth?.triggerAttack(fullNote);
    } else {
      synth?.triggerRelease(fullNote);
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
    <div className="relative flex min-h-screen bg-neutral-900 text-white">
      <div className="flex max-w-lg flex-row border-r-2 p-2">
        <button
          onClick={startRecording}
          disabled={isRecording || isPlayingBack}
          className="mr-2 h-fit rounded bg-neutral-700 px-4 py-2 text-lg hover:bg-neutral-600"
        >
          <div className="size-5 rounded-full bg-red-500"></div>
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="mr-2 h-fit rounded bg-neutral-700 px-4 py-2 text-lg hover:bg-neutral-600"
        >
          <div className="size-5 rounded-sm bg-neutral-500"></div>
        </button>
        <button
          onClick={playBackRecording}
          disabled={isRecording || isPlayingBack || recordedNotes.length === 0}
          className="h-fit rounded bg-neutral-700 px-3 py-1.5 text-lg hover:bg-neutral-600"
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
            class=" text-neutral-400"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col">
        {generateNotes(octave).map((note) => (
          <PianoKey key={note} note={note} playNote={playNote} />
        ))}
      </div>
    </div>
  );
}
