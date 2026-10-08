import { TERMS, LEVELS, getBank } from "./words.js";
import { createRound, answer, nextQuestion } from "./game.js";

const main = document.querySelector("#main");
const dialog = document.querySelector("#grownups-dialog");
const soundButton = document.querySelector("#sound-button");
const announcer = document.createElement("div");
announcer.className = "sr-only";
announcer.setAttribute("role", "status");
announcer.setAttribute("aria-live", "polite");
document.body.append(announcer);

let term = "autumn";
let round = null;
let sound = false;
let audio;
let view = "home";
let advanceTimer = null;
const CELEBRATION_MS = 950;

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
        <span class="art-note">wonder starts here</span>
        <span class="floating-suit suit-one" aria-hidden="true">✦</span>
        <img class="reading-friends" src="./assets/reading-friends.png" width="500" height="360" alt="A little fox and white rabbit sharing a storybook">
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
        <aside class="coming-card" aria-label="More games coming soon">
          <span class="pill light">STILL BREWING</span>
          ${picture("teacup", "coming-teacup")}
          <h3>More wonder <br>is on its way.</h3>
          <p>New adventures will<br>be joining the tea party.</p>
          <span class="suits" aria-hidden="true">♠ <span>♥</span> ♣ <span>♦</span></span>
        </aside>
      </div>
    </section>
    <div class="home-note">${picture("key")}<p>There’s no rush in this rabbit hole.<br><strong>Take your time. Have a go. Let your curiosity grow.</strong></p></div>`;
}

function renderSetup() {
  setView("setup");
  document.title = "Choose your term · The Reading Rabbit · Curiouser";
  main.innerHTML = `
    <a class="back-link" href="#">All adventures</a>
    <section class="setup" aria-labelledby="setup-title">
      <div class="setup-header">${picture("rabbit", "setup-rabbit")}<span class="eyebrow">THE READING RABBIT · YEAR 1</span>
        <h1 id="setup-title" tabindex="-1">A term for every adventure.</h1>
        <p>Which term are you in? Let’s find your words.</p>
      </div>
      <fieldset class="term-fieldset"><legend class="sr-only">Choose your Year 1 term</legend>
        <div class="term-grid">${TERMS.map(
          (item) => `
          <label class="term-card ${item.colour}">
            <input type="radio" name="term" value="${item.id}" ${term === item.id ? "checked" : ""}>
            <span class="radio-indicator">${icon("check")}</span>
            ${picture(item.image, "term-picture")}
            <span class="term-name">${item.name}</span>
            <span class="term-description">${LEVELS[`year1-${item.id}`].description}</span>
            <span class="term-count">${getBank("year1", item.id).length} words to explore</span>
          </label>`,
        ).join("")}</div>
      </fieldset>
      <div class="setup-bottom"><p><span aria-hidden="true">♥ ♥ ♥</span> Three hearts. Ten words. All the time you need.</p>
        <button type="button" class="button primary" data-action="start">Let’s play ${icon("play")}</button>
      </div>
      <button class="text-button setup-help" type="button" data-action="guide">Need a hand choosing? A note for grown-ups</button>
    </section>`;
}

function heartMarkup() {
  return `<div class="hearts" role="img" aria-label="${round.hearts} of 3 hearts remaining">${Array.from({ length: 3 }, (_, i) => `<span class="heart ${i < round.hearts ? "full" : "empty"}">${icon("heart")}</span>`).join("")}</div>`;
}

function renderGame() {
  if (round.status === "lost" || round.status === "won") return renderResult();
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
    <div class="game-topbar"><a class="back-link" href="#phonics">Choose a term</a><span class="game-level">Year 1 <span>·</span> ${termName()}</span></div>
    <section class="play-area" aria-label="The Reading Rabbit phonics game">
      <div class="round-topline"><span class="round-count">Word <strong>${round.index + 1}</strong> of ${round.questions.length}</span>${heartMarkup()}</div>
      <div class="progress-track" role="progressbar" aria-label="Words found" aria-valuemin="0" aria-valuemax="${round.questions.length}" aria-valuenow="${round.correct}"><span style="width:${(round.correct / round.questions.length) * 100}%"></span></div>
      <div class="word-area"><span class="eyebrow">READ THE WORD. FIND THE PICTURE.</span><h1 class="target-word" tabindex="-1">${question.target.word}</h1><p>Which picture matches?</p></div>
      <div class="picture-grid" aria-label="Picture choices">${question.options
        .map((option, index) => {
          const incorrect = round.tried.includes(option.id);
          const correct = answered && option.id === question.target.id;
          return `<button class="picture-option option-${index} ${incorrect ? "incorrect" : ""} ${correct ? "correct" : ""}" type="button" data-answer="${option.id}" aria-label="${option.word}${incorrect ? ", already tried" : ""}" ${incorrect || answered ? "disabled" : ""}>
          <img src="${option.image}" alt="" width="160" height="160" draggable="false">
          <span class="choice-marker" aria-hidden="true">${incorrect ? icon("close") : correct ? icon("check") : index + 1}</span>
          ${correct ? '<span class="success-sparkles" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></span>' : ""}
        </button>`;
        })
        .join("")}</div>
      <div class="game-feedback ${answered ? "success" : wrong ? "try-again" : ""}"><p id="feedback" tabindex="-1">${answered ? '<span aria-hidden="true">✦</span> ' : ""}${feedback}</p>
      <span class="keyboard-tip">You can also use the 1, 2, 3 and 4 keys.</span></div>
    </section>`;
}

