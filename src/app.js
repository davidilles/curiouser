import { TERMS, LEVELS, getBank } from "./words.js";
import { createRound, answer, nextQuestion } from "./game.js";
import { createSoundPlayer } from "./audio.js";
import { BUILD_TERMS, getBuildBank, createBuildRound, selectPart, removePart, checkBuild, nextBuildQuestion } from "./build-word.js";
import { wordPicture } from "./pictures.js";
import { CELEBRATION_FRIENDS, chooseCelebrationFriend, celebrationStyle } from "./celebration.js";

const main = document.querySelector("#main");
const dialog = document.querySelector("#grownups-dialog");
const soundButton = document.querySelector("#sound-button");
const soundNotice = document.querySelector("#sound-notice");
const announcer = document.createElement("div");
announcer.className = "sr-only";
announcer.setAttribute("role", "status");
announcer.setAttribute("aria-live", "polite");
document.body.append(announcer);

let term = "autumn";
let gameType = "reading";
const setupHash = () => gameType === "building" ? "#build-word" : "#phonics";
const gameName = () => gameType === "building" ? "The Hatter’s Word Workshop" : "The Reading Rabbit";
let round = null;
let sound = false;
const soundPlayer = createSoundPlayer({
  onStateChange(enabled, pending) {
    sound = enabled;
    updateSoundButton(pending);
  },
  onError(error) {
    soundNotice.hidden = false;
    soundNotice.querySelector("p").textContent =
      error?.name === "NotAllowedError"
        ? "Sound couldn’t start. Tap the speaker to try again."
        : "Sound couldn’t load. Check your connection, then tap the speaker to retry.";
  },
});
let view = "home";
let advanceTimer = null;
const CELEBRATION_MS = 950;
let celebrationAnimal = null;
let previousCelebrationAnimal = null;

function chooseCelebrationAnimal() {
  const animal = chooseCelebrationFriend(previousCelebrationAnimal);
  previousCelebrationAnimal = animal.id;
  return animal;
}

function cancelAdvance() {
  window.clearTimeout(advanceTimer);
  advanceTimer = null;
}

function scheduleAdvance() {
  cancelAdvance();
  if (
    view !== "game" ||
    round?.status !== "answered" ||
    dialog.open ||
    document.hidden
  )
    return;
  const celebratedRound = round;
  advanceTimer = window.setTimeout(() => {
    advanceTimer = null;
    if (
      view === "game" &&
      round === celebratedRound &&
      !dialog.open &&
      !document.hidden
    )
      goNext();
  }, CELEBRATION_MS);
}

