import test from 'node:test';
import assert from 'node:assert/strict';
import { showMath, getMathRound, toggleMathRoses, handleMathClick, advanceMath, clearMathProgress, mathProgressSummary } from '../src/math-ui.js';

test('maths opens directly into a question and correct clicks request automatic progression', () => {
  const oldDoc=globalThis.document,oldStorage=globalThis.localStorage;
  const saved=new Map();
  globalThis.document={title:''};
  globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)};
  const root={innerHTML:'',querySelector(selector){return {focus(){},get textContent(){return selector==='#math-feedback'?'Feedback':'';}};}};
  let advances=0;
  try {
    showMath(root,undefined,{play(){}},()=>{},()=>advances++);
    assert.match(root.innerHTML,/data-number="10"/);assert.match(root.innerHTML,/name="show-roses" checked/);
    assert.doesNotMatch(root.innerHTML,/Meet the pairs|DISCOVER|data-math="next"/);
    toggleMathRoses(false);assert.doesNotMatch(root.innerHTML,/class="rose-garden"/);
    assert.equal(getMathRound().helped,true,'hiding an already visible clue is still supported');
    while(getMathRound().status!=='won') {
      const q=getMathRound().questions[getMathRound().index];
      handleMathClick({dataset:{number:String(q.answer)}});
      const before=advances;handleMathClick({dataset:{number:String(q.answer)}});
      assert.equal(advances,before,'repeated clicks cannot schedule extra advances');
      assert.doesNotMatch(root.innerHTML,/data-math="next"/);
      advanceMath();
    }
    assert.equal(advances,10);assert.match(root.innerHTML,/Well Done!/);
    assert.match(root.innerHTML,/class="animal-speech"/);
    assert.match(root.innerHTML,/data-garden-only="true"/);
    assert.match(root.innerHTML,/ALL 10 CHALLENGES COMPLETE/);
    const firstFriend=root.innerHTML.match(/data-animal="([^"]+)"/)[1];
    handleMathClick({dataset:{math:'again'}});
    assert.doesNotMatch(root.innerHTML,/class="animal-speech"/);
    while(getMathRound().status!=='won') {
      const q=getMathRound().questions[getMathRound().index];
      handleMathClick({dataset:{number:String(q.answer)}});advanceMath();
    }
    assert.equal(advances,20);
    assert.notEqual(root.innerHTML.match(/data-animal="([^"]+)"/)[1],firstFriend);
    assert.match(mathProgressSummary(),/10 of 10/);
    saved.set('curiouser-number-bonds-v1',JSON.stringify({version:1,independent:11}));
    assert.match(mathProgressSummary(),/11 of 12/,'old twelve-question records keep their denominator');clearMathProgress();assert.match(mathProgressSummary(),/No completed/);
  } finally {
    if(oldDoc===undefined)delete globalThis.document;else globalThis.document=oldDoc;
    if(oldStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=oldStorage;
  }
});
