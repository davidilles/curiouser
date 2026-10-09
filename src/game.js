export const ROUND_LENGTH = 10;
export const STARTING_HEARTS = 3;

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Spread a round across practice focuses without retaining any child history.
function variedWords(pool, count, random, used) {
  const remaining = shuffle(pool, random);
  const result = [];
  while (remaining.length && result.length < count) {
    const frequency = (word) => used.get(word.focus ?? "general") ?? 0;
    const minimum = Math.min(...remaining.map(frequency));
    const index = remaining.findIndex((word) => frequency(word) === minimum);
    const [word] = remaining.splice(index, 1);
    result.push(word);
    used.set(word.focus ?? "general", frequency(word) + 1);
  }
  return result;
}

function spellingDistance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++)
      next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a[i - 1] !== b[j - 1]));
    row = next;
  }
  return row[b.length];
}

function pictureDistractors(bank, target, random) {
  const candidates = shuffle(bank.filter((word) => word.id !== target.id && !target.related?.includes(word.id)), random);
  // One fair, similarly spelt alternative rewards reading the whole word.
  // Remaining choices stay varied; all must be visually unambiguous.
  const close = candidates.find((word) => spellingDistance(word.word, target.word) === 1);
  return close ? [close, ...candidates.filter((word) => word !== close).slice(0, 2)] : candidates.slice(0, 3);
}

export function createRound(bank, random = Math.random) {
  if (
    bank.length < 4 ||
    new Set(bank.map((item) => item.id)).size !== bank.length
  ) {
    throw new Error("A word bank needs at least four unique pictures.");
  }
  const newestStage = Math.max(...bank.map((item) => item.stage ?? 0));
  const newWords = bank.filter((item) => (item.stage ?? 0) === newestStage);
  const revision = bank.filter((item) => (item.stage ?? 0) < newestStage);
  const used = new Map();
  const selected = revision.length
    ? shuffle(
        [
          ...variedWords(newWords, 6, random, used),
          ...variedWords(revision, 4, random, used),
        ],
        random,
      )
    : variedWords(bank, ROUND_LENGTH, random, used);
  const questions = selected.map((target) => ({
    target,
    options: shuffle(
      [
        target,
        ...pictureDistractors(bank, target, random),
      ],
      random,
    ),
  }));
  return {
    questions,
    index: 0,
    hearts: STARTING_HEARTS,
    correct: 0,
    status: "playing",
    tried: [],
    lastAnswer: null,
  };
}

// Returning a new state makes repeated taps harmless and keeps UI and rules separate.
export function answer(round, id) {
  if (round.status !== "playing" || round.tried.includes(id)) return round;
  const question = round.questions[round.index];
  if (!question.options.some((option) => option.id === id)) return round;
  if (id === question.target.id) {
    return {
      ...round,
      correct: round.correct + 1,
      status: "answered",
      lastAnswer: "correct",
    };
  }
  const hearts = round.hearts - 1;
  return {
    ...round,
    hearts,
    tried: [...round.tried, id],
    lastAnswer: "wrong",
    status: hearts === 0 ? "lost" : "playing",
  };
}

export function nextQuestion(round) {
  if (round.status !== "answered") return round;
  if (round.index === round.questions.length - 1)
    return { ...round, status: "won" };
  return {
    ...round,
    index: round.index + 1,
    status: "playing",
    tried: [],
    lastAnswer: null,
  };
}
