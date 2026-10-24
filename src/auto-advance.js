// Shared success delay for all games. A timer belongs to one answered question;
// navigation, a hidden tab or the grown-ups guide must never skip a question.
export function createAutoAdvance({ getRound, canAdvance, advance, delay = 950,
  setTimer = setTimeout, clearTimer = clearTimeout }) {
  let timer = null;
  function cancel() {
    clearTimer(timer);
    timer = null;
  }
  function schedule() {
    cancel();
    const answeredRound = getRound();
    if (answeredRound?.status !== 'answered' || !canAdvance()) return;
    timer = setTimer(() => {
      timer = null;
      if (getRound() === answeredRound && answeredRound.status === 'answered' && canAdvance()) advance();
    }, delay);
  }
  return { cancel, schedule };
}
