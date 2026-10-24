import test from 'node:test';
import assert from 'node:assert/strict';
import { BONDS, makeFact, createMathRound, answerMath, nextMath, helpMath } from '../src/number-bonds.js';

test('all missing-number forms are correct, including 0, 10 and doubles', () => {
  for(let a=0;a<=10;a++)for(let form=0;form<4;form++) {
    const q=makeFact(a,form), l=q.left??q.answer, r=q.right??q.answer, result=q.result??q.answer;
    assert.equal(q.op==='+'?l+r:l-r,result);
    assert.ok(q.answer>=0&&q.answer<=10);
  }
});
test('ten challenges cover all six bonds with five additions and five subtractions', () => {
  const seen=new Set();
  for(let run=0;run<100;run++) {
    const r=createMathRound('recall');assert.equal(r.questions.length,10);
    assert.equal(r.questions.filter(q=>q.op==='+').length,5);
    assert.equal(r.questions.filter(q=>q.op==='−').length,5);
    assert.equal(new Set(r.questions.map(q=>q.id)).size,10);
    for(const [a,b] of BONDS) {
      const pair=r.questions.filter(q=>Math.min(q.a,q.b)===a);
      assert.ok(pair.length>=1 && pair.length<=2);
      if(pair.length===2)assert.deepEqual(new Set(pair.map(q=>q.op)),new Set(['+','−']));
    }
    r.questions.forEach(q=>seen.add(q.id));
  }
  assert.equal(seen.size,44);
});
test('mistakes allow retries without increasing the ten-challenge round', () => {
  let r=createMathRound('recall');const q=r.questions[0],wrong=(q.answer+1)%11;
  assert.equal(answerMath(r,-1),r);assert.equal(answerMath(r,1.5),r);
  r=answerMath(r,wrong);assert.equal(r.status,'playing');assert.equal(r.helped,true);
  assert.equal(answerMath(r,wrong),r);
  r=answerMath(r,q.answer);assert.equal(r.questions.length,10);assert.equal(r.independent,0);assert.equal(r.supported,1);
  assert.equal(answerMath(r,q.answer),r);
  r=nextMath(r);
  while(r.status!=='won') {
    const current=r.questions[r.index];
    r=answerMath(r,(current.answer+1)%11);
    assert.equal(r.questions.length,10);
    r=nextMath(answerMath(r,current.answer));
  }
  assert.equal(r.questions.length,10);assert.equal(r.independent,0);assert.equal(r.supported,10);
  assert.equal(nextMath(r),r);
});
test('recall, visual help and practice produce honest independent-answer counts', () => {
  for(const mode of ['practice','recall']) {
    let r=createMathRound(mode);
    r=helpMath(r);
    while(r.status!=='won')r=nextMath(answerMath(r,r.questions[r.index].answer));
    assert.equal(r.independent,mode==='recall'?9:0);
    assert.equal(r.independent+r.supported,10);
  }
});
