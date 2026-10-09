import { createRound, nextQuestion, shuffle } from "./game.js";

// Contiguous sound chunks for short words; meaningful parts for compound words.
// Deliberately curated rather than mechanically splitting every word.
const PARTS = {
  autumn: [
    "c a t", "d o g", "p i g", "h e n", "f o x", "s u n",
    "h a t", "b e d", "c u p", "m a p", "b u s", "p e n",
    "f i sh", "sh i p", "d u ck", "r i ng", "sh ee p", "g oa t",
    "b oo t", "m oo n", "r ai n", "b oo k", "b ee", "t r ai n",
  ],
  spring: [
    "p ea ch", "l ea f", "k ey", "wh ee l", "s n ow", "p ie",
    "t ie", "f l y", "s ea l", "b ea n s", "m ea t", "b ir d",
    "sh ir t", "g ir l", "s aw", "b all",
  ],
  summer: [
    "b r ea d", "f ea th er", "p ear", "b ear", "d eer", "r a bb i t",
    "c a rr o t", "l e m o n", "r o ck e t", "mush room", "snow man",
    "tea pot", "tooth brush", "rain bow", "sun flow er", "jelly fish",
  ],
};
export const BUILD_TERMS = {
  autumn: "Short words and familiar sound chunks",
  spring: "More vowel patterns and spellings",
  summer: "Longer words and compound words",
};
export function getBuildBank(term) {
  const terms = Object.keys(PARTS);
  const stage = terms.indexOf(term);
  if (stage < 0) throw new Error("Please choose a valid term.");
  return terms.slice(0, stage + 1).flatMap((name, stage) =>
    PARTS[name].map((entry) => {
      const parts = entry.split(" ");
      const word = parts.join("");
      return { id: word, word, parts, stage, image: `./assets/pictures/${word}.png` };
    }),
  );
}
export function createBuildRound(term, random = Math.random) {
  const bank = getBuildBank(term);
  const base = createRound(bank, random);
  const pool = [...new Set(bank.flatMap((word) => word.parts))];
  const extraCount = term === "autumn" ? 2 : 3;
  return {
    ...base,
    selected: [],
    questions: base.questions.map(({ target }) => {
      const extras = shuffle(pool.filter((part) => !target.parts.includes(part)), random).slice(0, extraCount);
      const tiles = shuffle([...target.parts, ...extras].map((text, i) => ({ id: `tile-${i}`, text })), random);
      return { target, tiles };
    }),
  };
}
export function selectPart(round, id) {
  const question = round.questions[round.index];
  if (round.status !== "playing" || round.selected.includes(id) ||
      round.selected.length >= question.target.parts.length ||
      !question.tiles.some((tile) => tile.id === id)) return round;
  return { ...round, selected: [...round.selected, id], lastAnswer: null };
}
export function removePart(round, index) {
  if (round.status !== "playing" || !Number.isInteger(index) || index < 0 || index >= round.selected.length) return round;
  return { ...round, selected: round.selected.filter((_, i) => i !== index), lastAnswer: null };
}
export function assembledWord(round) {
  const question = round.questions[round.index];
  return round.selected.map((id) => question.tiles.find((tile) => tile.id === id).text).join("");
}
export function checkBuild(round) {
  if (round.status !== "playing" || round.selected.length !== round.questions[round.index].target.parts.length) return round;
  const word = assembledWord(round);
  if (word === round.questions[round.index].target.word)
    return { ...round, status: "answered", correct: round.correct + 1, lastAnswer: "correct" };
  if (round.tried.includes(word)) return { ...round, selected: [], lastAnswer: "repeated" };
  const hearts = round.hearts - 1;
  return { ...round, selected: [], hearts, tried: [...round.tried, word], lastAnswer: "wrong", status: hearts ? "playing" : "lost" };
}
export function nextBuildQuestion(round) {
  const next = nextQuestion(round);
  return next === round ? round : { ...next, selected: [] };
}
