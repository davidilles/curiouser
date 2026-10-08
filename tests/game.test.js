import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { WORD_BANKS, NEW_WORDS, getBank } from "../src/words.js";
import { createRound, answer, nextQuestion } from "../src/game.js";

test("all 189 words are unique, have pictures, and only appear from their intended term onward", () => {
  const words = Object.values(NEW_WORDS).flat();
  assert.equal(words.length, 189);
  assert.equal(new Set(words).size, words.length);
  const terms = ["autumn", "spring", "summer"];
  terms.forEach((term, stage) => {
    const bank = getBank("year1", term);
    assert.deepEqual(
      bank.map((item) => item.id),
      terms.slice(0, stage + 1).flatMap((name) => NEW_WORDS[name]),
    );
    for (const item of bank) {
      assert.ok(
        existsSync(new URL("../" + item.image, import.meta.url)),
        item.image,
      );
      assert.ok(item.stage <= stage);
    }
  });
  assert.throws(() => getBank("reception", "autumn"));
  assert.throws(() => getBank("year1", "winter"));
});

test("rounds have ten unique words, four unambiguous choices, and a balanced review mix", () => {
  for (const bank of Object.values(WORD_BANKS)) {
    for (let run = 0; run < 100; run++) {
      const round = createRound(bank);
      assert.equal(round.questions.length, 10);
      assert.equal(
        new Set(round.questions.map((item) => item.target.id)).size,
        10,
      );
      const stage = Math.max(...bank.map((item) => item.stage));
      if (stage > 0)
        assert.equal(
          round.questions.filter((item) => item.target.stage === stage).length,
          6,
        );
      for (const { target, options } of round.questions) {
        assert.equal(new Set(options.map((item) => item.id)).size, 4);
        assert.equal(options.filter((item) => item.id === target.id).length, 1);
        assert.ok(options.every((item) => bank.includes(item)));
        assert.ok(
          options
            .filter((item) => item.id !== target.id)
            .every((item) => !target.related.includes(item.id)),
        );
      }
    }
  }
});

test("each distinct wrong answer costs one heart; repeated or invalid answers do nothing", () => {
  let round = createRound(getBank("year1", "autumn"));
  const { target, options } = round.questions[0];
  const wrong = options.filter((item) => item.id !== target.id);
  assert.equal(answer(round, "not-an-option"), round);
  round = answer(round, wrong[0].id);
  assert.equal(round.hearts, 2);
  assert.equal(round.correct, 0);
  assert.equal(answer(round, wrong[0].id), round);
  round = answer(round, wrong[1].id);
  assert.equal(round.hearts, 1);
  round = answer(round, wrong[2].id);
  assert.equal(round.hearts, 0);
  assert.equal(round.status, "lost");
  assert.equal(answer(round, target.id), round);
  assert.equal(nextQuestion(round), round);
});

test("hearts carry across questions and a retry can still lead to a successful round", () => {
  let round = createRound(getBank("year1", "spring"));
  const wrong = round.questions[0].options.find(
    (item) => item.id !== round.questions[0].target.id,
  );
  round = answer(round, wrong.id);
  assert.equal(nextQuestion(round), round);
  for (let i = 0; i < 10; i++) {
    round = answer(round, round.questions[i].target.id);
    assert.equal(round.status, "answered");
    assert.equal(answer(round, round.questions[i].target.id), round);
    round = nextQuestion(round);
    assert.equal(round.hearts, 2);
    assert.equal(round.correct, i + 1);
  }
  assert.equal(round.status, "won");
  const fresh = createRound(getBank("year1", "spring"));
  assert.equal(fresh.hearts, 3);
  assert.equal(fresh.correct, 0);
  assert.equal(fresh.index, 0);
});
