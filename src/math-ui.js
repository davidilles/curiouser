import { MATH_CELEBRATION_FRIENDS, chooseMathCelebrationFriend, celebrationMarkup } from './celebration.js';
import { createMathRound, answerMath, helpMath, nextMath, MATH_ROUND_LENGTH } from './number-bonds.js';
let root, state, player, say, onAnswered;
let rosesVisible = true;
let celebrationAnimal = null;
let previousCelebrationId = null;
const KEY = 'curiouser-number-bonds-v1';
const rose = (white) => `<span class="garden-rose ${white ? 'white' : 'red'}"><svg viewBox="0 0 50 64" aria-hidden="true"><path d="M25 28v34m0-10c-12 0-16-8-16-8 10-2 16 4 16 4m0-8c12 0 16-8 16-8-10-2-16 4-16 4" fill="#468166" stroke="#286b58" stroke-width="2"/><g fill="currentColor" stroke="#773e46" stroke-width="1.5"><circle cx="25" cy="12" r="10"/><circle cx="15" cy="22" r="10"/><circle cx="35" cy="22" r="10"/><circle cx="25" cy="30" r="10"/><circle cx="25" cy="22" r="9"/></g><circle cx="25" cy="22" r="4" fill="#d9ac58"/></svg></span>`;
const garden = (a, subtract = false) => `<div class="rose-garden" role="img" aria-label="${subtract ? `Ten roses: ${a} crossed out and ${10-a} remaining` : `Ten roses: ${a} red and ${10-a} white, in two rows of five`}">${Array.from({length:10},(_,i)=>subtract && i<a ? rose(false).replace('garden-rose red','garden-rose red taken-away') : rose(i>=a)).join('')}</div>`;
function focus(selector='h1') { root.querySelector(selector)?.focus({preventScroll:true}); }
export function getMathRound() { return state; }
export function mathProgressSummary() {
  try {
    const p=JSON.parse(localStorage.getItem(KEY));
    // Keep an older saved summary honest until a ten-question round replaces it.
    const total = p?.version === 1 ? 12 : p?.version === 2 ? MATH_ROUND_LENGTH : 0;
    if(total && Number.isInteger(p.independent) && p.independent>=0 && p.independent<=total)
      return `Last maths round: ${p.independent} of ${total} first-time answers without help.`;
  } catch { /* Storage is optional. */ }
  return 'No completed maths round saved on this device yet.';
}
export function clearMathProgress() {
  try { localStorage.removeItem(KEY); } catch { /* Storage is optional. */ }
}
export function showMath(container, mode, soundPlayer, announce, scheduleAdvance) {
  root=container;player=soundPlayer;say=announce;onAnswered=scheduleAdvance;
  // Preserve old links while the main card now opens a question immediately.
  if(mode==='recall')rosesVisible=false;
  if(mode==='practice' || mode==='learn')rosesVisible=true;
  state=createMathRound(rosesVisible?'practice':'recall');
  celebrationAnimal=null;
  if(typeof Image !== 'undefined')new Set(MATH_CELEBRATION_FRIENDS.map(friend=>friend.image)).forEach(src=>{const image=new Image();image.src=src;});
  document.title='The Queen’s Ten · Curiouser';render();
}
export function toggleMathRoses(visible) {
  rosesVisible=visible;
  if(state?.status==='playing') {
    state={...(visible?helpMath(state):state),mode:visible?'practice':'recall'};
    // Hiding an already seen clue never counts this answer as independent.
    render();focus('input[name="show-roses"]');
  }
}
function render() {
  if(state.status==='won') {
    if(!celebrationAnimal) {
      celebrationAnimal=chooseMathCelebrationFriend(previousCelebrationId, Math.random, state.mistakeCount === 0);
      previousCelebrationId=celebrationAnimal.id;
    }
    root.innerHTML=`<section class="result math-result result-won" aria-labelledby="result-title">
      ${celebrationMarkup(celebrationAnimal)}
      <span class="eyebrow">ALL ${MATH_ROUND_LENGTH} CHALLENGES COMPLETE!</span>
      <p>${celebrationAnimal.unicorn ? `${celebrationAnimal.name[0].toUpperCase() + celebrationAnimal.name.slice(1)} came to say well done!` : 'The Queen’s garden is blooming.'}</p>
      <p class="math-reassurance">${state.independent} of ${MATH_ROUND_LENGTH} first-time answers without help.</p>
      <div class="math-controls"><button class="button primary" data-math="again">Play again</button><a class="button secondary" href="#">All games</a></div></section>`;return;
  }
  const q=state.questions[state.index],answered=state.status==='answered';
  const part=(n)=>n===null?`<span class="missing-number ${answered?'solved':''}" aria-label="${answered?q.answer:'missing number'}">${answered?q.answer:'?'}</span>`:n;
  root.innerHTML=`<a class="back-link" href="#">All games</a><div class="math-compact-heading"><img src="./assets/pictures/crown.png" alt=""><h1 tabindex="-1">The Queen’s Ten</h1></div>
    <section class="math-board simple" aria-label="Find the missing number">
      <div class="math-round-line"><span>${state.index+1} / ${state.questions.length}</span><label class="roses-toggle"><input type="checkbox" name="show-roses" ${rosesVisible?'checked':''} ${answered?'disabled':''}><span>Show roses</span></label></div>
      <div class="math-equation" role="group" aria-label="Number sentence">${part(q.left)} ${q.op} ${part(q.right)} = ${part(q.result)}</div>
      ${rosesVisible?garden(q.op==='−' ? (q.right??q.answer) : q.a, q.op==='−'):''}
      <div class="number-pad" role="group" aria-label="Choose the missing number">${Array.from({length:11},(_,n)=>`<button class="number-key ${answered&&n===q.answer?'correct':''}" data-number="${n}" ${answered||state.mistakes.includes(n)?'disabled':''}>${n}</button>`).join('')}</div>
      <p id="math-feedback" tabindex="-1" class="math-feedback ${answered?'success':''}">${answered?'Lovely! ✦':state.lastAnswer==='wrong'?'Have another go.':'Tap the missing number.'}</p>
    </section>`;
}
export function handleMathClick(button) {
  if(button.dataset.number!==undefined && state) {
    const next=answerMath(state,Number(button.dataset.number));if(next===state)return true;
    state=next;
    if(state.lastAnswer==='wrong')rosesVisible=true;
    player.play(state.lastAnswer==='correct'?'correct':'incorrect');render();
    say(root.querySelector('#math-feedback').textContent);
    focus(state.status==='answered'?'#math-feedback':'.number-key:not(:disabled)');
    if(state.status==='answered')onAnswered();
    return true;
  }
  if(button.dataset.math==='again') {
    celebrationAnimal=null;state=createMathRound(rosesVisible?'practice':'recall');render();focus();return true;
  }
  return false;
}
export function advanceMath() {
  if(state?.status!=='answered')return;
  state=nextMath(state);
  // A mistake can reveal help for that question without changing the chosen mode.
  rosesVisible=state.mode==='practice';
  if(state.status==='won') {
    try { localStorage.setItem(KEY,JSON.stringify({version:2,mode:state.mode,independent:state.independent})); }
    catch { /* Play works when storage is unavailable. */ }
    say('Well done! The Queen’s garden is blooming.');
  }
  render();focus();
}