const icon = (name) => {
  const paths = {
    volume:
      '<path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    mute: '<path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="m16 9 5 6m0-6-5 6"/>',
    heart:
      '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ""}</svg>`;
};

const picture = (name, className = "", alt = "") =>
  `<img src="./assets/pictures/${name}.png" class="${className}" alt="${alt}" width="128" height="128" draggable="false">`;
const termName = () => TERMS.find((item) => item.id === term).name;
const announce = (message) => {
  announcer.textContent = message;
};
const focusHeading = () =>
  main.querySelector("h1")?.focus({ preventScroll: true });

function setView(next) {
  if (next !== "game") cancelAdvance();
  view = next;
  document.body.dataset.view = next;
  document.body.dataset.game = gameType;
  document
    .querySelector("#games-link")
    .setAttribute("aria-current", next === "home" ? "page" : "false");
}

function renderHome() {
  setView("home");
  document.title = "Curiouser · A little world of learning";
  main.innerHTML = `
    <section class="welcome" aria-labelledby="welcome-title">
      <div class="welcome-copy">
        <div class="eyebrow"><span class="tiny-diamond" aria-hidden="true">◆</span> A LITTLE WORLD OF LEARNING</div>
        <h1 id="welcome-title" tabindex="-1">Curiouser <span class="ampersand">&</span><br><em>curiouser.</em></h1>
        <p>Follow your curiosity.<br>There’s a little adventure in every game.</p>
      </div>
      <div class="welcome-art">
        <span class="floating-suit suit-one" aria-hidden="true">✦</span>
        <img class="reading-friends" src="./assets/reading-friends-alice.png" width="500" height="360" alt="A little fox and white rabbit reading Alice in Wonderland together">
        <span class="floating-suit suit-two" aria-hidden="true">♢</span>
      </div>
    </section>
    <section class="games-section" aria-labelledby="games-title">
      <div class="section-heading"><h2 id="games-title">Choose your adventure</h2><span>Small games. Wonderful discoveries.</span></div>
      <div class="games-grid">
        <article class="game-card">
          <div class="game-card-art" aria-hidden="true">
            <span class="card-corner">A<span>♥</span></span>
            <div class="letter-tiles"><span>a</span><span>b</span><span>c</span></div>
            ${picture("rabbit", "card-rabbit")}
            ${picture("book", "card-book")}
            <span class="art-spark spark-one">✧</span><span class="art-spark spark-two">✦</span>
            <span class="art-caption">READ · MATCH · DISCOVER</span>
          </div>
          <div class="game-card-copy">
            <div class="card-tags"><span class="pill green">PHONICS</span><span class="age-label">Year 1 · Ages 5–6</span></div>
            <h3>The Reading <br>Rabbit</h3>
            <p>A word, a few pictures and a little curiosity.<br class="desktop-only"> Can you find the perfect match?</p>
            <div class="game-details"><span>${icon("heart")} 3 hearts</span><span class="detail-divider"></span><span>10 words per round</span></div>
            <a class="button primary" href="#phonics">Let’s play ${icon("play")}</a>
          </div>
        </article>
        <article class="game-card builder-card">
          <div class="game-card-art" aria-hidden="true">
            <span class="card-corner">H<span>♦</span></span>
            <div class="letter-tiles"><span>h</span><span>a</span><span>t</span></div>
            ${picture("hat", "card-hatter-hat")}
            ${picture("teacup", "card-hatter-cup")}
            <span class="hatter-ticket">10/6</span>
            <span class="art-spark spark-one">✧</span>
            <span class="art-caption">A CURIOUS JUMBLE, INDEED</span>
          </div>
          <div class="game-card-copy">
            <div class="card-tags"><span class="pill green">WORD BUILDING</span><span class="age-label">Year 1 · Ages 5–6</span></div>
            <h3>The Hatter’s<br>Word Workshop</h3>
            <p>The Hatter has muddled his words at the tea party.<br>Can you put the right pieces together?</p>
            <div class="game-details"><span>${icon("heart")} 3 hearts</span><span class="detail-divider"></span><span>10 words per round</span></div>
            <a class="button primary" href="#build-word">Join the tea party ${icon("play")}</a>
          </div>
        </article>
      </div>
    </section>
    <div class="home-note">${picture("key")}<p>There’s no rush in this rabbit hole.<br><strong>Take your time. Have a go. Let your curiosity grow.</strong></p></div>`;
}

function renderSetup() {
  setView("setup");
  document.title = `Choose your term · ${gameName()} · Curiouser`;
  main.innerHTML = `
    <a class="back-link" href="#">All adventures</a>
    <section class="setup" aria-labelledby="setup-title">
      <div class="setup-header">${picture(gameType === "building" ? "hat" : "rabbit", "setup-rabbit")}<span class="eyebrow">${gameName().toUpperCase()} · YEAR 1</span>
        <h1 id="setup-title" tabindex="-1">${gameType === "building" ? "A curious jumble awaits." : "A term for every adventure."}</h1>
        <p>${gameType === "building" ? "Take a seat at the Hatter’s tea party. Build the picture’s word—and leave the extra pieces behind!" : "Which term are you in? Let’s find your words."}</p>
      </div>
      <fieldset class="term-fieldset"><legend class="sr-only">Choose your Year 1 term</legend>
        <div class="term-grid">${TERMS.map(
          (item) => `
          <label class="term-card ${item.colour}">
            <input type="radio" name="term" value="${item.id}" ${term === item.id ? "checked" : ""}>
            <span class="radio-indicator">${icon("check")}</span>
            ${picture(item.image, "term-picture")}
            <span class="term-name">${item.name}</span>
            <span class="term-description">${gameType === "building" ? BUILD_TERMS[item.id] : LEVELS[`year1-${item.id}`].description}</span>
            <span class="term-count">${(gameType === "building" ? getBuildBank(item.id) : getBank("year1", item.id)).length} words to explore</span>
          </label>`,
        ).join("")}</div>
      </fieldset>
      <div class="setup-bottom"><p><span aria-hidden="true">♥ ♥ ♥</span> Three hearts. Ten words. All the time you need.</p>
        <button type="button" class="button primary" data-action="start">${gameType === "building" ? "Let’s build" : "Let’s play"} ${icon("play")}</button>
      </div>
      <button class="text-button setup-help" type="button" data-action="guide">Need a hand choosing? A note for grown-ups</button>
    </section>`;
}

function heartMarkup() {
  return `<div class="hearts" role="img" aria-label="${round.hearts} of 3 hearts remaining">${Array.from({ length: 3 }, (_, i) => `<span class="heart ${i < round.hearts ? "full" : "empty"}">${icon("heart")}</span>`).join("")}</div>`;
}

function renderGame() {
  if (round.status === "lost" || round.status === "won") return renderResult();
  if (gameType === "building") return renderBuildGame();
  setView("game");
  document.title = "Read & match · The Reading Rabbit · Curiouser";
  const question = round.questions[round.index];
  const answered = round.status === "answered";
  const wrong = round.lastAnswer === "wrong";
  const feedback = answered
    ? "Wonderful! You found it."
    : wrong
      ? "Not quite. Have another little look."
      : "Take your time. You’ve got this.";
  main.innerHTML = `
    <div class="game-topbar"><a class="back-link" href="${setupHash()}">Choose a term</a><span class="game-level">Year 1 <span>·</span> ${termName()}</span></div>
    <section class="play-area" aria-label="The Reading Rabbit phonics game">
      <div class="round-topline"><span class="round-count">Word <strong>${round.index + 1}</strong> of ${round.questions.length}</span>${heartMarkup()}</div>
      <div class="progress-track" role="progressbar" aria-label="Words found" aria-valuemin="0" aria-valuemax="${round.questions.length}" aria-valuenow="${round.correct}"><span style="width:${(round.correct / round.questions.length) * 100}%"></span></div>
      <div class="word-area"><span class="eyebrow">READ THE WORD. FIND THE PICTURE.</span><h1 class="target-word" tabindex="-1">${question.target.word}</h1><p>Which picture matches?</p></div>
      <div class="picture-grid" aria-label="Picture choices">${question.options
        .map((option, index) => {
          const incorrect = round.tried.includes(option.id);
          const correct = answered && option.id === question.target.id;
          return `<button class="picture-option option-${index} ${incorrect ? "incorrect" : ""} ${correct ? "correct" : ""}" type="button" data-answer="${option.id}" aria-label="${option.word}${incorrect ? ", already tried" : ""}" ${incorrect || answered ? "disabled" : ""}>
          ${wordPicture(option)}
          <span class="choice-marker" aria-hidden="true">${incorrect ? icon("close") : correct ? icon("check") : index + 1}</span>
          ${correct ? '<span class="success-sparkles" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></span>' : ""}
        </button>`;
        })
        .join("")}</div>
      <div class="game-feedback ${answered ? "success" : wrong ? "try-again" : ""}"><p id="feedback" tabindex="-1">${answered ? '<span aria-hidden="true">✦</span> ' : ""}${feedback}</p>
      <span class="keyboard-tip">You can also use the 1, 2, 3 and 4 keys.</span></div>
    </section>`;
}

const pieceLabel = (text) => text.replace("_", "…");

function buildSlots(question, answered) {
  const tileAt = (i) => question.tiles.find((tile) => tile.id === round.selected[i]);
  const slot = (i, text = tileAt(i)?.text) => text
    ? `<button type="button" class="word-slot filled" data-remove="${i}" aria-label="Remove ${pieceLabel(tileAt(i).text)} from position ${i + 1}" ${answered ? "disabled" : ""}>${pieceLabel(text)}</button>`
    : `<span class="word-slot empty" aria-label="Empty position ${i + 1}"><span aria-hidden="true">·</span></span>`;
  let result = "";
  for (let i = 0; i < question.target.parts.length; i++) {
    const tile = tileAt(i);
    if (tile?.text.includes("_") && i + 1 < question.target.parts.length) {
      const [start, end] = tile.text.split("_");
      result += `<span class="split-frame" role="group" aria-label="Linked ${pieceLabel(tile.text)} piece">${slot(i, start)}${slot(i + 1)}${slot(i, end)}</span>`;
      i++;
    } else result += slot(i);
  }
  return result;
}

function renderBuildGame() {
  setView("game");
  document.title = "The Hatter’s Word Workshop · Curiouser";
  const question = round.questions[round.index];
  const answered = round.status === "answered";
  const full = round.selected.length === question.target.parts.length;
  const feedback = answered ? "Wonderful! You built it. Hats off to you!" : round.lastAnswer === "wrong"
    ? "Not quite. Let’s try those pieces again."
    : round.lastAnswer === "repeated" ? "You’ve tried that word. Have another go with different pieces."
    : "Tap the pieces in order. Some pieces are extras!";
  main.innerHTML = `
    <div class="game-topbar"><a class="back-link" href="#build-word">Choose a term</a><span class="game-level">The Hatter’s Workshop <span>·</span> ${termName()}</span></div>
    <section class="play-area build-area" aria-labelledby="build-title">
      <div class="round-topline"><span class="round-count">Word <strong>${round.index + 1}</strong> of ${round.questions.length}</span>${heartMarkup()}</div>
      <div class="progress-track" role="progressbar" aria-label="Words built" aria-valuemin="0" aria-valuemax="${round.questions.length}" aria-valuenow="${round.correct}"><span style="width:${round.correct / round.questions.length * 100}%"></span></div>
      <div class="build-prompt"><h1 id="build-title" tabindex="-1">Build this word</h1>${wordPicture(question.target, question.target.word)}</div>
      <div class="build-workspace">
        <div class="word-slots ${answered ? "built-correct" : ""}" role="group" aria-label="Your word">${buildSlots(question, answered)}</div>
        <p class="build-hint">${question.target.parts.some((part) => part.includes("_")) ? "Linked letters are one piece. " : ""}Tap a piece above to put it back.</p>
        <div class="part-tray" role="group" aria-label="Word parts">${question.tiles.map((tile) => `<button type="button" class="part-tile ${tile.text.includes("_") ? "linked-piece" : ""}" data-part="${tile.id}" data-piece="${tile.text}" aria-label="Add ${pieceLabel(tile.text)}" ${round.selected.includes(tile.id) || answered || full ? "disabled" : ""}>${pieceLabel(tile.text)}</button>`).join("")}</div>
      </div>
      <div class="build-bottom">
        <p id="feedback" class="build-feedback ${answered ? "success" : ""}" tabindex="-1">${feedback}</p>
        <div class="build-controls"><button type="button" class="button amber" data-action="clear-build" ${!round.selected.length || answered ? "disabled" : ""}>Reset word</button></div>
      </div>
    </section>`;
}

function editBuild(updated) {
  if (view !== "game" || gameType !== "building" || round.status !== "playing" || updated === round) return;
  round = updated;
  if (round.selected.length === round.questions[round.index].target.parts.length) {
    submitBuild();
    return;
  }
  renderGame();
  main.querySelector('[data-part]:not(:disabled)')?.focus({ preventScroll: true });
}

function submitBuild() {
  if (view !== "game" || gameType !== "building") return;
  const updated = checkBuild(round);
  if (updated === round) return;
  round = updated;
  soundPlayer.play(round.lastAnswer === "correct" ? "correct" : "incorrect");
  renderGame();
  if (round.status === "lost") {
    announce(`You built ${round.correct} words. You can try again.`);
  } else {
    const feedback = main.querySelector("#feedback");
    announce(feedback.textContent);
    feedback.focus({ preventScroll: true });
    if (round.status === "answered") scheduleAdvance();
  }
}

function renderResult() {
  setView("result");
  const won = round.status === "won";
  const missed = round.questions[round.index].target;
  if (won && !celebrationAnimal) celebrationAnimal = chooseCelebrationAnimal();
  document.title = `${won ? "Wonderful reading!" : "Try another adventure"} · Curiouser`;
  main.innerHTML = `
    <section class="result ${won ? "result-won" : ""}" aria-labelledby="result-title">
      ${won ? `<div class="animal-celebration ${celebrationAnimal.special ? "wonderland-visit" : ""}">
        <h1 id="result-title" class="animal-speech" tabindex="-1">Well Done!</h1>
        <div class="animal-entrance"><span class="celebration-animal" style="${celebrationStyle(celebrationAnimal)}" data-animal="${celebrationAnimal.id}" data-special="${celebrationAnimal.special}" role="img" aria-label="${celebrationAnimal.name}, celebrating with its whole body visible"></span><span class="animal-shadow" aria-hidden="true"></span></div>
        <span class="celebration-star star-left" aria-hidden="true">✦</span><span class="celebration-star star-right" aria-hidden="true">✧</span>
      </div>` : `<div class="result-art">${picture("rabbit")}</div>`}
      <span class="eyebrow">${won ? "ALL 10 WORDS FOUND!" : "GAME OVER · ANOTHER TRY AWAITS"}</span>
      ${!won ? '<h1 id="result-title" tabindex="-1">Let’s give it another go.</h1>' : ""}
      <p>${won ? (gameType === "building" ? "A splendid collection of words. The Hatter is delighted!" : "A whole little adventure, one word at a time.") : "Every little try helps your reading grow."}</p>
      <div class="result-stats"><div><strong>${round.correct}<span> / ${round.questions.length}</span></strong><span>words found</span></div><div>${heartMarkup()}<span>hearts remaining</span></div></div>
      ${!won ? `<div class="missed-word">${wordPicture(missed, missed.word)}<span>${gameType === "building" ? "This word is" : "This picture matches"} <strong class="reading-font">${missed.word}</strong>.</span></div>` : `<p class="result-cheer">${celebrationAnimal.special ? `${celebrationAnimal.name[0].toUpperCase() + celebrationAnimal.name.slice(1)} came to say well done!` : "Another adventure, another surprise friend!"}</p>`}
      <div class="result-actions"><button type="button" class="button primary" data-action="again">${won ? "Play again" : "Try again"} ${icon("play")}</button><a class="button secondary" href="${setupHash()}">Choose a term</a></div>
      <a class="text-button" href="#">Back to all adventures</a>
    </section>`;
  focusHeading();
}

function startRound() {
  cancelAdvance();
  soundPlayer.stop();
  celebrationAnimal = null;
  // Load the full-body friend sheet while the child plays the round.
  new Set(CELEBRATION_FRIENDS.map((friend) => friend.image)).forEach((src) => {
    const friends = new Image();
    friends.src = src;
  });
  round = gameType === "building" ? createBuildRound(term) : createRound(getBank("year1", term));
  // Preload just this round's pictures rather than the entire collection.
  new Set(
    round.questions.flatMap((question) =>
      gameType === "building" ? [question.target.image] : question.options.map((item) => item.image),
    ),
  ).forEach((src) => {
    const img = new Image();
    img.src = src;
  });
  renderGame();
  focusHeading();
}

function submitAnswer(id) {
  if (view !== "game") return;
  const updated = answer(round, id);
  if (updated === round) return;
  round = updated;
  soundPlayer.play(round.lastAnswer === "correct" ? "correct" : "incorrect");
  renderGame();
  if (round.status === "answered") {
    announce("Wonderful! You found it.");
    main.querySelector("#feedback")?.focus({ preventScroll: true });
    scheduleAdvance();
  } else if (round.status === "lost") {
    announce(`Game over. You found ${round.correct} words. You can try again.`);
  } else {
    announce(
      `Not quite. ${round.hearts} ${round.hearts === 1 ? "heart" : "hearts"} left. Try another picture.`,
    );
    main
      .querySelector("[data-answer]:not(:disabled)")
      ?.focus({ preventScroll: true });
  }
}

function goNext() {
  if (view !== "game" || round?.status !== "answered") return;
  const updated = gameType === "building" ? nextBuildQuestion(round) : nextQuestion(round);
  if (updated === round) return;
  round = updated;
  renderGame();
  focusHeading();
  if (round.status === "won")
    announce(`Adventure complete. You found all ${round.correct} words!`);
}

function route() {
  cancelAdvance();
  soundPlayer.stop();
  const hash = location.hash.slice(1);
  if (hash === "phonics" || hash === "build-word") {
    gameType = hash === "build-word" ? "building" : "reading";
    renderSetup();
  } else if (/^build\/(autumn|spring|summer)$/.test(hash)) {
    gameType = "building";
    term = hash.split("/")[1];
    startRound();
  }
  else if (/^play\/(autumn|spring|summer)$/.test(hash)) {
    gameType = "reading";
    term = hash.split("/")[1];
    startRound();
  } else renderHome();
  window.scrollTo({ top: 0, behavior: "instant" });
  focusHeading();
}

function showGuide() {
  cancelAdvance();
  if (!dialog.open) dialog.showModal();
}
dialog.addEventListener("close", scheduleAdvance);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAdvance();
    soundPlayer.stop();
  } else scheduleAdvance();
});
document.querySelector("#grownups-button").addEventListener("click", showGuide);
document.querySelector("#footer-grownups").addEventListener("click", showGuide);
dialog
  .querySelectorAll("[data-close-dialog]")
  .forEach((button) => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  }
});

