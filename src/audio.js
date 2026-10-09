// Native media playback is started directly inside each tap/key handler.
// This avoids relying on an AudioContext that iOS may suspend or interrupt.
export function createSoundPlayer({ onStateChange, onError }) {
  const sources = {
    correct: new URL("../assets/sounds/correct.wav", import.meta.url).href,
    incorrect: new URL("../assets/sounds/incorrect.wav", import.meta.url).href,
  };
  const players = new Map();
  let enabled = false;
  let pending = false;
  let request = 0;

  function halt() {
    request += 1;
    for (const player of players.values()) player.pause();
  }

  function stop() {
    halt();
    if (pending) {
      enabled = false;
      pending = false;
      onStateChange(enabled, pending);
    }
  }

  function fail(error, attempt) {
    // pause() intentionally aborts an in-flight play() when muting or leaving.
    if (attempt !== request || !enabled) return;
    enabled = false;
    pending = false;
    halt();
    onStateChange(enabled, pending);
    onError(error);
  }

  function getPlayer(name) {
    // A media element with a failed download keeps its error until reloaded.
    // Recreate it so tapping the speaker can recover once the connection returns.
    if (!players.has(name) || players.get(name).error) {
      players.get(name)?.pause();
      const player = new Audio(sources[name]);
      player.preload = "auto";
      player.setAttribute("playsinline", "");
      players.set(name, player);
    }
    return players.get(name);
  }

  function play(name) {
    if (!enabled || document.hidden || !Object.hasOwn(sources, name)) return;
    halt();
    const attempt = request;
    try {
      const player = getPlayer(name);
      if (player.readyState > 0) player.currentTime = 0;
      // Do not await loading or any other work before calling play(): Safari
      // needs this call to remain in the original user interaction.
      const playback = player.play();
      Promise.resolve(playback)
        .then(() => {
          if (attempt !== request || !enabled) return;
          pending = false;
          onStateChange(enabled, pending);
        })
        .catch((error) => fail(error, attempt));
    } catch (error) {
      fail(error, attempt);
    }
  }

  function setEnabled(value) {
    halt();
    enabled = Boolean(value);
    pending = enabled;
    onStateChange(enabled, pending);
    if (!enabled) return;
    try {
      // Prepare both tiny local clips during the sound-enable gesture.
      for (const name of Object.keys(sources)) getPlayer(name);
      play("correct");
    } catch (error) {
      fail(error, request);
    }
  }

  return { play, stop, setEnabled, isEnabled: () => enabled };
}
