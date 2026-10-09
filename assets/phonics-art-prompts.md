# Phonics and celebration sprite assets

Generated with the built-in image_gen tool in one parallel batch, one generation request per asset. No variants, retries, crops, resizing, or pixel edits. Images copied intact to this folder.

All four outputs are 1254×1254 PNGs in RGBA mode with alpha range 0–255. The tool returned 1254 square despite the requested 1536 square. Vocabulary grids use four equal columns and rows (313.5 pixels per cell); celebration grid uses three equal columns and rows (418 pixels per cell). Percentage-based CSS sprite sizing accommodates this directly: background-size 400% 400% for vocabulary; 300% 300% for celebration.

## Mapping

All mappings are row-major (left to right, top to bottom), zero-based index = row * columns + column.

### vocabulary-sheet-1.png — 4×4

light | night | glue | statue

screw | stew | hay | tray

boy | oyster | toe | dinosaur

astronaut | square | hare | shore

### vocabulary-sheet-2.png — 4×4

beach | claw | straw | queen

quilt | thumb | teeth | dress

grass | cliff | puzzle | fern

cube | flute | field | shield

### vocabulary-sheet-3.png — 4×4

cats | dogs | ducks | boats

boxes | brushes | dishes | benches

jumping | sleeping | reading | eating

singing | painting | cooking | drinking

### celebration-sheet-2.png — 3×3

White Rabbit | blue Caterpillar | Dormouse

Dodo | red squirrel | panda cub

tortoise | otter | spotted fawn

## Visual observations

All requested concepts are recognizable and remain in the correct equal-cell order. The toe and thumb are distinctly highlighted with arrows. The plural sheet contains exactly two of each requested plural object. Action icons are distinct. The White Rabbit visibly holds a gold pocket watch, the Caterpillar sits on a mushroom without smoking imagery, and the Dormouse stands beside its teacup. Transparent gutters are present, although illustrations fill more than the requested central 70–72% in some cells. Several silhouettes come close to a cell boundary. On the celebration sheet, the White Rabbit's highest ear reaches the top canvas edge; the tortoise and otter use broad/tall silhouettes. Owner should inspect CSS sprite framing before integration. The generated style is slightly more detailed and glossy than the original small Fluent vocabulary icons, but retains the friendly soft 3D look. No generation retry was made, as requested.

## Exact prompts

### Vocabulary sheet 1

```text
Use case: stylized-concept.
Asset type: production transparent 4x4 sprite atlas for a young children's phonics website.
Create ONE square 1536x1536 PNG image with genuine alpha transparency. The whole canvas background is transparent: no coloured backdrop, no checkerboard baked into the art, no board, no panels, no grid lines, no cell borders, no titles, no labels, no letters, no numbers, no watermark.
Art style: friendly rounded colourful 3D clay-like vocabulary icons, matching Microsoft Fluent emoji-like illustrations: soft smooth matte forms, rounded silhouettes, warm playful saturated colours, gentle studio shading, subtly dimensional, sparse recognizable details, clean edges, little or no ground shadow. The reference style has a soft orange 3D cat, a rounded dark purple top hat with bright pink band, and an orange carrot with fresh lime green leaves.
STRICT LAYOUT: exactly sixteen illustrations in an invisible equal four-column by four-row grid. Each cell is 384x384 pixels. Column centers x=192,576,960,1344; row centers y=192,576,960,1344. Every illustration or compact scene is independently centered on its cell center. Fit the entire silhouette including every accessory, shadow, arrow, and motion mark inside the central 72% of its cell (about 276x276 pixels maximum). This leaves transparent gutters of at least 54 pixels on all four sides of every cell. No object may cross a cell edge or touch another illustration. Keep all subjects at a consistent generous icon scale. Do NOT draw the invisible grid.
Content sequence is exact left-to-right, then top-to-bottom. Depict each listed concept once in its specified cell. Use full silhouettes without cropping. Tiny contained landscapes have no background outside the vignette. Children have diverse skin tones and are friendly and child-appropriate. Action poses must be distinct and readable.

SHEET 1 — EXACT CELL CONTENTS (these names are instructions only; do not draw words):
Row 1, column 1: light — lit light bulb.
Row 1, column 2: night — compact nighttime landscape vignette, dark sky with crescent moon above sleeping houses; sky and houses form a small contained island vignette.
Row 1, column 3: glue — school glue bottle with a drop of glue and no text.
Row 1, column 4: statue — clearly a small grey stone human statue on a plinth.
Row 2, column 1: screw — single metal screw.
Row 2, column 2: stew — bowl of chunky vegetable stew.
Row 2, column 3: hay — golden rectangular hay bale.
Row 2, column 4: tray — empty handled serving tray.
Row 3, column 1: boy — whole-body cheerful young boy in everyday clothes.
Row 3, column 2: oyster — open oyster shell with pearl.
Row 3, column 3: toe — close-up bare foot with ONLY the big toe distinctly coloured/highlighted and a small arrow pointing to that big toe.
Row 3, column 4: dinosaur — friendly green long-neck dinosaur.
Row 4, column 1: astronaut — whole-body person in space suit.
Row 4, column 2: square — one solid colourful square geometric shape.
Row 4, column 3: hare — whole-body brown hare with very long ears and long back legs.
Row 4, column 4: shore — small clear beach shoreline vignette where sea meets sand.
```

