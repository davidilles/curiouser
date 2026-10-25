import { shuffle } from './game.js';

export const MATH_ROUND_LENGTH = 10;
export const BONDS = Array.from({ length: 6 }, (_, a) => [a, 10 - a]);
export function makeFact(a, form) {
  const b = 10 - a;
  const facts = [
    { left: a, op: '+', right: null, result: 10, answer: b },
    { left: null, op: '+', right: a, result: 10, answer: b },
    { left: 10, op: '−', right: a, result: null, answer: b },
    { left: 10, op: '−', right: null, result: a, answer: b },
  ];
  return { ...facts[form], a, b, id: `${a}-${form}` };
}
export function createMathRound(mode = 'practice', random = Math.random) {
  // Drop one addition and one subtraction from different pairs, so all six
  // bonds still appear in exactly ten questions (five of each operation).
  const [skipAddition, skipSubtraction] = shuffle([0, 1, 2, 3, 4, 5], random);
  const questions = shuffle(BONDS.flatMap(([a, b], index) => [
    ...(index === skipAddition ? [] : [makeFact(random() < .5 ? a : b, random() < .5 ? 0 : 1)]),
    ...(index === skipSubtraction ? [] : [makeFact(random() < .5 ? a : b, random() < .5 ? 2 : 3)]),
  ]), random);
  return { mode, questions, index: 0, status: 'playing', helped: mode !== 'recall',
    mistakeCount: 0, mistakes: [], independent: 0, supported: 0, lastAnswer: null };
}

export function helpMath(round) {
  return round.status === 'playing' ? { ...round, helped: true } : round;
}
export function answerMath(round, value) {
  if (round.status !== 'playing' || !Number.isInteger(value) || value < 0 || value > 10 || round.mistakes.includes(value)) return round;
  const q = round.questions[round.index];
  if (value !== q.answer) return { ...round, helped: true, mistakeCount: round.mistakeCount + 1, mistakes: [...round.mistakes, value], lastAnswer: 'wrong' };
  const supported = round.helped || round.mistakes.length > 0;
  return { ...round, status: 'answered', lastAnswer: 'correct',
    independent: round.independent + (supported ? 0 : 1),
    supported: round.supported + (supported ? 1 : 0) };

}
export function nextMath(round) {
  if (round.status !== 'answered') return round;
  if (round.index + 1 === round.questions.length) return { ...round, status: 'won' };
  return { ...round, index: round.index + 1, status: 'playing', helped: round.mode !== 'recall', mistakes: [], lastAnswer: null };
}
