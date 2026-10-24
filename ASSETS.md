# Curiouser artwork, sounds and fonts

All runtime assets are bundled locally. No font or picture CDN is contacted when someone plays.

## Picture collection

`assets/pictures/*.png` are unmodified 3D illustrations from Microsoft's [Fluent Emoji](https://github.com/microsoft/fluentui-emoji), under the MIT licence. The full notice is included at [`assets/pictures/LICENSE.txt`](assets/pictures/LICENSE.txt). Per-file download URLs, pinned to upstream commit `1ffb34c752ecf5d402f04cfb4b392c77f57c54bc`, are recorded in [`assets/pictures/sources.json`](assets/pictures/sources.json). Local filenames correspond to familiar British English words, which may differ from the upstream emoji names.

The collection includes a few spare assets for future changes. Avoid using an image for a word that it does not clearly depict.

## Reading friends illustration

[`assets/reading-friends.png`](assets/reading-friends.png) is an original generated illustration, created with the built-in OpenAI image-generation tool for this project. It depicts a fox and rabbit reading a book; it does not reproduce any adaptation's Alice character designs.

Prompt used:

```text
Use case: illustration-story
Asset type: hero illustration for a children's phonics games website named Play Patch.
Primary request: A standalone children's picture-book style illustration of an adorable small orange fox and a round cream bunny sitting together reading one open mint-green book. Happy, friendly faces. One tiny yellow star near them.
Style/medium: Modern, high-quality storybook sticker illustration with rounded simple shapes and subtle paper/gouache texture.
Composition/framing: Landscape-ish composition designed to fit a 500 by 360 display area. Both characters, their ears, tails, feet, the book, and the little star fully visible, with comfortable transparent margins. Balanced, compact grouping.
Color palette: Rich orange, mint green, warm cream, yellow star, dark warm brown minimal facial details.
Scene/backdrop: Genuinely transparent background with preserved alpha; no scene, no rectangle, no backdrop.
Mood: Warm, cheerful, welcoming, cute, and child-friendly.
Constraints: Exactly one fox, one bunny, one open book, one tiny star. No letters, words, numbers, UI, logos, watermarks, or extra objects. Blank book pages. All figures fully visible.
```

## Typography

