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
  const selected = revision.length
    ? shuffle(
        [
          ...shuffle(newWords, random).slice(0, 6),
          ...shuffle(revision, random).slice(0, 4),
        ],
        random,
      )
    : shuffle(bank, random).slice(0, ROUND_LENGTH);
  const questions = selected.map((target) => ({
    target,
    options: shuffle(
      [
        target,
        ...shuffle(
          bank.filter(
            (item) =>
              item.id !== target.id && !target.related?.includes(item.id),
          ),
          random,
        ).slice(0, 3),
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
