import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

async function start(page, term = "autumn") {
  await page.goto("/#phonics");
  await page.locator(`input[value="${term}"]`).check();
  await page.getByRole("button", { name: "Let’s play" }).click();
  await expect(page.locator(".target-word")).toBeVisible();
}

test("home, term selection and every term render without broken assets or overflow", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Curiouser & curiouser." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Let’s play" }).click();
  await expect(
    page.getByRole("heading", { name: "A term for every adventure." }),
  ).toBeVisible();
  await expect(page.getByText("81 words to explore")).toBeVisible();
  await expect(page.getByText("122 words to explore")).toBeVisible();
  await expect(page.getByText("189 words to explore")).toBeVisible();
  for (const term of ["autumn", "spring", "summer"]) {
    await start(page, term);
    await expect(page.locator(".picture-option")).toHaveCount(4);
    await expect
      .poll(() =>
        page.evaluate(() =>
          [...document.images].every(
            (img) => img.complete && img.naturalWidth > 0,
          ),
        ),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("three incorrect pictures end the round, replay restores hearts, and all correct answers win", async ({
  page,
}) => {
  test.setTimeout(60000);
  await start(page);
  const word = await page.locator(".target-word").textContent();
  const wrong = await page
    .locator(`[data-answer]:not([data-answer="${word}"])`)
    .evaluateAll((nodes) => nodes.map((node) => node.dataset.answer));
  for (let i = 0; i < wrong.length; i++) {
    await page.locator(`[data-answer="${wrong[i]}"]`).click();
    if (i < 2) {
      await expect(
        page.getByRole("img", { name: `${2 - i} of 3 hearts remaining` }),
      ).toBeVisible();
      await expect(page.locator(`[data-answer="${wrong[i]}"]`)).toBeDisabled();
    }
  }
  await expect(page.getByText("GAME OVER · ANOTHER TRY AWAITS")).toBeVisible();
  await expect(page.locator(".missed-word")).toContainText(word);
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(
    page.getByRole("img", { name: "3 of 3 hearts remaining" }),
  ).toBeVisible();
  for (let i = 0; i < 10; i++) {
    const target = await page.locator(".target-word").textContent();
    await page.locator(`[data-answer="${target}"]`).click();
    await expect(page.locator(".picture-option.correct")).toHaveCount(1);
    await expect(page.locator("[data-answer]:disabled")).toHaveCount(4);
    await expect(page.locator(".next-button")).toHaveCount(0);
    if (i < 9)
      await expect(page.getByText(`Word ${i + 2} of 10`)).toBeVisible();
    else
      await expect(
        page.getByRole("heading", { name: "Well Done!" }),
      ).toBeVisible();
  }
  await expect(
    page.getByRole("heading", { name: "Well Done!" }),
  ).toBeVisible();
  await expect(page.locator(".result-stats")).toContainText("10 / 10");
  await expect(page.locator(".celebration-animal")).toBeVisible();
  await expect.poll(() => page.locator(".celebration-animal").evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  const firstAnimal = await page.locator(".celebration-animal").getAttribute("src");
  await page.locator(".animal-entrance").evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  await page.screenshot({ path: `test-results/celebration-${page.viewportSize().width}.png`, fullPage: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Play again" }).click();
  await expect(page.getByText("Word 1 of 10")).toBeVisible();
  for (let i = 0; i < 10; i++) {
    const target = await page.locator(".target-word").textContent();
    await page.locator(`[data-answer="${target}"]`).click();
    if (i < 9) await expect(page.getByText(`Word ${i + 2} of 10`)).toBeVisible();
    else await expect(page.getByRole("heading", { name: "Well Done!" })).toBeVisible();
  }
  expect(await page.locator(".celebration-animal").getAttribute("src")).not.toBe(firstAnimal);
  expect(await page.locator(".animal-entrance").evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("keyboard play, guide focus, sound toggle and history navigation work", async ({
  page,
}) => {
  await start(page);
  await page
    .getByRole("button", { name: "For grown-ups", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("1");
  await expect(
    page.getByRole("img", { name: "3 of 3 hearts remaining" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "For grown-ups", exact: true }),
  ).toBeFocused();
  const word = await page.locator(".target-word").textContent();
  const choices = await page
    .locator("[data-answer]")
    .evaluateAll((nodes) => nodes.map((node) => node.dataset.answer));
  await page.keyboard.press(String(choices.indexOf(word) + 1));
  await expect(page.locator("#feedback")).toBeFocused();
  await expect(page.getByText("Word 2 of 10")).toBeVisible();
  await expect(page.locator(".target-word")).toBeFocused();
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Turn sound off" }).click();
  await page.getByRole("link", { name: "Choose a term" }).click();
  await page.goBack();
  await expect(page.getByText("Word 1 of 10")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Word 1 of 10")).toBeVisible();
});

test("GitHub Pages repository subpaths load all screens and refresh directly into a round", async ({
  page,
}) => {
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".wav": "audio/wav",
  };
  await page.route("**/curiouser/**", async (route) => {
    const path =
      new URL(route.request().url()).pathname.slice("/curiouser/".length) ||
      "index.html";
    try {
      await route.fulfill({
        status: 200,
        contentType: types[extname(path)] || "application/octet-stream",
        body: await readFile(resolve(path)),
      });
    } catch {
      await route.fulfill({ status: 404, body: "Not found" });
    }
  });
  await page.goto("/curiouser/");
  await page.getByRole("link", { name: "Let’s play" }).click();
  await page.getByRole("button", { name: "Let’s play" }).click();
  await expect(page).toHaveURL(/\/curiouser\/#play\/autumn$/);
  await page.reload();
  await expect(page.locator(".target-word")).toBeVisible();
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(
    page.getByRole("button", { name: "Turn sound off" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.images].every(
          (img) => img.complete && img.naturalWidth > 0,
        ),
      ),
    )
    .toBe(true);
});

test("narrow screens, enlarged text, and reduced motion stay usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const hash of ["", "#phonics", "#play/summer"]) {
    await page.goto("/" + hash);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  // Browser zoom is represented by a smaller CSS viewport; also double text sizes.
  await page.addStyleTag({
    content: "p, button, a, .term-description { font-size: 200% !important; }",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator(".target-word")).toBeVisible();
});

test("optional browser tools share visible state and reject invalid input", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.registeredTools = {};
    Object.defineProperty(document, "modelContext", {
      value: {
        registerTool: (tool) => {
          window.registeredTools[tool.name] = tool;
        },
      },
    });
  });
  await page.goto("/");
  expect(
    await page.evaluate(() => Object.keys(window.registeredTools).sort()),
  ).toEqual(["choose_phonics_term", "read_phonics_progress"]);
  const result = await page.evaluate(() =>
    window.registeredTools.choose_phonics_term.execute({ term: "summer" }),
  );
  expect(result).toEqual({ view: "setup", term: "summer", wordCount: 189 });
  await expect(page.locator('input[value="summer"]')).toBeChecked();
  const rejected = await page.evaluate(() => {
    try {
      window.registeredTools.choose_phonics_term.execute({ term: "winter" });
      return false;
    } catch {
      return true;
    }
  });
  expect(rejected).toBe(true);
  const state = await page.evaluate(() =>
    window.registeredTools.read_phonics_progress.execute({}),
  );
  expect(state.term).toBe("summer");
  expect(state.view).toBe("setup");
});

test("the whole game fits short phones, landscape screens and viewport resizing", async ({
  page,
}) => {
  await start(page, "summer");
  await page.evaluate(() => document.fonts.ready);
  for (const [width, height] of [
    [320, 480],
    [320, 568],
    [375, 667],
    [390, 664],
    [390, 844],
    [667, 320],
    [844, 390],
    [768, 1024],
    [1280, 720],
  ]) {
    await page.setViewportSize({ width, height });
    await page.locator(".target-word").evaluate((node) => {
      node.textContent = "sunglasses";
    });
    const layout = await page.evaluate(() => {
      const elements = [
        ...document.querySelectorAll(
          ".target-word, .hearts, .picture-option, #feedback",
        ),
      ];
      return {
        scrolls:
          document.documentElement.scrollHeight > innerHeight + 1 ||
          document.documentElement.scrollWidth > innerWidth + 1,
        outside: elements
          .filter((element) => {
            const bounds = element.getBoundingClientRect();
            return (
              bounds.top < 0 ||
              bounds.left < 0 ||
              bounds.right > innerWidth + 1 ||
              bounds.bottom > innerHeight + 1
            );
          })
          .map((element) => element.className || element.id),
        smallTargets: [...document.querySelectorAll(".picture-option")].some(
          (element) => {
            const bounds = element.getBoundingClientRect();
            return bounds.width < 44 || bounds.height < 44;
          },
        ),
      };
    });
    expect(layout, `${width} × ${height}`).toEqual({
      scrolls: false,
      outside: [],
      smallTargets: false,
    });
    await page.mouse.wheel(0, 500);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  }
  // Leaving play restores normal scrolling for the menus.
  await page.setViewportSize({ width: 390, height: 664 });
  await page.getByRole("link", { name: "Choose a term" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-view", "setup");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow,
    ),
  ).not.toBe("hidden");
});

test("success feedback locks choices, pauses for the guide, and cancels when leaving", async ({
  page,
}) => {
  const clockStart = new Date("2030-01-01T12:00:00Z");
  await page.clock.install({ time: clockStart });
  await start(page);
  // Use a known future instant so a slow worker cannot move the clock backwards.
  await page.clock.pauseAt(new Date(clockStart.getTime() + 60000));
  const word = await page.locator(".target-word").textContent();
  await page.locator(`[data-answer="${word}"]`).click();
  await expect(page.locator(".success-sparkles")).toBeVisible();
  expect(
    await page
      .locator(".picture-option.correct img")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("happy-bounce");
  await page.keyboard.press("1");
  await page.clock.runFor(500);
  await expect(page.getByText("Word 1 of 10")).toBeVisible();
  await expect(
    page.getByRole("img", { name: "3 of 3 hearts remaining" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "For grown-ups", exact: true })
    .click();
  await page.clock.runFor(2000);
  await expect(page.getByText("Word 1 of 10")).toBeVisible();
  const guideClosed = page.evaluate(
    () =>
      new Promise((resolve) => {
        document
          .querySelector("dialog")
          .addEventListener("close", () => resolve(), { once: true });
      }),
  );
  await page.keyboard.press("Escape");
  // The browser queues the dialog's close event separately from removing it.
  await page.clock.runFor(50);
  await guideClosed;
  await page.clock.runFor(1000);
  await expect(page.getByText("Word 2 of 10")).toBeVisible();
  // A wrong answer still waits for another choice, even after a long pause.
  const target = await page.locator(".target-word").textContent();
  await page
    .locator(`[data-answer]:not([data-answer="${target}"])`)
    .first()
    .click();
  await page.clock.runFor(2000);
  await expect(page.getByText("Word 2 of 10")).toBeVisible();
  await page.locator(`[data-answer="${target}"]`).click();
  await page.getByRole("link", { name: "Choose a term" }).click();
  await page.clock.runFor(2000);
  await expect(
    page.getByRole("heading", { name: "A term for every adventure." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Let’s play" }).click();
  await page.clock.runFor(2000);
  await expect(page.getByText("Word 1 of 10")).toBeVisible();
  // Reduced motion keeps the success state and automatic advance without movement.
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedWord = await page.locator(".target-word").textContent();
  await page.locator(`[data-answer="${reducedWord}"]`).click();
  expect(
    await page
      .locator(".picture-option.correct img")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await page.clock.runFor(1000);
  await expect(page.getByText("Word 2 of 10")).toBeVisible();
});