### Vocabulary sheet 2

```text
Use case: stylized-concept.
Asset type: production transparent 4x4 sprite atlas for a young children's phonics website.
Create ONE square 1536x1536 PNG image with genuine alpha transparency. The whole canvas background is transparent: no coloured backdrop, no checkerboard baked into the art, no board, no panels, no grid lines, no cell borders, no titles, no labels, no letters, no numbers, no watermark.
Art style: friendly rounded colourful 3D clay-like vocabulary icons, matching Microsoft Fluent emoji-like illustrations: soft smooth matte forms, rounded silhouettes, warm playful saturated colours, gentle studio shading, subtly dimensional, sparse recognizable details, clean edges, little or no ground shadow. The reference style has a soft orange 3D cat, a rounded dark purple top hat with bright pink band, and an orange carrot with fresh lime green leaves.
STRICT LAYOUT: exactly sixteen illustrations in an invisible equal four-column by four-row grid. Each cell is 384x384 pixels. Column centers x=192,576,960,1344; row centers y=192,576,960,1344. Every illustration or compact scene is independently centered on its cell center. Fit the entire silhouette including every accessory, shadow, arrow, and motion mark inside the central 72% of its cell (about 276x276 pixels maximum). This leaves transparent gutters of at least 54 pixels on all four sides of every cell. No object may cross a cell edge or touch another illustration. Keep all subjects at a consistent generous icon scale. Do NOT draw the invisible grid.
Content sequence is exact left-to-right, then top-to-bottom. Depict each listed concept once in its specified cell. Use full silhouettes without cropping. Tiny contained landscapes have no background outside the vignette. Children have diverse skin tones and are friendly and child-appropriate. Action poses must be distinct and readable.

SHEET 2 — EXACT CELL CONTENTS (these names are instructions only; do not draw words):
Row 1, column 1: beach — sand, parasol and blue water in compact vignette.
Row 1, column 2: claw — one clear animal clawed paw.
Row 1, column 3: straw — single striped drinking straw.
Row 1, column 4: queen — whole-body crowned queen in royal dress.
Row 2, column 1: quilt — folded patchwork quilt.
Row 2, column 2: thumb — hand giving thumbs up with ONLY the thumb distinctly coloured/highlighted and a small arrow pointing at the thumb.
Row 2, column 3: teeth — clear smiling mouth showing a row of clean white teeth.
Row 2, column 4: dress — one dress on its own.
Row 3, column 1: grass — small bright green patch of lawn.
Row 3, column 2: cliff — high rocky cliff over sea in compact vignette.
Row 3, column 3: puzzle — a small colourful jigsaw puzzle.
Row 3, column 4: fern — fern fronds in a simple pot.
Row 4, column 1: cube — one plain geometric cube.
Row 4, column 2: flute — one silver flute.
Row 4, column 3: field — green farm field with parallel crop rows in compact vignette.
Row 4, column 4: shield — one simple medieval shield.
```

### Vocabulary sheet 3

