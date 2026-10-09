// Original little toy-bell and bubble effects. Run with `node scripts/make-sounds.js`.
// This only builds static assets: the website does not synthesise audio at runtime.
import { mkdirSync, writeFileSync } from "node:fs";

const sampleRate = 44100;
const tau = Math.PI * 2;
const sine = (phase) => Math.sin(tau * phase);

function mix(samples, start, duration, voice) {
  const first = Math.round(start * sampleRate);
  const count = Math.round(duration * sampleRate);
  for (let i = 0; i < count && first + i < samples.length; i++) {
    const t = i / sampleRate;
    // A short soft attack and a smooth tail prevent clicks on phone speakers.
    const attack = 1 - Math.exp(-t / 0.004);
    const release = Math.min(1, (duration - t) / 0.05);
    samples[first + i] += voice(t) * attack * release * release;
  }
}

function bell(samples, start, frequency, gain, duration = 0.43) {
  mix(samples, start, duration, (t) => {
    const fundamental = sine(frequency * t) * Math.exp(-t / 0.14);
    const roundedOvertone =
      0.19 * sine(frequency * 2 * t) * Math.exp(-t / 0.07);
    const sparkle = 0.055 * sine(frequency * 3.01 * t) * Math.exp(-t / 0.045);
    return gain * (fundamental + roundedOvertone + sparkle);
  });
}

function bubble(samples, start, frequency, gain) {
  mix(samples, start, 0.2, (t) => {
    // A quick upwards pitch bend makes a small, friendly water-drop sound.
    const bend = 0.021;
    const phase = frequency * (t + 0.7 * bend * (Math.exp(-t / bend) - 1));
    return gain * (sine(phase) + 0.12 * sine(2 * phase)) * Math.exp(-t / 0.055);
  });
}

function writeWav(name, samples) {
  const peak = samples.reduce(
    (largest, value) => Math.max(largest, Math.abs(value)),
    0,
  );
  const gain = 0.55 / peak;
  const wav = Buffer.alloc(44 + samples.length * 2);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); // PCM
  wav.writeUInt16LE(1, 22); // mono
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((value, i) =>
    wav.writeInt16LE(Math.round(value * gain * 32767), 44 + i * 2),
  );
  writeFileSync(new URL(`../assets/sounds/${name}.wav`, import.meta.url), wav);
  console.log(
    `${name}.wav: ${(samples.length / sampleRate).toFixed(2)}s, ${wav.length} bytes`,
  );
}

mkdirSync(new URL("../assets/sounds/", import.meta.url), { recursive: true });

// A tiny ascending music-box flourish, with quiet echoes for a fairy-tale feel.
const correct = new Float64Array(Math.round(0.82 * sampleRate));
const notes = [783.99, 987.77, 1174.66, 1567.98]; // G5, B5, D6, G6
notes.forEach((frequency, i) => {
  bell(correct, i * 0.105, frequency, 0.34 - i * 0.025);
  bell(correct, i * 0.105 + 0.075, frequency, 0.045, 0.42);
});
bubble(correct, 0, 430, 0.085);
writeWav("correct", correct);

// Two mellow bubbles for "try again", without a harsh buzzer or alarm.
const incorrect = new Float64Array(Math.round(0.43 * sampleRate));
bubble(incorrect, 0, 587.33, 0.39);
bubble(incorrect, 0.15, 493.88, 0.3);
writeWav("incorrect", incorrect);
