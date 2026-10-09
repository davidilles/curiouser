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
