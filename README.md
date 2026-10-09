# Curiouser

A small, Alice in Wonderland inspired collection of games for curious children. The first game, **The Reading Rabbit**, practises **Year 1 phonics** through word-to-picture matching.

The website is plain **HTML, CSS and JavaScript**. All pictures and fonts are included. There is no build step, backend, API key, account system, advertising or analytics. It works on GitHub Pages, including a project URL such as `https://YOUR-USERNAME.github.io/curiouser/`.

## Try it locally

With Node.js 18 or newer installed, open a terminal in this folder and run:

```sh
npm start
```

Open **http://localhost:4173**. You do **not** need `npm install` to run the website. To stop the server, press Ctrl+C. Alternatively, with Python installed, run `python3 -m http.server 4173` in this folder.

Use a local web server instead of double-clicking `index.html`: browsers restrict JavaScript module loading from `file://` URLs.

## Host it on GitHub Pages: fresh repository

### 1. Create your GitHub account and repository

1. Sign in to [GitHub](https://github.com/), or create an account.
2. Visit [Create a new repository](https://github.com/new).
3. Name the repository **`curiouser`**. Another name also works.
4. Select **Public** for free GitHub Pages hosting.
5. Leave **Add a README**, **Add .gitignore** and **Choose a licence** unselected. This folder already has the project files.
6. Click **Create repository**.

### 2. Upload the website

Choose **one** of these methods. Git is the quickest way to upload the full picture collection.

#### Option A: Git commands

Install [Git](https://git-scm.com/downloads) if necessary. Open a terminal in this project folder, replace `YOUR-USERNAME` below with your GitHub username, and run:

```sh
git init -b main
git add .
git commit -m "Add Curiouser and The Reading Rabbit"
git remote add origin https://github.com/YOUR-USERNAME/curiouser.git
git push -u origin main
```

If Git asks who you are, configure your name and the email associated with your GitHub account, then retry the commit:

```sh
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

Follow Git's browser sign-in prompt when pushing. If your setup asks for a password, use GitHub's supported authentication method (a personal access token or a credential manager), not your GitHub account password. [GitHub's authentication guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github).

These commands assume a fresh local folder with no Git repository. If you have already initialised Git here, skip `git init`. Check `git remote -v` before adding `origin`; do not overwrite an existing remote accidentally.

#### Option B: upload in your browser

1. In your empty GitHub repository, select **uploading an existing file**. Once files exist, the option is **Add file → Upload files**.
2. Upload `index.html`, `styles.css`, `README.md` and `ASSETS.md` at the repository root. Upload the **`src` folder**, **`assets/fonts` folder** and **`assets/sounds` folder**, preserving those paths, and include `reading-friends-alice.png` inside **`assets`**, plus **`assets/celebration`** with its full-body friend sheet.
3. Upload every PNG in `assets/pictures`, plus its `sources.json` and `LICENSE.txt`. GitHub allows **up to 100 files per upload**, so upload the picture collection in several batches. Navigate into `assets/pictures` before each batch; the files must end up there, not at the repository root. To create that folder first, use **Add file → Create new file**, enter `assets/pictures/.gitkeep` as the filename, and commit it.
4. Commit each upload to **`main`**, with a message such as “Add Curiouser pictures”.
5. Add the hidden `.nojekyll` file at the root. If your file picker cannot show it, choose **Add file → Create new file**, type **`.nojekyll`** as the filename, enter a comment such as `Static website; no Jekyll build needed.`, and commit.
6. Check the final structure below. Upload the **contents** of this project folder; do not place everything inside an extra `workspace` or `curiouser` folder. Upload the extracted files, not a ZIP archive.

The GitHub interface may offer a pull request instead of a direct commit. In that case, merge the upload's pull request into `main` before enabling Pages. [Official file-upload instructions and limits](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

Files required for the hosted game:

```text
curiouser/                       ← repository root
├── index.html
├── styles.css
├── .nojekyll
├── src/
│   ├── app.js
│   ├── audio.js
│   ├── build-word.js
│   ├── game.js
│   ├── words.js
│   ├── word-data.js
│   ├── pictures.js
│   └── celebration.js
└── assets/
    ├── reading-friends-alice.png
    ├── celebration/             ← full-body animal celebration artwork
    ├── fonts/                   ← include font files AND their licences
    ├── sounds/                  ← both WAV sound effects
    └── pictures/                ← include all pictures, sources and licence
```

You can also upload all the development files. `.gitignore` excludes installed dependencies and generated test results when using Git. They are not needed on GitHub Pages.

### 3. Turn on GitHub Pages

1. Open your repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose **`main`**, then **`/ (root)`**.
5. Click **Save**.
6. Allow the first deployment to finish. You can watch its progress in the repository's **Actions** tab.
7. Return to **Settings → Pages** and click **Visit site**. Your address should be:

```text
https://YOUR-USERNAME.github.io/curiouser/
```

Use the actual repository name if you chose a different one. You do not need a custom domain, a custom workflow, GitHub Actions secrets or a build command. `.nojekyll` tells GitHub to serve the static files directly. [Official GitHub Pages setup instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

### 4. Publish future changes

Edit the files and upload them again, or run:

```sh
git add .
git commit -m "Update Curiouser"
git push
```

GitHub Pages republishes the selected branch automatically. Wait for the deployment to complete, then reload the site. On a phone, test using the published link in Safari or Chrome.

### If something does not work

- **404:** confirm the Pages source is `main` and `/ (root)`, check that the deployment succeeded, and ensure `index.html` is at the repository root. Include `/curiouser/` in a project site's URL.
- **Only the README appears:** the `index.html` file is missing or in a nested folder.
- **Missing pictures or fonts:** upload the entire `assets` folder with the same names, case and subfolders. The images are bundled locally; no image-hosting service is involved.
- **The game does not open:** make sure `src/app.js`, `src/audio.js`, `src/game.js`, `src/words.js`, `src/word-data.js`, `src/pictures.js` and `src/celebration.js` are present. Do not open the site as a `file://` URL.
- **No sound:** sound starts off. Tap the speaker; a short confirmation chime should play. Turn up the phone's media volume and check whether audio is going to connected headphones. If a sound error appears, check that both files in `assets/sounds` were uploaded and try the speaker again. After updating an older deployment, reload the page to load the new sound code.
- **Changes have not appeared:** check the latest Pages deployment in **Actions**, then refresh without using the cached page.
- **No Pages option:** confirm you are in the repository's Settings, have permission to manage it, and that your account/repository supports Pages. Public repositories are the straightforward option on GitHub Free.

## How the game works

1. Select **The Reading Rabbit** from the games collection.
2. Choose **Autumn**, **Spring** or **Summer** for Year 1.
3. Read the word and tap the matching picture. Keyboard users can Tab to a picture and press Enter/Space, or press 1–4.
4. A correct answer earns one word. The picture gives a little celebratory bounce and sparkle, then the next word appears automatically after about one second. There is no Next button and no time limit for answering.
5. Each different wrong picture costs one heart. The same wrong picture cannot cost a second heart.
6. Three lost hearts ends the game and shows the matching picture and word. A round finishes successfully after ten correct words. One of 18 full-body storybook friends bounces in with a “Well Done!” speech bubble; consecutive wins reveal different animals. The Cheshire Cat, White Rabbit, Caterpillar, Dormouse and Dodo share a 20% chance per win, with the 13 regular animals sharing the remaining 80%. Reduced-motion preferences show the celebration without animation.
7. **Play again** starts a fresh shuffled round with three hearts. **Choose a term** returns to setup.

Sound starts off and can be enabled using the header's sound button. Correct answers play a soft, sparkling music-box flourish; wrong answers play two gentle bubble pops. Feedback never speaks the answer. A browser that cannot play sound can still play the game. Leaving or refreshing a round resets it; there are no saved profiles or scores.

Sound uses two tiny, locally bundled WAV files played through native HTML audio, directly from the speaker/answer tap. The speaker shows a loading state until playback starts. Failed playback resets it to off and shows a retry message; muting stops an effect immediately. This replaces the original Web Audio oscillator path, which could silently fail to resume on mobile browsers. iOS also treats Web Audio and HTML audio differently around the Ring/Silent switch ([WebKit explanation](https://bugs.webkit.org/show_bug.cgi?id=252746)). Headless tests verify media decoding, playback events and error recovery, but cannot verify the physical speaker, volume or audio route on an iPhone.

During play, the word, hearts and four pictures fit into the visible browser height, including shorter phones and landscape screens, without page scrolling. Correct-answer feedback pauses while the grown-ups guide is open or the tab is hidden. Reduced-motion settings keep the success highlight and automatic progression but remove the bounce and sparkles.

## Word collection and term suitability

Both games share **237 distinct words**, with a matching picture and curated building pieces for every entry. The shared catalogue is `src/word-data.js`; see [the coverage checklist](PHONICS-COVERAGE.md).

| Year 1 term | Available words | Added this term | Practice focus                                                                                                     |
| ----------- | --------------: | --------------: | ------------------------------------------------------------------------------------------------------------------ |
| Autumn      |              88 |              88 | Revise simple words, digraphs and consonant blends; introduce early alternatives such as `ou`.                     |
| Spring      |             146 |              58 | Split digraphs (`cake`, `bike`), alternative spellings (`leaf`, `key`) and further vowel patterns.                 |
| Summer      |             237 |              91 | Further alternative spellings (`bread`, `pear`), inflections, compound words and words with two or more syllables. |

Spring and Summer include earlier words for revision. Each of those rounds selects **six words introduced in the selected term and four revision words**. Autumn selects ten words from its own set. Targets never repeat within a round. Selection favours different primary spelling focuses, without retaining child history. Pictures and correct-answer positions are shuffled; one similarly spelt distractor is included when a visually unambiguous one is available. Related alternatives that could be ambiguous, such as `hat`/`cap` and `boat`/`ship`, are kept away from each other when one is the target.

These are **broad practice bands, not an official term-by-term curriculum or an assessment**. They use English spellings and a progression informed by [Letters and Sounds](https://www.gov.uk/government/publications/letters-and-sounds). Its phases are a useful reference, not a guarantee of an individual school's current sequence. Schools use different programmes and year-group names across the UK. Spring/Summer sets also revisit earlier sounds; some alternative pronunciations and longer words may need adult support. Choose an earlier term or tailor the bank to match what the child has actually been taught.

All words, building pieces and primary practice focuses are visible in [`src/word-data.js`](src/word-data.js). To tailor the game:

1. Move an entry between `entries.autumn`, `.spring` and `.summer` in `src/word-data.js`; both games and later revision banks update together.
2. Add `word|pieces|primary-focus` to the appropriate term, with spaces between pieces. Use `a_e` for a linked piece that surrounds the next piece. Add an optional fourth field `syllables`, `compound` or `ending` when appropriate. Supply a matching local PNG or a reviewed sprite viewport.
3. Keep words unique across the three new-word lists. Keep at least ten Autumn words and six new words in each later term for full rounds.
4. Add easily confused pairs to `relatedPictures`; retain at least three suitable distractors for every target.
5. Run the checks below. Record the source and licence of any new artwork in `ASSETS.md`.

Screen readers receive descriptive picture-button labels. This supports nonvisual use, although it changes a visual word-to-picture task into a word-choice task. The page respects reduced-motion preferences, uses large touch targets, and permits browser zoom.

## Project files and adding another game

- `index.html`: shared page shell, navigation and grown-ups guide.
- `styles.css`: responsive storybook theme and all game screens.
- `src/app.js`: home, term choice, game rendering and navigation.
- `src/audio.js`: tap-triggered sound playback, muting and failure handling.
- `src/game.js`: independent round, answer and heart rules.
- `src/word-data.js`: the shared vocabulary, curated pieces, primary focuses and sprite viewports.
- `src/words.js`: cumulative term banks, descriptions and related-picture exclusions.
- `src/pictures.js`: responsive picture viewports.
- `src/celebration.js`: regular and rarer Wonderland friends.
- `assets/`: locally bundled artwork and fonts; see `ASSETS.md` for attribution.
- `scripts/serve.js`: dependency-free local development server.
- `tests/`: game-rule and browser checks.

To add another game, add its card in `renderHome()` in `src/app.js`, its own hash route in `route()`, and a separate module for its rules. Relative URLs and hash navigation are intentional: they work under a GitHub Pages repository subpath without server rewrites.

Browsers with `document.modelContext` also receive two optional tools: read the visible progress and select a term. Neither answers questions for the child. Unsupported browsers do not load a polyfill or make any extra requests.

## Development checks

The rules and asset checks use Node's built-in test runner:

```sh
npm test
```

For browser checks, install the development dependency and browsers:

```sh
npm ci
npx playwright install chromium webkit
npm run test:browser
```

On Linux, Playwright may need system browser libraries (`npx playwright install-deps chromium webkit`, with administrator permission on your own machine). The browser suite starts the local server if needed. It includes audio checks in Chromium and WebKit with an iPhone viewport; this is not a physical-device audio test. These tools are only for development: visitors and GitHub Pages do not need Node or Playwright.

## Preview version

The footer displays `v1.3.0`. Bump the version in `package.json`, the root entries in `package-lock.json`, and the visible label and accessible label in `index.html` whenever publishing a changed preview. Keep the same version when promoting that reviewed build to GitHub.

## The Hatter’s Word Workshop

The second adventure, **The Hatter’s Word Workshop**, is at `#build-word`. Its top hat, 10/6 ticket and tea cup tie the word-building puzzles to the Mad Hatter’s tea party. Pick a term, identify the picture, and tap the parts in order. Tap a placed piece to return it, or use the amber **Reset word** button to clear the slots. Filling the final slot automatically checks the word: correct words chime and advance, while incorrect words pop and clear the slots for another try. Each distinct incorrect word costs one heart; repeating the same mistake still resets the word without an additional penalty. Completing ten words reveals the same random animal celebration as the reading game.

Both adventures use exactly the same 237-word catalogue: 88 Autumn words, 58 additional Spring words and 91 additional Summer words. Later rounds mix six current-term words with four revision words. Short words use sound/spelling pieces; a linked split-digraph piece such as `a_e` places its two letters around the next piece, so `c`, `a_e`, `k` displays and checks as **cake**. Longer words can use syllable, compound or root-and-ending pieces. Single-sound words such as **ear** have one piece. The sets are practice bands, not a prescribed curriculum. Autumn includes two unused pieces; later terms include three. Letter pieces are at least 56×56px on phones, with a larger amber reset button. All artwork is bundled locally. Like the reading game, descriptive image labels reveal the picture name to screen-reader users.