```text
Use case: stylized-concept.
Asset type: production transparent 4x4 sprite atlas for a young children's phonics website.
Create ONE square 1536x1536 PNG image with genuine alpha transparency. The whole canvas background is transparent: no coloured backdrop, no checkerboard baked into the art, no board, no panels, no grid lines, no cell borders, no titles, no labels, no letters, no numbers, no watermark.
Art style: friendly rounded colourful 3D clay-like vocabulary icons, matching Microsoft Fluent emoji-like illustrations: soft smooth matte forms, rounded silhouettes, warm playful saturated colours, gentle studio shading, subtly dimensional, sparse recognizable details, clean edges, little or no ground shadow. The reference style has a soft orange 3D cat, a rounded dark purple top hat with bright pink band, and an orange carrot with fresh lime green leaves.
STRICT LAYOUT: exactly sixteen illustrations in an invisible equal four-column by four-row grid. Each cell is 384x384 pixels. Column centers x=192,576,960,1344; row centers y=192,576,960,1344. Every illustration or compact scene is independently centered on its cell center. Fit the entire silhouette including every accessory, shadow, arrow, and motion mark inside the central 72% of its cell (about 276x276 pixels maximum). This leaves transparent gutters of at least 54 pixels on all four sides of every cell. No object may cross a cell edge or touch another illustration. Keep all subjects at a consistent generous icon scale. Do NOT draw the invisible grid.
Content sequence is exact left-to-right, then top-to-bottom. Depict each listed concept once in its specified cell. Use full silhouettes without cropping. Tiny contained landscapes have no background outside the vignette. Children have diverse skin tones and are friendly and child-appropriate. Action poses must be distinct and readable.

SHEET 3 — EXACT CELL CONTENTS (these names are instructions only; do not draw words):
Row 1, column 1: cats — exactly TWO cats together.
Row 1, column 2: dogs — exactly TWO dogs.
Row 1, column 3: ducks — exactly TWO ducks.
Row 1, column 4: boats — exactly TWO boats.
Row 2, column 1: boxes — exactly TWO cardboard boxes.
Row 2, column 2: brushes — exactly TWO paintbrushes.
Row 2, column 3: dishes — exactly TWO dinner plates.
Row 2, column 4: benches — exactly TWO park benches.
Row 3, column 1: jumping — whole-body child airborne jumping, bent knees and clear motion marks.
Row 3, column 2: sleeping — child asleep in a small bed.
Row 3, column 3: reading — child clearly reading an open book.
Row 3, column 4: eating — child bringing spoonful of food to mouth with bowl.
Row 4, column 1: singing — child singing into microphone, a few musical notes.
Row 4, column 2: painting — child painting colourful picture on easel.
Row 4, column 3: cooking — child stirring food in a saucepan on counter; simple uncluttered scene.
Row 4, column 4: drinking — child raising glass of water to lips.
```

### Celebration sheet 2

```text
Use case: illustration-story.
Asset type: production transparent celebration character sprite atlas for a young children's phonics website.
Create ONE square 1536x1536 PNG with genuine alpha transparency. Exactly nine separate full-body cheerful animals on an invisible equal 3-column by 3-row grid, each character individually centered in one cell. No background, no panels, no grid lines, no labels, no words, no numbers, no watermark, no baked-in checkerboard.
Style/medium: polished painted children's storybook animal illustrations. Match a friendly picture-book style with fluffy detailed painted fur or feathers, softly modelled forms, richly shaded warm colours, large sparkling expressive eyes, rounded cute proportions, joyful faces, and clean cutout edges. The character sheet reference has a white rabbit wearing a blue waistcoat, orange fox, purple cat, spaniel, hedgehog, lion, owl, bear and penguin. Generate the NEW nine characters listed below, not these reference examples.
Strict layout: equal cells are 512x512 pixels. Column center x=256,768,1280; row center y=256,768,1280. Every character including feet, limbs, tail, ears, accessories, and its mushroom or teacup if requested must fit entirely within the central 70% of its cell (about 358x358 pixels maximum), leaving large transparent gutters of at least 77 pixels on all sides. Entire body visible without crops or overlap. One clearly recognizable character per cell. Full-body cheerful celebratory pose for each, diverse poses.
EXACT ROW-MAJOR CONTENTS; these names are directions only:
Top left: White Rabbit, an adorable whole-body white rabbit wearing a blue waistcoat, holding a clearly visible gold pocket watch out in one paw. Long ears, all limbs and feet visible.
Top center: cute blue Caterpillar perched on a mushroom; entire curled caterpillar body and little feet visible. A welcoming smile. No hookah, no smoking, no smoke.
Top right: tiny adorable Dormouse standing BESIDE a teacup; full body and entire tail visibly outside the cup, paws and feet visible.
Middle left: friendly Dodo with a whimsical scarf, full body, wings, beak and both feet visible.
Middle center: regular red squirrel with its full bushy tail visible, all limbs and feet visible.
Middle right: regular panda cub, playful full-body stance, all limbs visible.
Bottom left: regular tortoise, full shell, head, four legs and tail visible.
Bottom center: regular otter, cheerful upright full-body pose, full tail and all limbs visible.
Bottom right: regular spotted fawn, cheerful standing full-body pose, four legs, ears and short tail visible.
Avoid any text or letters. Characters must not cross cells; maintain generous transparent outer margins and spacing.
```

