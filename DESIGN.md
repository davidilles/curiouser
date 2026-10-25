# Curiouser: agreed design and working process

Updated 25 October 2026. Read this before changing the games. These decisions reflect the user's feedback and supersede earlier proposals with separate sound drills, separate focused modes, or a Next button after answering.

## Purpose and audience

A friendly Alice in Wonderland collection for a Year 1 child, often played with a parent. The teacher's current goals are to recall number bonds to 10 and related subtraction facts, and say the phonemes represented by er, ear and ur. The parent can ask the child to say the words and sounds while playing the existing phonics games.

## Interaction rules

- Let a child jump straight into play. Use familiar pictures, obvious controls and minimal instructions.
- A correct tap/click checks the answer immediately, briefly celebrates, then advances automatically after about one second (currently 950 ms).
- Do not add a Next, Continue or Check button after the child supplies a solution. Hatter's Workshop checks as soon as the last piece is placed.
- Wrong answers allow another try. Maths never removes hearts. The existing phonics games keep their three-heart rules.
- There is no time limit for answering. Pause automatic advancement while the tab is hidden or the grown-ups guide is open; cancel it on navigation. Repeated taps must not advance twice.
- Keep detailed explanations, pronunciation caveats and progress information in the grown-ups guide, not the child's game flow.
- Preserve the established colours, typography, artwork, large touch targets and reduced-motion support.

Rare Alice visitors and unicorns are eligible only when the entire completed round has no wrong answers. Keep their existing 20% draws and no-repeat rules. Using visual help, moving word pieces or resetting an unfinished word is not a mistake. Ordinary animals still celebrate rounds with mistakes. Maths tracks mistakes across all ten questions and resets the count on replay.

## Phonics: one optional checkbox

The Reading Rabbit and The Hatter's Word Workshop remain the two phonics games, with their existing term choices.

Each term-selection screen has a single checkbox labelled **Extra practice: er · ear · ur**. It is off at the start of a new visit. Its state is shared between the two games during that visit.

- Off: original 237-word catalogue, with 88 Autumn / 146 cumulative Spring / 237 cumulative Summer words and the usual term/revision selection.
- On: add nine illustrated words to the chosen term: herb, perch, herd, hear, beard, tear, fur, curl, surf. Select six target questions (two er, two ear, two ur) and four other questions, shuffled together. Ten unique targets, no immediate word repetition within a round.
- Display words and building pieces normally, including when extra practice is on. Do not highlight er, ear, ur or other target spellings.
- Use ear as in hear; tear is a drop from an eye. Keep alternative ear pronunciations such as bear out of the boosted group. Er words may include fern and, in later terms, familiar unstressed endings such as ladder; the parent's school pronunciation model guides spoken practice.
- Both games use the same words and picture exclusions. New pictures must be recognisable and avoid ambiguous distractors.
- No separate sound game, focused-game screen, pronunciation-selection menu, microphone or speech scoring.
- Correct answers advance automatically, including with the checkbox on. The parent can ask for the word and sound before the child taps an answer.

The round hash uses `?extra=1` when enabled so refreshing restores the option. Ordinary term links keep the option off.

## Maths: The Queen's Ten

The home card opens a question immediately. The screen contains the title, a compact progress indicator, one missing-number equation, a rose ten-frame when enabled, number buttons 0–10, and brief feedback.

Number-button hover highlights apply only to devices with a fine pointer and hover support, so touch taps cannot leave a button looking selected on the next question. Preserve keyboard focus indicators and the brief correct-answer highlight.

A single **Show roses** checkbox controls visual support. Roses start visible; hide them to practise recall. A wrong answer reveals them for that question. Seeing help or making a mistake prevents an answer counting as independent, even if the roses are subsequently hidden.

Cover the six pairs (0+10 through 5+5), both addition orders and the subtraction facts from ten. Exactly ten challenges per round, consistent with the other games: five additions and five subtractions, with all six number pairs represented at least once. Vary the orientation and missing-number position across rounds. A mistake gets another try at the same challenge; never append extra challenges.

No introductory mode chooser, explanation cards or extra instruction screen. No Next button after correct answers. After the tenth correct answer, use the same full-body animal, Well Done! speech bubble and animation as the phonics games. Add four roses-only animals: frog, flamingo, peacock and butterfly. The first maths win in a visit introduces one of those. Later wins have a 20% chance of a rare unicorn: Rose, Lavender, Rainbow or Starlight, all exclusive to this game. On the remaining 80% of wins, mix the existing garden-only and familiar pools equally. Unicorns use the same Well Done! animation, with their name in the greeting. Never repeat the previous maths celebration. Keep the garden-only animals out of both phonics games. Respect reduced-motion settings and offer Play again and All games.

The child's result celebrates completion: ‘You got every answer right first time!’ after a mistake-free round, otherwise ‘You solved all 10 challenges!’ Keep the separate count of first-try answers with the roses hidden in the grown-ups guide, using a complete sentence.

Only the latest completed maths round's mode and independent-answer count are saved on the device. The grown-ups guide shows and clears that summary. Play must still work if storage is unavailable. Phonics round state remains in memory.

## Repository and publication workflow

- Original repository: https://github.com/davidilles/curiouser
- Its actual default branch is `master`, even when the conversation calls it main.
- Private test site: https://curiouser-preview.ardent-crane-8154.chatgpt.site
- Existing Sites project ID: `appgprj_6ac8bf0c83a48191bd940d87c7540420`.
- Work locally on a non-default branch. **Do not commit or push to the original GitHub repository until the user explicitly confirms after testing.**
- The user expressly authorises commits/pushes to the separate private Sites source repository needed to update the test site. This does not authorise GitHub commits or pushes.
- Keep the two checkouts separate. In this session `curiouser/` is the GitHub working copy and `curiouser-preview/` is the private Sites source checkout. Never replace the GitHub remote with the Sites remote or vice versa.
- Obtain fresh Sites credentials through the connector; never put credentials into files, documentation or output. Preserve private access and the existing project ID.
- Build and test, package and publish to the existing private URL, verify deployment, then ask the user to test. Wait for explicit confirmation before promoting to GitHub.
- Bump the version in package.json, package-lock.json and both footer labels for every changed preview. Keep that version when promoting the approved build.

## Implementation and verification

The site is plain HTML/CSS/JavaScript; there is no compilation or runtime dependency. Static output comprises index.html, styles.css, .nojekyll, src/ and assets/. Only the private Sites checkout has .openai/hosting.json and its packaged dist/ output.

`npm test` checks rules, content, picture availability, extra-practice selection and automatic advancement. Shared automatic advancement lives in src/auto-advance.js. Maths rules are separate from rendering in src/number-bonds.js and src/math-ui.js. Phonics catalogue/selection is shared through src/word-data.js, src/words.js and src/game.js.

Run the existing browser checks when the supported browser-preview environment is available. In this session the managed preview daemon was unavailable and the cloud browser required sign-in. Report that limit honestly; automated rule tests and authenticated HTTP file checks are not a substitute for visual/physical-device testing.

Regenerate PHONICS-COVERAGE.md with `node scripts/phonics-coverage.js` after catalogue changes. Record new artwork in ASSETS.md. Update this document when the user changes these decisions.
