// One vocabulary catalogue for both games. These are practice bands, not a
// school-specific teaching sequence. Each entry has a reviewed spelling split
// and one main practice focus; coverage refers to content, never child scores.
// Format: word | pieces | focus | optional piece type (syllables/compound/ending).
// A linked piece such as a_e surrounds the following piece: c + a_e + k = cake.
const entries = {
  autumn: `
cat|c a t|short-a
dog|d o g|short-o
pig|p i g|short-i
hen|h e n|short-e
rat|r a t|short-a
fox|f o x|x
bat|b a t|short-a
ant|a n t|adjacent-consonants
bee|b ee|ee
duck|d u ck|ck
fish|f i sh|sh
sheep|sh ee p|ee
goat|g oa t|oa
cow|c ow|ow-cow
owl|ow l|ow-cow
snail|s n ai l|ai
frog|f r o g|adjacent-consonants
crab|c r a b|adjacent-consonants
shrimp|sh r i m p|adjacent-consonants
sun|s u n|short-u
moon|m oo n|oo-moon
star|s t ar|ar
rain|r ai n|ai
cloud|c l ou d|ou
hat|h a t|short-a
cap|c a p|short-a
socks|s o ck s|plural-s
boot|b oo t|oo-moon
bed|b e d|short-e
cup|c u p|short-u
map|m a p|short-a
bell|b e ll|ll
bus|b u s|short-u
car|c ar|ar
ship|sh i p|sh
boat|b oa t|oa
train|t r ai n|ai
tram|t r a m|adjacent-consonants
egg|e gg|short-e
nut|n u t|short-u
chips|ch i p s|ch
corn|c or n|or
milk|m i l k|adjacent-consonants
bag|b a g|short-a
pen|p e n|short-e
pin|p i n|short-i
web|w e b|short-e
log|l o g|short-o
lock|l o ck|ck
rock|r o ck|ck
box|b o x|x
book|b oo k|oo-book
hook|h oo k|oo-book
ring|r i ng|ng
chick|ch i ck|ch
shell|sh e ll|ll
shark|sh ar k|ar
tooth|t oo th|th-tooth
chain|ch ai n|ai
chair|ch air|air
coin|c oi n|oi
ear|ear|ear-near
tree|t r ee|ee
drum|d r u m|adjacent-consonants
flag|f l a g|adjacent-consonants
tent|t e n t|adjacent-consonants
nest|n e s t|adjacent-consonants
gift|g i f t|adjacent-consonants
plug|p l u g|adjacent-consonants
truck|t r u ck|ck
hand|h a n d|adjacent-consonants
leg|l e g|short-e
foot|f oo t|oo-book
brush|b r u sh|sh
spoon|s p oo n|oo-moon
coat|c oa t|oa
soap|s oa p|oa
torch|t or ch|or
scarf|s c ar f|ar
crown|c r ow n|ow-cow
clock|c l o ck|ck
light|l igh t|igh
night|n igh t|igh
queen|qu ee n|qu
quilt|qu i l t|qu
teeth|t ee th|th-tooth
dress|d r e ss|ss
cliff|c l i ff|ff
`,
  spring: `
cake|c a_e k|a-e
bike|b i_e k|i-e
kite|k i_e t|i-e
bone|b o_e n|o-e
phone|ph o_e n|ph
rose|r o_e s|o-e
snake|s n a_e k|a-e
whale|wh a_e l|wh
peach|p ea ch|ea-leaf
leaf|l ea f|ea-leaf
key|k ey|ey
wheel|wh ee l|wh
snow|s n ow|ow-snow
pie|p ie|ie-pie
tie|t ie|ie-pie
fly|f l y|y-fly
eye|eye|exception
nose|n o_e s|o-e
hole|h o_e l|o-e
tube|t u_e b|u-e
seal|s ea l|ea-leaf
beans|b ea n s|ea-leaf
meat|m ea t|ea-leaf
spider|spi der|longer-word|syllables
tiger|ti ger|longer-word|syllables
lion|li on|longer-word|syllables
zebra|ze bra|longer-word|syllables
donkey|d o n k ey|ey
monkey|m o n k ey|ey
purse|p ur se|ur
bird|b ir d|ir
shirt|sh ir t|ir
girl|g ir l|ir
worm|w or m|or-worm
saw|s aw|aw
ball|b a ll|a-ball
wave|w a_e v|a-e
slide|s l i_e d|i-e
skate|s k a_e t|a-e
plate|p l a_e t|a-e
grapes|g r a_e p s|a-e
glue|g l ue|ue-glue
statue|stat ue|ue-statue|syllables
screw|s c r ew|ew-screw
stew|s t ew|ew-stew
hay|h ay|ay
tray|t r ay|ay
boy|b oy|oy
oyster|oy s t er|oy
toe|t oe|oe-toe
beach|b ea ch|ea-leaf
claw|c l aw|aw
straw|s t r aw|aw
fern|f er n|er-fern
cube|c u_e b|u-e
flute|f l u_e t|u-e
field|f ie l d|ie-field
shield|sh ie l d|ie-field
`,
  summer: `
bread|b r ea d|ea-bread
feather|f ea th er|th-feather
pear|p ear|ear-bear
bear|b ear|ear-bear
deer|d eer|eer
horse|h or se|or
mouse|m ou se|ou
house|h ou se|ou
cheese|ch ee se|ee
rabbit|r a bb i t|longer-word
carrot|c a rr o t|longer-word
rocket|r o ck e t|longer-word
apple|a pp le|le
lemon|l e m o n|longer-word
melon|m e l o n|longer-word
pepper|p e pp er|er-unstressed
cherries|ch e rr ie s|plural-s
banana|ba na na|longer-word|syllables
tomato|to ma to|longer-word|syllables
potato|po ta to|longer-word|syllables
mushroom|mush room|oo-moon|syllables
pumpkin|pump kin|longer-word|syllables
ribbon|r i bb o n|longer-word
basket|bas ket|longer-word|syllables
bucket|b u ck e t|longer-word
magnet|mag net|longer-word|syllables
ladder|l a dd er|er-unstressed
hammer|h a mm er|er-unstressed
ticket|t i ck e t|longer-word
helmet|hel met|longer-word|syllables
trumpet|trum pet|longer-word|syllables
penguin|pen guin|longer-word|syllables
parrot|p a rr o t|longer-word
otter|o tt er|er-unstressed
badger|bad ger|longer-word|syllables
hamster|ham ster|longer-word|syllables
beaver|bea ver|longer-word|syllables
lizard|li zard|longer-word|syllables
camel|ca mel|longer-word|syllables
cricket|crick et|longer-word|syllables
lobster|lob ster|longer-word|syllables
elephant|el e phant|ph|syllables
dolphin|dol phin|ph|syllables
octopus|oc to pus|longer-word|syllables
hippo|h i pp o|longer-word
hedgehog|hedge hog|compound|compound
butterfly|butter fly|compound|compound
dragon|drag on|longer-word|syllables
snowman|snow man|compound|compound
sunflower|sun flower|compound|compound
teapot|tea pot|compound|compound
toothbrush|tooth brush|compound|compound
jellyfish|jelly fish|compound|compound
sandwich|sand wich|longer-word|syllables
rainbow|rain bow|compound|compound
sunglasses|sun glass es|compound|compound
window|win dow|longer-word|syllables
mirror|mir ror|longer-word|syllables
tractor|trac tor|longer-word|syllables
robot|ro bot|longer-word|syllables
crayon|cray on|ay|syllables
pencil|pen cil|longer-word|syllables
teddy|te dd y|y-happy
swan|s w a n|a-swan
watch|w a tch|tch
shoe|sh oe|oe-shoe
dice|d i_e c|soft-c
dinosaur|di no saur|au|syllables
astronaut|as tro naut|au|syllables
square|s qu are|are
hare|h are|are
shore|sh ore|ore
puzzle|p u zz le|zz
thumb|th u mb|silent-b
grass|g r a ss|a-grass
cats|cat s|plural-s|ending
dogs|dog s|plural-s|ending
ducks|duck s|plural-s|ending
boats|boat s|plural-s|ending
boxes|box es|plural-es|ending
brushes|brush es|plural-es|ending
dishes|dish es|plural-es|ending
benches|bench es|plural-es|ending
jumping|jump ing|ending-ing|ending
sleeping|sleep ing|ending-ing|ending
reading|read ing|ending-ing|ending
eating|eat ing|ending-ing|ending
singing|sing ing|ending-ing|ending
painting|paint ing|ending-ing|ending
cooking|cook ing|ending-ing|ending
drinking|drink ing|ending-ing|ending
`,
};

