import Card from "./card.js";

const suits = ["clubs", "diamonds", "hearts", "spades"];
const values = [
  "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
];

export default class Deck {
  constructor(cards) {
    if (cards) {
      this.cards = cards;
    } else {
      this.cards = [];
    }
    this.value = this.getDeckValue();
  }

  generateDeck() {
    this.reset();
    suits.forEach((suit) => {
      values.forEach((value) => {
        this.addCard(new Card(suit, value));
      });
    });
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let r = this.getRandomInt(i + 1);
      let temp = this.cards[r];
      this.cards[r] = this.cards[i];
      this.cards[i] = temp;
    }
  }

  drawCard(visible) {
    if (this.cards.length === 0) return null;
    const card = this.cards.pop();
    if (visible) {
      card.visible = true;
    }
    return card;
  }

  addCard(card) {
    this.cards.push(card);
    return card;
  }

  getDeckValue() {
    this.value = 0;
    this.sortByCost(this.cards).forEach((card) => {
      if (card.value === "J" || card.value === "K" || card.value === "Q") {
        this.value += 10;
      } else if (card.value !== "A") {
        this.value += parseInt(card.value);
      } else if (card.value === "A") {
        if (this.value + 11 > 21) {
          this.value += 1;
        } else {
          this.value += 11;
        }
      }
    });
    return this.value;
  }

  sortByCost(deck) {
    let sortedDeck = [...deck];
    sortedDeck.sort((a, b) => a.cost - b.cost);
    return sortedDeck;
  }

  reset() {
    this.cards = [];
  }
}

// --- Poker Hand Evaluation ---

const HAND_NAMES = {
  1: "High Card",
  2: "One Pair",
  3: "Two Pair",
  4: "Three of a Kind",
  5: "Straight",
  6: "Flush",
  7: "Full House",
  8: "Four of a Kind",
  9: "Straight Flush",
  10: "Royal Flush",
};

export function getHandName(rank) {
  return HAND_NAMES[rank] || "Unknown";
}

/**
 * Evaluate a 5-card poker hand and return a comparable score array.
 * score[0] = hand rank (1-10), remaining elements are kickers for tiebreaking.
 */
export function evaluateFiveCards(cards) {
  const costs = cards.map((c) => c.cost).sort((a, b) => a - b);
  const suitSet = new Set(cards.map((c) => c.suit));
  const isFlush = suitSet.size === 1;

  let isStraight = true;
  for (let i = 1; i < 5; i++) {
    if (costs[i] !== costs[i - 1] + 1) {
      isStraight = false;
      break;
    }
  }
  const isWheel =
    costs[0] === 2 &&
    costs[1] === 3 &&
    costs[2] === 4 &&
    costs[3] === 5 &&
    costs[4] === 14;
  if (isWheel) isStraight = true;

  const counts = {};
  costs.forEach((c) => {
    counts[c] = (counts[c] || 0) + 1;
  });

  const groups = Object.entries(counts)
    .map(([val, cnt]) => ({ value: parseInt(val), count: cnt }))
    .sort((a, b) => b.count - a.count || b.value - a.value);

  if (isFlush && isStraight) {
    if (costs[0] === 10 && costs[4] === 14) return [10, 14];
    if (isWheel) return [9, 5];
    return [9, costs[4]];
  }
  if (groups[0].count === 4) {
    return [8, groups[0].value, groups[1].value];
  }
  if (groups[0].count === 3 && groups[1].count === 2) {
    return [7, groups[0].value, groups[1].value];
  }
  if (isFlush) {
    return [6, ...costs.slice().reverse()];
  }
  if (isStraight) {
    if (isWheel) return [5, 5];
    return [5, costs[4]];
  }
  if (groups[0].count === 3) {
    return [4, groups[0].value, groups[1].value, groups[2].value];
  }
  if (groups[0].count === 2 && groups[1].count === 2) {
    const highPair = Math.max(groups[0].value, groups[1].value);
    const lowPair = Math.min(groups[0].value, groups[1].value);
    return [3, highPair, lowPair, groups[2].value];
  }
  if (groups[0].count === 2) {
    return [
      2,
      groups[0].value,
      groups[1].value,
      groups[2].value,
      groups[3].value,
    ];
  }
  return [1, ...costs.slice().reverse()];
}

export function compareScores(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] || 0;
    const bv = b[i] || 0;
    if (av > bv) return 1;
    if (av < bv) return -1;
  }
  return 0;
}

function combinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map((c) => [first, ...c]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

/**
 * Given 5-7 cards, find the best 5-card poker hand.
 */
export function getBestHand(cards) {
  if (cards.length < 5) return null;
  if (cards.length === 5) {
    const score = evaluateFiveCards(cards);
    return { cards, score, name: getHandName(score[0]), rank: score[0] };
  }

  const combos = combinations(cards, 5);
  let bestScore = null;
  let bestCombo = null;

  for (const combo of combos) {
    const score = evaluateFiveCards(combo);
    if (!bestScore || compareScores(score, bestScore) > 0) {
      bestScore = score;
      bestCombo = combo;
    }
  }

  return {
    cards: bestCombo,
    score: bestScore,
    name: getHandName(bestScore[0]),
    rank: bestScore[0],
  };
}
