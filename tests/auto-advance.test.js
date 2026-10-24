import test from 'node:test';
import assert from 'node:assert/strict';
import { createAutoAdvance } from '../src/auto-advance.js';
import { createMathRound, answerMath, nextMath } from '../src/number-bonds.js';
import { createRound, answer, nextQuestion } from '../src/game.js';
import { createBuildRound, selectPart, checkBuild, nextBuildQuestion } from '../src/build-word.js';
import { getBank } from '../src/words.js';

function clock() {
  let id=0;const tasks=new Map();
  return {tasks,setTimer(fn,ms){assert.equal(ms,950);tasks.set(++id,fn);return id;},clearTimer(id){tasks.delete(id);},tick(){const pending=[...tasks.values()];tasks.clear();pending.forEach(fn=>fn());}};
}
test('maths and both phonics games finish automatically after each correct answer', () => {
  for(const type of ['math','reading','building']) {
    let round=type==='math'?createMathRound('recall'):type==='building'?createBuildRound('autumn',Math.random,true):createRound(getBank('year1','autumn',true),Math.random,true);
    const timers=clock();let advances=0;
    const advance=createAutoAdvance({getRound:()=>round,canAdvance:()=>true,advance:()=>{round=type==='math'?nextMath(round):type==='building'?nextBuildQuestion(round):nextQuestion(round);advances++;},...timers});
    const count=round.questions.length;
    for(let i=0;i<count;i++) {
      const q=round.questions[round.index];
      if(type==='math')round=answerMath(round,q.answer);
      else if(type==='reading')round=answer(round,q.target.id);
      else {for(const part of q.target.parts){const tile=q.tiles.find(t=>t.text===part&&!round.selected.includes(t.id));round=selectPart(round,tile.id);}round=checkBuild(round);}
      advance.schedule();advance.schedule();assert.equal(timers.tasks.size,1);
      assert.equal(round.status,'answered');timers.tick();assert.equal(advances,i+1);
    }
    assert.equal(round.status,'won');advance.schedule();assert.equal(timers.tasks.size,0);
  }
});
test('wrong answers wait, pauses resume safely, and navigation cancels stale advances', () => {
  const timers=clock();let round=createMathRound('recall'),active=true,count=0;
  const auto=createAutoAdvance({getRound:()=>round,canAdvance:()=>active,advance:()=>{count++;round=nextMath(round);},...timers});
  round=answerMath(round,(round.questions[0].answer+1)%11);auto.schedule();assert.equal(timers.tasks.size,0);
  round=answerMath(round,round.questions[0].answer);auto.schedule();active=false;timers.tick();assert.equal(count,0);
  auto.schedule();assert.equal(timers.tasks.size,0);active=true;auto.schedule();timers.tick();assert.equal(count,1);
  round=answerMath(round,round.questions[round.index].answer);auto.schedule();auto.cancel();timers.tick();assert.equal(count,1);
  auto.schedule();round=createMathRound();timers.tick();assert.equal(count,1);
});
