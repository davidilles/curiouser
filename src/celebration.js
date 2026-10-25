const original = "./assets/celebration/full-body-friends.png";
const extra = "./assets/celebration/more-friends.png";

export const CELEBRATION_FRIENDS = [
  ["rabbit", "rabbit", original, 0],
  ["fox", "fox", original, 1],
  ["cat", "the Cheshire Cat", original, 2, true],
  ["dog", "puppy", original, 3],
  ["hedgehog", "hedgehog", original, 4],
  ["lion", "lion", original, 5],
  ["owl", "owl", original, 6],
  ["bear", "bear cub", original, 7],
  ["penguin", "penguin", original, 8],
  ["white-rabbit", "the White Rabbit", extra, 0, true],
  ["caterpillar", "the Caterpillar", extra, 1, true],
  ["dormouse", "the Dormouse", extra, 2, true],
  ["dodo", "the Dodo", extra, 3, true],
  ["squirrel", "squirrel", extra, 4],
  ["panda", "panda cub", extra, 5],
  ["tortoise", "tortoise", extra, 6],
  ["otter", "otter", extra, 7],
  ["fawn", "fawn", extra, 8],
].map(([id, name, image, cell, special = false]) => ({ id, name, image, cell, special }));

export const WONDERLAND_CHANCE = 0.2;

export function chooseCelebrationFriend(previousId = null, random = Math.random, mistakeFree = true) {
  const special = mistakeFree && random() < WONDERLAND_CHANCE;
  const choices = CELEBRATION_FRIENDS.filter((friend) => friend.special === special && friend.id !== previousId);
  return choices[Math.floor(random() * choices.length)];
}

// These four friends are exclusive to the Queen's Ten. Their measured square
// viewports preserve full bodies in the original, unedited 1254px atlas.
export const GARDEN_FRIENDS = [
  ["garden-frog", "frog", [60, 80, 560, 560]],
  ["garden-flamingo", "flamingo", [620, 12, 634, 634]],
  ["garden-peacock", "peacock", [0, 646, 665, 665]],
  ["garden-butterfly", "butterfly", [650, 646, 604, 604]],
].map(([id, name, bounds]) => ({ id, name, bounds, size: 1254,
  image: "./assets/celebration/garden-friends.png", special: false, gardenOnly: true }));
// Rare visitors belong only to the roses game, just as the Wonderland draw
// makes a phonics win feel special. Keep the original artwork unedited.
export const UNICORN_FRIENDS = [
  ["rose-unicorn", "the Rose Unicorn", 0],
  ["lavender-unicorn", "the Lavender Unicorn", 1],
  ["rainbow-unicorn", "the Rainbow Unicorn", 2],
  ["starlight-unicorn", "the Starlight Unicorn", 3],
].map(([id, name, cell]) => ({ id, name, cell, columns: 2,
  image: "./assets/celebration/unicorn-friends.png", special: true, gardenOnly: true, unicorn: true }));
export const UNICORN_CHANCE = 0.2;
export const MATH_CELEBRATION_FRIENDS = [...CELEBRATION_FRIENDS, ...GARDEN_FRIENDS, ...UNICORN_FRIENDS];

export function chooseMathCelebrationFriend(previousId = null, random = Math.random, mistakeFree = true) {
  // Preserve the first-win garden welcome. Later wins have one 20% unicorn
  // draw; the remaining wins use the existing garden/familiar mix.
  if (mistakeFree && previousId && random() < UNICORN_CHANCE) {
    const choices = UNICORN_FRIENDS.filter(friend => friend.id !== previousId);
    return choices[Math.floor(random() * choices.length)];
  }
  if (!previousId || random() < .5) {
    const choices = GARDEN_FRIENDS.filter(friend => friend.id !== previousId);
    return choices[Math.floor(random() * choices.length)];
  }
  return chooseCelebrationFriend(previousId, random, mistakeFree);
}

export function celebrationStyle(friend) {
  if (friend.bounds) {
    const [x, y, w, h] = friend.bounds;
    return `background-image:url('${friend.image}');background-size:${friend.size / w * 100}% ${friend.size / h * 100}%;background-position:${x / (friend.size - w) * 100}% ${y / (friend.size - h) * 100}%`;
  }
  const columns = friend.columns ?? 3;
  const step = 100 / (columns - 1);
  return `background-image:url('${friend.image}');background-size:${columns * 100}% ${columns * 100}%;background-position:${friend.cell % columns * step}% ${Math.floor(friend.cell / columns) * step}%`;
}

// One celebration component keeps the speech bubble, entrance animation and
// reduced-motion behaviour identical across all three games.
export function celebrationMarkup(friend) {
  return `<div class="animal-celebration ${friend.special ? "wonderland-visit" : ""}">
    <h1 id="result-title" class="animal-speech" tabindex="-1">Well Done!</h1>
    <div class="animal-entrance"><span class="celebration-animal" style="${celebrationStyle(friend)}" data-animal="${friend.id}" data-special="${friend.special}" data-garden-only="${Boolean(friend.gardenOnly)}" role="img" aria-label="${friend.name}, celebrating with its whole body visible"></span><span class="animal-shadow" aria-hidden="true"></span></div>
    <span class="celebration-star star-left" aria-hidden="true">✦</span><span class="celebration-star star-right" aria-hidden="true">✧</span>
  </div>`;
}
