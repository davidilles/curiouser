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

export function chooseCelebrationFriend(previousId = null, random = Math.random) {
  const special = random() < WONDERLAND_CHANCE;
  const choices = CELEBRATION_FRIENDS.filter((friend) => friend.special === special && friend.id !== previousId);
  return choices[Math.floor(random() * choices.length)];
}

export function celebrationStyle(friend) {
  return `background-image:url('${friend.image}');background-position:${friend.cell % 3 * 50}% ${Math.floor(friend.cell / 3) * 50}%`;
}
