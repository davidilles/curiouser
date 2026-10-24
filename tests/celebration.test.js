import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { CELEBRATION_FRIENDS, chooseCelebrationFriend, WONDERLAND_CHANCE, GARDEN_FRIENDS, MATH_CELEBRATION_FRIENDS, chooseMathCelebrationFriend, celebrationMarkup, celebrationStyle } from "../src/celebration.js";

test("18 complete friends include five rarer Wonderland visitors with bundled art", () => {
  assert.equal(CELEBRATION_FRIENDS.length, 18);
  assert.equal(new Set(CELEBRATION_FRIENDS.map((friend) => friend.id)).size, 18);
  assert.deepEqual(CELEBRATION_FRIENDS.filter((friend) => friend.special).map((friend) => friend.id),
    ["cat", "white-rabbit", "caterpillar", "dormouse", "dodo"]);
  for (const friend of CELEBRATION_FRIENDS) {
    assert.ok(existsSync(new URL(`../${friend.image}`, import.meta.url)));
    assert.ok(friend.cell >= 0 && friend.cell < 9);
  }
});

test("Wonderland wins are a 20 percent draw, and consecutive friends never repeat", () => {
  assert.equal(WONDERLAND_CHANCE, .2);
  let calls = 0;
  assert.equal(chooseCelebrationFriend(null, () => calls++ === 0 ? .1999 : 0).special, true);
  calls = 0;
  assert.equal(chooseCelebrationFriend(null, () => calls++ === 0 ? .2 : 0).special, false);
  let seed = 4321;
  const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32);
  let previous = null;
  let special = 0;
  const seen = new Set();
  for (let i = 0; i < 10000; i++) {
    const friend = chooseCelebrationFriend(previous, random);
    assert.notEqual(friend.id, previous);
    previous = friend.id;
    special += Number(friend.special);
    seen.add(friend.id);
  }
  assert.equal(seen.size, 18);
  assert.ok(special > 1800 && special < 2200);
});


test("garden animals appear only in maths, with familiar animals and no consecutive repeats", () => {
  assert.equal(GARDEN_FRIENDS.length,4);
  assert.equal(MATH_CELEBRATION_FRIENDS.length,22);
  const gardenIds=new Set(GARDEN_FRIENDS.map(f=>f.id));
  assert.ok(CELEBRATION_FRIENDS.every(f=>!gardenIds.has(f.id)));
  let seed=9876;
  const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
  let previous=null;const seen=new Set();
  for(let i=0;i<5000;i++) {
    const friend=chooseMathCelebrationFriend(previous,random);
    if(i===0)assert.equal(friend.gardenOnly,true);
    assert.notEqual(friend.id,previous);previous=friend.id;seen.add(friend.id);
    assert.ok(!gardenIds.has(chooseCelebrationFriend(null,random).id));
  }
  assert.equal(seen.size,22);
  for(const friend of GARDEN_FRIENDS) {
    assert.ok(existsSync(new URL(`../${friend.image}`,import.meta.url)));
    assert.equal(friend.bounds.length,4);
    assert.equal(friend.bounds[2],friend.bounds[3]);
    assert.doesNotMatch(celebrationStyle(friend),/NaN|Infinity/);
    assert.match(celebrationMarkup(friend),/class="animal-speech"/);
    assert.match(celebrationMarkup(friend),/Well Done!/);
  }
});
