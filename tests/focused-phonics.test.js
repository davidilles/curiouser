import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { getBank, EXTRA_WORD_IDS } from '../src/words.js';
import { createRound } from '../src/game.js';
import { createBuildRound, getBuildBank, selectPart, checkBuild, nextBuildQuestion } from '../src/build-word.js';

test('extra practice adds the nine illustrated words only when enabled, in either game', () => {
  for(const term of ['autumn','spring','summer']) {
    const normal=getBank('year1',term),extra=getBank('year1',term,true);
    assert.equal(extra.length,normal.length+9);
    assert.equal(extra,getBuildBank(term,true));assert.equal(normal,getBuildBank(term));
    for(const id of EXTRA_WORD_IDS) {
      assert.ok(!normal.some(w=>w.id===id));const word=extra.find(w=>w.id===id);assert.ok(word);
      assert.ok(existsSync(new URL('../'+word.image,import.meta.url)));
    }
    assert.equal(getBank('year1',term,false),normal);
  }
});
test('extra practice gives each target spelling two questions plus four general words', () => {
  for(const term of ['autumn','spring','summer'])for(let n=0;n<50;n++) {
    const bank=getBank('year1',term,true),round=createRound(bank,Math.random,true);
    assert.equal(round.questions.length,10);assert.equal(new Set(round.questions.map(q=>q.target.id)).size,10);
    for(const sound of ['er','ear','ur'])assert.equal(round.questions.filter(q=>q.target.practiceSound===sound).length,2);
    assert.equal(round.questions.filter(q=>!q.target.practiceSound).length,4);
    for(const q of round.questions) {
      assert.equal(new Set(q.options.map(w=>w.id)).size,4);
      assert.ok(q.options.filter(w=>w.id!==q.target.id).every(w=>!q.target.related.includes(w.id)));
      if(q.target.practiceSound==='ear')assert.equal(q.target.focus,'ear-near');
    }
  }
});
test('all terms can complete an extra-practice building round with unique usable tiles', () => {
  for(const term of ['autumn','spring','summer']) {
    let r=createBuildRound(term,Math.random,true);
    for(const sound of ['er','ear','ur'])assert.equal(r.questions.filter(q=>q.target.practiceSound===sound).length,2);
    while(r.status!=='won') {
      const q=r.questions[r.index];
      for(const part of q.target.parts) {
        const tile=q.tiles.find(t=>t.text===part&&!r.selected.includes(t.id));r=selectPart(r,tile.id);
      }
      r=checkBuild(r);assert.equal(r.status,'answered');r=nextBuildQuestion(r);
    }
    assert.equal(r.correct,10);assert.equal(r.hearts,3);
  }
});
