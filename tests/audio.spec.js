import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.soundEvents = [];
    window.soundPlayers = [];
    const NativeAudio = window.Audio;
    window.Audio = function (...args) {
      const player = new NativeAudio(...args);
      window.soundPlayers.push(player);
      const nativePlay = player.play.bind(player);
      player.play = function () {
        window.soundEvents.push({
          event: "request",
          src: player.src,
          active: navigator.userActivation?.isActive ?? null,
        });
        return nativePlay();
      };
      for (const event of ["playing", "ended", "error"]) {
        player.addEventListener(event, () =>
          window.soundEvents.push({
            event,
            src: player.src,
            time: player.currentTime,
          }),
        );
      }
      return player;
    };
    // The game must still work when Web Audio cannot be started at all.
    window.AudioContext = window.webkitAudioContext = function () {
      throw new Error("AudioContext unavailable");
    };
  });
});

test("sound clips actually start and finish, are triggered by taps, and mute immediately", async ({
  page,
}) => {
  await page.goto("/#play/autumn");
  expect(await page.evaluate(() => window.soundPlayers.length)).toBe(0);
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.soundEvents.filter(
            (event) =>
              event.event === "ended" && event.src.endsWith("correct.wav"),
          ).length,
      ),
    )
    .toBe(1);
  const word = await page.locator(".target-word").textContent();
  await page
    .locator(`[data-answer]:not([data-answer="${word}"])`)
    .first()
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.soundEvents.filter(
            (event) =>
              event.event === "ended" && event.src.endsWith("incorrect.wav"),
          ).length,
      ),
    )
    .toBe(1);
  await page.locator(`[data-answer="${word}"]`).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.soundEvents.filter(
            (event) =>
              event.event === "playing" && event.src.endsWith("correct.wav"),
          ).length,
      ),
    )
    .toBeGreaterThanOrEqual(2);
  await page.getByRole("button", { name: "Turn sound off" }).click();
  expect(
    await page.evaluate(() =>
      window.soundPlayers.every((player) => player.paused),
    ),
  ).toBe(true);
  await expect(page.locator("#sound-notice")).toBeHidden();
  await expect(page.getByText("Word 2 of 10")).toBeVisible();
  const requests = await page.evaluate(
    () =>
      window.soundEvents.filter((event) => event.event === "request").length,
  );
  const nextWord = await page.locator(".target-word").textContent();
  await page.locator(`[data-answer="${nextWord}"]`).click();
  expect(
    await page.evaluate(
      () =>
        window.soundEvents.filter((event) => event.event === "request").length,
    ),
  ).toBe(requests);
  expect(
    await page.evaluate(() =>
      window.soundEvents
        .filter((event) => event.event === "request")
        .every((event) => event.active !== false),
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      window.soundPlayers.every(
        (player) => Number.isFinite(player.duration) && player.duration > 0,
      ),
    ),
  ).toBe(true);
});

test("blocked playback resets the toggle, shows a visible message, and can be retried", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    let rejectOnce = true;
    HTMLMediaElement.prototype.play = function () {
      if (rejectOnce) {
        rejectOnce = false;
        return Promise.reject(
          new DOMException("Gesture required", "NotAllowedError"),
        );
      }
      return play.call(this);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(page.locator("#sound-notice")).toContainText(
    "Sound couldn’t start",
  );
  await expect(
    page.getByRole("button", { name: "Turn sound on" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#sound-notice")).toBeHidden();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.soundEvents.some((event) => event.event === "ended"),
      ),
    )
    .toBe(true);
});

test("muting during startup cancels playback without a false error or late re-enable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () {
      return new Promise((resolve, reject) => {
        window.rejectPendingSound = reject;
      });
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Cancel sound loading" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Cancel sound loading" }).click();
  await page.evaluate(() =>
    window.rejectPendingSound(new DOMException("Paused", "AbortError")),
  );
  await expect(
    page.getByRole("button", { name: "Turn sound on" }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#sound-notice")).toBeHidden();
});

test("missing sound files show an error, allow play to continue, and recover on retry", async ({
  page,
}) => {
  await page.route("**/assets/sounds/*.wav", (route) =>
    route.fulfill({
      status: 404,
      contentType: "text/plain",
      body: "Not found",
    }),
  );
  await page.goto("/#play/autumn");
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(page.locator("#sound-notice")).toContainText(
    "Sound couldn’t load",
  );
  await expect(
    page.getByRole("button", { name: "Turn sound on" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dismiss sound message" }).click();
  const word = await page.locator(".target-word").textContent();
  await page.locator(`[data-answer="${word}"]`).click();
  await expect(page.getByText("Word 2 of 10")).toBeVisible();
  await page.unroute("**/assets/sounds/*.wav");
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.soundEvents.some((event) => event.event === "ended"),
      ),
    )
    .toBe(true);
});
