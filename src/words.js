// Broad term groups, not a scheme-specific teaching sequence. See README.md.
// Each word has its own locally hosted picture. Use British English spellings.
// Each later term adds new patterns and revisits all earlier words.
// Pictures include objects, quantities and actions; avoid obscure vocabulary as padding.
import { WORD_GROUPS } from "./word-data.js";

export const NEW_WORDS = Object.fromEntries(
  Object.entries(WORD_GROUPS).map(([term, entries]) => [term, entries.map((entry) => entry.word)]),
);

const groups = {
  "year1-autumn": NEW_WORDS.autumn,
  "year1-spring": [...NEW_WORDS.autumn, ...NEW_WORDS.spring],
  "year1-summer": [
    ...NEW_WORDS.autumn,
    ...NEW_WORDS.spring,
    ...NEW_WORDS.summer,
  ],
};

// Prevent related pictures from being shown together when either could fit a word.
const relatedPictures = [
  ["hat", "cap", "helmet"],
  ["boat", "ship"],
  ["cup", "teapot"],
  ["boot", "shoe", "skate"],
  ["bear", "teddy"],
  ["hen", "chick"],
  ["brush", "pen", "pencil", "crayon"],
  ["chair", "plate"],
  ["sun", "sunflower"],
  ["snow", "snowman"],
  ["tooth", "toothbrush"],
  ["fish", "shark", "jellyfish"],
  ["rain", "cloud", "snow"],
  ["moon", "star"],
  ["hand", "leg", "foot"],
  ["bag", "basket"],
  ["cat", "cats"],
  ["dog", "dogs"],
  ["duck", "ducks"],
  ["boat", "ship", "boats"],
  ["box", "boxes"],
  ["brush", "brushes", "painting", "pen", "pencil", "crayon"],
  ["plate", "dishes"],
  ["chair", "benches"],
  ["rabbit", "hare"],
  ["shell", "oyster"],
  ["bed", "quilt", "sleeping"],
  ["foot", "toe", "hand", "thumb", "leg"],
  ["tooth", "teeth"],
  ["claw", "cat", "cats", "dog", "dogs", "bear", "tiger", "lion"],
  ["grass", "field", "fern", "leaf", "tree"],
  ["shore", "beach", "cliff"],
  ["night", "moon", "star", "house"],
  ["square", "cube", "box", "boxes"],
  ["reading", "book"],
  ["eating", "stew", "meat", "beans", "spoon"],
  ["drinking", "cup", "straw"],
  ["cooking", "stew", "spoon"],
  ["boy", "girl", "queen", "statue", "astronaut", "jumping", "sleeping", "reading", "eating", "singing", "painting", "cooking", "drinking"],
];

export const YEARS = [{ id: "year1", name: "Year 1", ages: "Ages 5–6" }];

export const TERMS = [
  {
    id: "autumn",
    name: "Autumn",
    image: "autumn",
    note: "A fresh beginning",
    colour: "peach",
  },
  {
    id: "spring",
    name: "Spring",
    image: "spring",
    note: "Growing in confidence",
    colour: "pink",
  },
  {
    id: "summer",
    name: "Summer",
    image: "sun",
    note: "Look how far you’ve come!",
    colour: "yellow",
  },
];

export const LEVELS = {
  "year1-autumn": {
    title: "Building on our sounds",
    description: "Revisit sounds and blend with confidence",
    focus: "ou · oi · air · ow · ar · ear",
  },
  "year1-spring": {
    title: "New ways to make sounds",
    description: "Alternative spellings and split digraphs",
    focus: "a–e · i–e · o–e · ea · ey · wh",
  },
  "year1-summer": {
    title: "Brilliant word explorers",
    description: "More spellings and longer words",
    focus: "ea · ear · eer · ou · two syllables",
  },
};

const definitions = new Map(Object.values(WORD_GROUPS).flat().map((entry) => [entry.word, entry]));

export const WORD_BANKS = Object.fromEntries(
  Object.entries(groups).map(([id, words]) => [
    id,
    words.map((word) => ({
      ...definitions.get(word),
      related: relatedPictures.filter((group) => group.includes(word)).flat(),
    })),
  ]),
);

export function getBank(year, term) {
  const bank = WORD_BANKS[`${year}-${term}`];
  if (!bank) throw new Error("Please choose a valid school year and term.");
  return bank;
}