export function joinPieces(parts) {
  let word = "";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part.includes("_")) { word += part; continue; }
    const [start, end] = part.split("_");
    const middle = parts[i + 1];
    // Keep incomplete/misplaced linked pieces visibly invalid, rather than
    // silently dropping a letter or treating different wrong builds as equal.
    if (!middle || middle.includes("_")) word += part;
    else { word += start + middle + end; i++; }
  }
  return word;
}

const sheets = [
  ["light", "night", "glue", "statue", "screw", "stew", "hay", "tray", "boy", "oyster", "toe", "dinosaur", "astronaut", "square", "hare", "shore"],
  ["beach", "claw", "straw", "queen", "quilt", "thumb", "teeth", "dress", "grass", "cliff", "puzzle", "fern", "cube", "flute", "field", "shield"],
  ["cats", "dogs", "ducks", "boats", "boxes", "brushes", "dishes", "benches", "jumping", "sleeping", "reading", "eating", "singing", "painting", "cooking", "drinking"],
];
// Actual artwork viewports, measured from the untouched 1254px source sheets.
// Uneven illustration margins must not crop a helmet, arrow or plural object.
const bounds = [
  [[41,26,250,273],[338,37,280,249],[663,31,247,270],[1040,13,131,305],[42,350,250,248],[329,337,282,266],[641,375,287,211],[954,389,289,180],[50,630,211,283],[335,648,273,257],[667,647,254,253],[987,635,248,283],[68,931,222,303],[360,969,221,225],[668,931,237,302],[947,977,287,237]],
  [[36,56,269,231],[364,46,229,233],[693,47,213,244],[1000,28,193,272],[28,360,283,231],[363,345,235,252],[647,398,274,167],[979,352,237,245],[24,689,287,191],[346,658,258,244],[652,648,246,240],[956,642,280,272],[49,967,235,239],[330,945,277,266],[645,955,285,255],[992,946,211,264]],
  [[25,63,281,240],[332,62,290,248],[656,70,267,239],[949,93,286,212],[17,366,317,227],[362,349,217,256],[635,397,291,191],[958,349,274,254],[46,613,232,283],[342,664,280,237],[686,624,211,285],[971,632,256,265],[35,917,259,294],[337,917,278,299],[672,918,218,300],[981,929,250,269]],
];
const sprites = new Map(sheets.flatMap((words, sheet) => words.map((word, cell) =>
  [word, { image: `./assets/pictures/phonics-${sheet + 1}.png`, sprite: { size: 1254, bounds: bounds[sheet][cell], sheet, cell } }],
)));

export const WORD_GROUPS = Object.fromEntries(Object.entries(entries).map(([term, text], stage) => [
  term,
  text.trim().split("\n").map((line) => {
    const [word, split, focus, pieceType = "sounds"] = line.split("|");
    return {
      id: word, word, parts: split.split(" "), focus, pieceType, stage,
      image: `./assets/pictures/${word}.png`, ...sprites.get(word),
    };
  }),
]));
