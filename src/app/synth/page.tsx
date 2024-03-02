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
          ? "w-6 h-20 bg-black rounded-r-md"
          : "w-32 md:w-44 h-12 bg-white border-2 rounded-r-md"
      } ${isSharp ? "-ml-3 z-10" : "mr-1"} relative cursor-pointer`}
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
      <div className="flex flex-row max-w-lg border-r-2 py-2 px-2">
        <button
          onClick={startRecording}
          disabled={isRecording || isPlayingBack}
          className="px-4 py-2 mr-2 h-fit bg-neutral-700 hover:bg-neutral-600 rounded text-lg"
        >
          <div className="w-5 h-5 rounded-full bg-red-500"></div>
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="px-4 py-2 mr-2 h-fit bg-neutral-700 hover:bg-neutral-600 rounded text-lg"
        >
          <div className="w-5 h-5 rounded-sm bg-neutral-500"></div>
        </button>
        <button
          onClick={playBackRecording}
          disabled={isRecording || isPlayingBack || recordedNotes.length === 0}
          className="px-3 py-1.5 h-fit bg-neutral-700 hover:bg-neutral-600 rounded text-lg"
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
            class="lucide lucide-play text-neutral-400"
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