Locally hosted Latin WOFF2 subsets of **Nunito**, **Andika** and **Fraunces** are from [Google Fonts](https://github.com/google/fonts), licensed under the SIL Open Font License 1.1. Their notices are in `assets/fonts/*-OFL.txt`. Andika is used for target words; Nunito for interface text; Fraunces for storybook headings.

## Interface artwork

Simple interface symbols and the favicon are authored SVG geometry. Wonderland-inspired copy and card-suit motifs are original to this website, with no artwork taken from a film or other adaptation.

## Sound effects

`assets/sounds/correct.wav` and `incorrect.wav` are original synthesised effects created for Curiouser, with no third-party recordings or samples. Both are mono, 44.1 kHz, 16-bit PCM WAV files. The correct-answer sound is a soft, ascending music-box flourish (G5–B5–D6–G6) with quiet bell echoes; the retry sound is two mellow, pitch-bending bubble pops. Both have smooth attacks and fades. Rebuild them with `node scripts/make-sounds.js`. They are played using native HTML audio so the game does not depend on starting a Web Audio context on iOS.


## Full-body celebration friends (v1.2.2)

`assets/celebration/full-body-friends.png` is original artwork made with the built-in OpenAI image-generation tool. The transparent 1254 × 1254 PNG has nine equal 418 × 418 cells: rabbit, fox, cat; puppy, hedgehog, lion; owl, bear cub, penguin. It is displayed as a CSS sprite sheet without changing the source image. Every animal is shown in full, with ears, paws/feet, wings and tails inside its cell. These drawings replace the small word-picture icons in the win celebration only.

Generation brief: Create a transparent 3 × 3 sprite atlas of nine complete, cheerful storybook animals for Curiouser. Top row: white waistcoat rabbit, orange fox, lilac Cheshire-like smiling cat. Middle row: floppy-eared puppy, hedgehog, little lion. Bottom row: owl, bear cub, penguin. Soft painted children's-book style, full bodies and visible limbs, equal cells, one centred animal per cell, ample transparent margins, no text, labels, floor or backdrop.

Final correction prompt:

```text
Edit target: the attached transparent 3x3 animal sprite atlas. Make ONE targeted correction: shrink every animal to 70% of its current size and recenter each within an exact equal 3x3 grid, restoring the top rabbit ear completely. Keep the same nine character identities, designs, order, cheerful poses, and soft children's storybook painted style. Preserve actual transparent alpha. Clean away ALL colored speckles and paint crumbs outside animal silhouettes.
All nine full bodies must fit their own cell with generous empty transparent margins. Each silhouette including ears, tail, limbs, feet, feathers must occupy at most 70% of its cell width and height. Their center positions must be exactly 1/6, 1/2 and 5/6 of canvas width and height. The entire outer 10% of each cell must be absolutely empty transparent pixels. Complete rabbit ear tips, full fox and cat tails, paws, owl wings and feet must all remain visible. Exact equal cell grid is required for CSS background-size 300% and positions 0/50/100%.
Keep order: top white waistcoat rabbit / orange fox / lilac Cheshire-like cat; middle floppy-eared puppy / hedgehog / little lion; bottom owl / bear cub / penguin. Full-body illustrations only, no heads or busts. Square PNG, preferably 1536x1536. No grid lines, no floor, no background, no text, no labels.
```

## Alice book illustration (v1.2.2)

`assets/reading-friends-alice.png` is a transparent edit of the original reading-friends artwork, created with the built-in OpenAI image-generation tool. The original is retained. The fox and rabbit now read a book titled Alice in Wonderland.

Prompt:

```text
Edit this existing transparent children's-book illustration for the Curiouser phonics website. Keep the same fox and white rabbit, their poses, full bodies, expressive faces, painterly soft texture, green book, framing and transparent background. Change ONLY the outward-facing front book cover (the right-hand green cover as seen by the viewer): add the clearly legible title 'Alice in Wonderland' in three centered lines, elegant large cream-gold storybook serif letters, following the perspective of the cover. A tiny gold key ornament beneath is optional only if there is room. Make the exact words Alice in Wonderland large and readable at normal website hero size. No other words. Keep the animals and their anatomy and edges intact, no new characters, no border, no opaque background. This is an edit to the supplied image, not a redesign.
```


## Expanded vocabulary and celebration friends (v1.3.0)

Created with the **built-in OpenAI image-generation tool**, using the existing vocabulary icons and celebration atlas as style references. The original generated PNGs are preserved without pixel edits. Exact prompts, cell mappings and generation observations are in [`assets/phonics-art-prompts.md`](assets/phonics-art-prompts.md).

- `assets/pictures/phonics-1.png`: 16 new vowel-pattern pictures.
- `assets/pictures/phonics-2.png`: 16 further spelling-pattern pictures.
- `assets/pictures/phonics-3.png`: 8 plural pictures and 8 actions.
- `assets/celebration/more-friends.png`: White Rabbit with pocket watch, Caterpillar, Dormouse, Dodo, squirrel, panda, tortoise, otter and fawn.

Each sheet is an RGBA PNG, 1254×1254, with genuine transparency. Vocabulary sheets use four rows and four columns. `src/word-data.js` records measured SVG viewports around individual illustrations, preserving complete subjects where their edges extend beyond a nominal cell. The nine celebration friends use a three-by-three CSS sprite sheet. Some generated illustrations use tighter margins than requested; the White Rabbit's ear reaches the top of its source cell. No picture files are fetched from another server while playing.


## Focused phonics atlas (v1.4.0)

`assets/pictures/phonics-focus.png` is an original AI-generated 1254×1254 transparent atlas created with OpenAI image generation for this project. Its 3×3 cells depict herb, perch, herd; hear, beard, tear; fur, curl, surf. The original sheet is used without resampling, through clipped SVG viewports.

Prompt: One square 3×3 educational picture atlas; friendly soft 3D clay storybook illustrations on transparent background. In row-major order: potted basil herb; bird perched on a branch; herd of three cows; child cupping a hand to an ear with sound marks; man's full beard; eye with teardrop; brown fur swatch; golden curled lock of hair; surfer riding a wave. Separate equal cells, no text or grid lines.

The maths garden's ten roses are original code-drawn SVG shapes so the displayed quantities are exact. Existing crown and rose pictures are reused on its home card.


## Garden celebration friends (v1.4.2)

`assets/celebration/garden-friends.png` is an original 1254×1254 transparent image created with the built-in OpenAI image-generation tool, using `full-body-friends.png` only as a style reference. It contains frog, flamingo, peacock and butterfly in a 2×2 arrangement. The generated PNG is preserved without editing. Measured square CSS viewports in `src/celebration.js` keep full bodies visible; the peacock viewport extends into transparent space below the original sheet. These animals are available only in the Queen's Ten.

Prompt: Create a new square transparent sprite atlas in the reference's soft painterly 3D storybook style, with joyful expressive faces and full-body happy poses. Exactly two equal columns and two equal rows: top left a smiling green frog waving; top right a cheerful pink flamingo with open wings and full legs and feet; bottom left a blue-green peacock with open fan tail and visible feet; bottom right a golden-coral butterfly with friendly eyes, full antennae and four wings. Center each whole animal within its cell with transparent margins. No text, speech bubbles, numbers, grid lines, frames or background.
