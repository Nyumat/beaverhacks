import { Category } from "@/types";

export const notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const keys = [
  "a",
  "w",
  "s",
  "e",
  "d",
  "f",
  "t",
  "g",
  "y",
  "h",
  "u",
  "j",
  "k",
  "o",
  "l",
  "p",
  ";",
  "[",
  "'",
  "]",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  ".",
  "/",
];

export const categories: Category[] = [
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