function renderResult() {
  setView("result");
  const won = round.status === "won";
  const missed = round.questions[round.index].target;
  document.title = `${won ? "Wonderful reading!" : "Try another adventure"} · Curiouser`;
  main.innerHTML = `
    <section class="result" aria-labelledby="result-title">
      <div class="result-art">${picture(won ? "trophy" : "rabbit")}${won ? '<span class="result-spark one" aria-hidden="true">✦</span><span class="result-spark two" aria-hidden="true">✧</span>' : ""}</div>
      <span class="eyebrow">${won ? "ADVENTURE COMPLETE" : "GAME OVER · ANOTHER TRY AWAITS"}</span>
      <h1 id="result-title" tabindex="-1">${won ? "Wonderfully done!" : "Let’s give it another go."}</h1>
      <p>${won ? "A whole little adventure, one word at a time." : "Every little try helps your reading grow."}</p>
      <div class="result-stats"><div><strong>${round.correct}<span> / ${round.questions.length}</span></strong><span>words found</span></div><div>${heartMarkup()}<span>hearts remaining</span></div></div>
      ${!won ? `<div class="missed-word">${picture(missed.id, "", missed.word)}<span>This picture matches <strong class="reading-font">${missed.word}</strong>.</span></div>` : '<p class="result-cheer">The White Rabbit thinks you’re brilliant.</p>'}
      <div class="result-actions"><button type="button" class="button primary" data-action="again">${won ? "Play again" : "Try again"} ${icon("play")}</button><a class="button secondary" href="#phonics">Choose a term</a></div>
      <a class="text-button" href="#">Back to all adventures</a>
    </section>`;
  focusHeading();
}

function startRound() {
  cancelAdvance();
  round = createRound(getBank("year1", term));
  // Preload just this round's pictures rather than the entire collection.
  new Set(
    round.questions.flatMap((question) =>
      question.options.map((item) => item.image),
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
  chime(round.lastAnswer === "correct");
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
  const updated = nextQuestion(round);
  if (updated === round) return;
  round = updated;
  renderGame();
  focusHeading();
  if (round.status === "won")
    announce(`Adventure complete. You found all ${round.correct} words!`);
}

function route() {
  cancelAdvance();
  const hash = location.hash.slice(1);
  if (hash === "phonics") renderSetup();
  else if (/^play\/(autumn|spring|summer)$/.test(hash)) {
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
  if (document.hidden) cancelAdvance();
  else scheduleAdvance();
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
  switch (button.dataset.action) {
    case "start":
      location.hash = `play/${term}`;
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
  if (/^[1-4]$/.test(event.key)) {
    event.preventDefault();
    main.querySelectorAll("[data-answer]")[Number(event.key) - 1]?.click();
  }
});

function updateSoundButton() {
  soundButton.innerHTML = icon(sound ? "volume" : "mute");
  soundButton.setAttribute("aria-pressed", String(sound));
  soundButton.setAttribute(
    "aria-label",
    sound ? "Turn sound off" : "Turn sound on",
  );
  soundButton.title = sound ? "Sound on" : "Sound off";
}
function chime(correct) {
  if (!sound || !audio) return;
  try {
    void audio.resume().catch(() => {});
    const time = audio.currentTime;
    const notes = correct ? [523.25, 659.25, 783.99] : [329.63, 293.66];
    notes.forEach((frequency, i) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      const start = time + i * 0.11;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.06, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.28);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    });
  } catch {
    /* Sound is optional; a browser audio restriction must not interrupt play. */
  }
}
soundButton.addEventListener("click", () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext)
    return announce(
      "Sound is not available in this browser. You can still play.",
    );
  try {
    audio ??= new AudioContext();
    sound = !sound;
    updateSoundButton();
    if (sound) chime(true);
  } catch {
    announce("Sound is not available. You can still play.");
  }
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
