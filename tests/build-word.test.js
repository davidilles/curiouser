import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { getBuildBank, createBuildRound, selectPart, removePart, assembledWord, checkBuild, nextBuildQuestion } from "../src/build-word.js";

import { getBank } from "../src/words.js";
import { joinPieces } from "../src/word-data.js";

function solve(round) {
  for (const part of round.questions[round.index].target.parts) {
    const tile = round.questions[round.index].tiles.find((tile) => tile.text === part && !round.selected.includes(tile.id));
    round = selectPart(round, tile.id);
  }
  return round;
}
test("all 237 shared words rebuild correctly and have bundled pictures", () => {
  assert.equal(getBuildBank("summer").length, 237);
  for (const term of ["autumn", "spring", "summer"]) {
    const bank = getBuildBank(term);
    assert.equal(bank, getBank("year1", term));
    assert.equal(new Set(bank.map((w) => w.id)).size, bank.length);
    for (const word of bank) {
      assert.equal(joinPieces(word.parts), word.word);
      assert.ok(word.focus && word.parts.length, word.word);
      assert.ok(existsSync(new URL(`../${word.image}`, import.meta.url)), word.word);
    }
  }
  assert.throws(() => getBuildBank("winter"));
});
test("linked vowel pieces assemble in spelling order and preserve following endings", () => {
  for (const [word, pieces] of [
    ["cake", ["c", "a_e", "k"]],
    ["bike", ["b", "i_e", "k"]],
    ["grapes", ["g", "r", "a_e", "p", "s"]],
    ["flute", ["f", "l", "u_e", "t"]],
  ]) assert.equal(joinPieces(pieces), word);
  assert.notEqual(joinPieces(["c", "k", "a_e"]), "cake");
  assert.notEqual(joinPieces(["c", "a_e"]), "cake");
  assert.notEqual(joinPieces(["a_e", "i_e", "k"]), "cake");
});
test("each round has ten unique targets, a revision mix and two or three extra pieces", () => {
  for (const [stage, term] of ["autumn", "spring", "summer"].entries()) {
    for (let run = 0; run < 50; run++) {
      const round = createBuildRound(term);
      assert.equal(round.questions.length, 10);
      assert.equal(new Set(round.questions.map((q) => q.target.id)).size, 10);
      assert.equal(round.questions.filter((q) => q.target.stage === stage).length, stage ? 6 : 10);
      for (const { target, tiles } of round.questions) {
        assert.equal(tiles.length, target.parts.length + (stage ? 3 : 2));
        assert.equal(new Set(tiles.map((tile) => tile.id)).size, tiles.length);
        for (const part of new Set(target.parts))
          assert.equal(tiles.filter((tile) => tile.text === part).length, target.parts.filter((p) => p === part).length);
      }
    }
  }
});
test("editing pieces is free; incomplete, repeated and duplicate selections are safe", () => {
  let round = createBuildRound("autumn");
  assert.equal(checkBuild(round), round);
  assert.equal(selectPart(round, "missing"), round);
  const tile = round.questions[0].tiles[0];
  round = selectPart(round, tile.id);
  assert.equal(selectPart(round, tile.id), round);
  round = removePart(round, 0);
  assert.equal(round.hearts, 3);
  assert.deepEqual(round.selected, []);
  round = solve(round);
  round = removePart(round, round.selected.length - 1);
  const extra = round.questions[0].tiles.find((t) => !round.questions[0].target.parts.includes(t.text));
  round = selectPart(round, extra.id);
  const wrongSelection = [...round.selected];
  round = checkBuild(round);
  assert.equal(round.hearts, 2);
  assert.deepEqual(round.selected, []);
  round = checkBuild({ ...round, selected: wrongSelection });
  assert.equal(round.hearts, 2);
  assert.equal(round.lastAnswer, "repeated");
  round = { ...round, selected: [] };
  round = checkBuild(solve(round));
  assert.equal(round.status, "answered");
  assert.equal(round.correct, 1);
  assert.equal(checkBuild(round), round);
  assert.equal(removePart(round, 0), round);
});
test("ten built words win; replay starts with fresh hearts and no selected parts", () => {
  let round = createBuildRound("summer");
  for (let i = 0; i < 10; i++) {
    round = solve(round);
    assert.equal(assembledWord(round), round.questions[i].target.word);
    round = checkBuild(round);
    round = nextBuildQuestion(round);
    assert.equal(round.correct, i + 1);
    assert.deepEqual(round.selected, []);
  }
  assert.equal(round.status, "won");
  const fresh = createBuildRound("summer");
  assert.equal(fresh.hearts, 3);
  assert.equal(fresh.correct, 0);
});
test("three distinct incorrect words end the round and block further input", () => {
  let round = createBuildRound("autumn");
  round.questions.sort((a, b) => b.target.parts.length - a.target.parts.length);
  const tiles = round.questions[0].tiles;
  const size = round.questions[0].target.parts.length;
  for (let offset = 0; offset < tiles.length && round.status === "playing"; offset++) {
    round = { ...round, selected: [] };
    for (let i = 0; i < size; i++) round = selectPart(round, tiles[(i + offset) % tiles.length].id);
    if (assembledWord(round) !== round.questions[0].target.word) round = checkBuild(round);
  }
  assert.equal(round.status, "lost");
  assert.equal(round.hearts, 0);
  assert.equal(selectPart(round, tiles[0].id), round);
});
