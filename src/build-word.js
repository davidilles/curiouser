import { createRound, nextQuestion, shuffle } from "./game.js";

import { getBank } from "./words.js";
import { joinPieces } from "./word-data.js";

export const BUILD_TERMS = {
  autumn: "Familiar sounds, sound pairs and blends",
  spring: "More spellings and linked vowel pieces",
  summer: "Longer words, plurals and actions",
};
// The two games deliberately use the exact same entries and term membership.
export function getBuildBank(term) {
  return getBank("year1", term);
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
      const candidates = shuffle(pool.filter((part) => !target.parts.includes(part)), random);
      const linked = target.parts.some((part) => part.includes("_"));
      const preferred = candidates.filter((part) => linked ? part.includes("_") : !part.includes("_") && part.length <= Math.max(2, ...target.parts.map((piece) => piece.length)));
      const extras = [...preferred, ...candidates.filter((part) => !preferred.includes(part))].slice(0, extraCount);
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
  return joinPieces(round.selected.map((id) => question.tiles.find((tile) => tile.id === id).text));
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