main.addEventListener("change", (event) => {
  if (
    event.target.matches('input[name="term"]') &&
    TERMS.some((item) => item.id === event.target.value)
  )
    term = event.target.value;
});
main.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  if (button.dataset.answer) return submitAnswer(button.dataset.answer);
  if (button.dataset.part) return editBuild(selectPart(round, button.dataset.part));
  if (button.dataset.remove !== undefined) return editBuild(removePart(round, Number(button.dataset.remove)));
  switch (button.dataset.action) {
    case "start":
      location.hash = `${gameType === "building" ? "build" : "play"}/${term}`;
      break;
    case "clear-build":
      editBuild({ ...round, selected: [], lastAnswer: null });
      break;
    case "again":
      startRound();
      break;
    case "guide":
      showGuide();
      break;
  }
});
document.addEventListener("keydown", (event) => {
  if (
    view !== "game" ||
    dialog.open ||
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return;
  if (gameType === "building") {
    if (event.target.closest("button, a, input")) return;
    if (/^[1-9]$/.test(event.key)) {
      event.preventDefault();
      main.querySelectorAll("[data-part]")[Number(event.key) - 1]?.click();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      editBuild(removePart(round, round.selected.length - 1));
    }
    return;
  }
  if (/^[1-4]$/.test(event.key)) {
    event.preventDefault();
    main.querySelectorAll("[data-answer]")[Number(event.key) - 1]?.click();
  }
});

function updateSoundButton(pending = false) {
  soundButton.innerHTML = icon(sound && !pending ? "volume" : "mute");
  soundButton.setAttribute("aria-pressed", String(sound && !pending));
  soundButton.setAttribute("aria-busy", String(pending));
  soundButton.setAttribute(
    "aria-label",
    pending
      ? "Cancel sound loading"
      : sound
        ? "Turn sound off"
        : "Turn sound on",
  );
  soundButton.title = pending
    ? "Starting sound…"
    : sound
      ? "Sound on"
      : "Sound off";
}
soundButton.addEventListener("click", () => {
  soundNotice.hidden = true;
  soundPlayer.setEnabled(!soundPlayer.isEnabled());
});
soundNotice.querySelector("button").addEventListener("click", () => {
  soundNotice.hidden = true;
});

window.addEventListener("hashchange", route);
updateSoundButton();
route();

// Optional browser capability: no polyfill or network dependency in ordinary browsers.
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  const tools = [
    {
      name: "read_phonics_progress",
      title: "Read phonics progress",
      description:
        "Read the current view, selected term, and round progress without revealing answers.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        if (
          !input ||
          typeof input !== "object" ||
          Array.isArray(input) ||
          Object.keys(input).length
        )
          throw new Error("No arguments expected.");
        return {
          view,
          term,
          year: "Year 1",
          round:
            view === "game" || view === "result"
              ? {
                  hearts: round.hearts,
                  wordsFound: round.correct,
                  totalWords: round.questions.length,
                  status: round.status,
                }
              : null,
        };
      },
    },
    {
      name: "choose_phonics_term",
      title: "Choose a phonics term",
      description:
        "Open the Year 1 term selection screen with a term selected. This leaves any current round; it does not start a new round.",
      inputSchema: {
        type: "object",
        properties: {
          term: { type: "string", enum: TERMS.map((item) => item.id) },
        },
        required: ["term"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (
          !input ||
          typeof input !== "object" ||
          Object.keys(input).length !== 1 ||
          !TERMS.some((item) => item.id === input.term)
        )
          throw new Error("Choose autumn, spring, or summer.");
        gameType = "reading";
        term = input.term;
        history.replaceState(null, "", "#phonics");
        renderSetup();
        focusHeading();
        return { view, term, wordCount: getBank("year1", term).length };
      },
    },
  ];
  for (const tool of tools) {
    try {
      Promise.resolve(
        document.modelContext.registerTool(tool, { signal: lifecycle.signal }),
      ).catch(() => {});
    } catch {
      /* Optional browser capability. */
    }
  }
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) lifecycle.abort();
  });
}
