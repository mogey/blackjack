import Card from "./card.js";

const suits = ["clubs", "diamonds", "hearts", "spades"];
const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export default class Deck {
  /**
   *
   * @param {array} cards Instantiate Deck with an array of card objects, defaults to empty array
   */
  constructor(cards) {
    if (cards) {
      this.cards = cards;
    } else {
      this.cards = [];
    }
    this.value = this.getDeckValue();
  }

  /**
   * Resets deck and then generates a card for each suit and value
   */
  generateDeck() {
    this.reset();
    suits.forEach((suit, i) => {
      values.forEach((value, j) => {
        let cost = 0;
        if (value === "J") {
          cost = 11;
        } else if (value === "Q") {
          cost = 12;
        } else if (value === "K") {
          cost = 13;
        } else if (value === "A") {
          cost = 14;
        } else {
          cost = parseInt(value);
        }

        this.addCard(new Card(suit, value, cost));
      });
    });
  }

  /**
   *
   * @param {int} max upper limit of random number to get from 0, exclusive
   * @returns {int} between 0 and max-1
   */
  getRandomInt(max) {
    //Gets a random number from 0 to max-1
    return Math.floor(Math.random() * max);
  }

  /**
   * Shuffles card positions in deck's array
   */
  shuffle() {
    //Swap each card with a random card between it and the bottom of the deck
    for (let i = this.cards.length - 1; i != 0; i--) {
      let r = this.getRandomInt(i);
      let temp = this.cards[r];
      this.cards[r] = this.cards[i];
      this.cards[i] = temp;
    }
  }

  /**
   *
   * @param {boolean} visible set if the card should be visible when drawn from the deck
   * @returns {Card} the last Card in the Deck array
   */
  drawCard(visible) {
    if (visible) {
      const card = this.cards.pop();
      card.visible = true;
      return card;
    } else {
      return this.cards.pop();
    }
  }

  /**
   *
   * @param {Card} card card to remove from Deck
   */
  removeCard(card) {
    this.cards = this.cards.splice(this.cards.indexOf(card), 1);
  }

  /**
   *
   * @param {Card} card Card to add to Deck
   * @returns {Card} returns Card added to deck
   */
  addCard(card) {
    this.cards.push(card);
    return card;
  }

  /**
   *
   * @returns {int} value of the deck accounting for aces
   */
  getDeckValue() {
    this.value = 0;

    //Loop through the deck and calculate value of each card
    this.sortByCost(this.cards).forEach((card) => {
      if (card.value === "J" || card.value === "K" || card.value === "Q") {
        this.value += 10;
      } else if (card.value !== "A") {
        this.value += parseInt(card.value);
      } else if (card.value === "A") {
        //If an Ace being 11 puts us over, make it 1
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

    //Sort the deck by card "costs" so that Ace is at the back
    sortedDeck.sort((a, b) => {
      if (a.cost > b.cost) {
        return 1;
      }
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost === b.cost) {
        return 0;
      }
    });
    return sortedDeck;
  }

  sortBySuit(deck) {
    let sortedDeck = [...deck];

    sortedDeck.sort((a, b) => {
      if (a.suit === b.suit) {
        return 0;
      }
      if (a.suit < b.suit) {
        return -1;
      }
      if (a.suit > b.suit) {
        return 1;
      }
    });
    return sortedDeck;
  }

  isFlush() {
    let sortedDeck = sortBySuit(this.cards);

    if (sortedDeck[i].suit === sortedDeck[i - sortedDeck.length].suit) {
      return true;
    }

    return false;
  }

  isStraight() {
    let sortedDeck = this.sortByCost(this.cards);

    //if the first card is ace check if its ace 2 3 4 5 or if last card is ace check if its k q j 10

    if (sortedDeck[4].cost === 14) {
      if (
        sortedDeck[3].cost === 13 &&
        sortedDeck[2].cost === 12 &&
        sortedDeck[1].cost === 11 &&
        sortedDeck[0].cost === 10
      ) {
        return true;
      }
      if (
        sortedDeck[3].cost === 5 &&
        sortedDeck[2].cost === 4 &&
        sortedDeck[1].cost === 3 &&
        sortedDeck[0].cost === 2
      ) {
        return true;
      }
    }

    for (let i = 1; i < 4; i++) {
      //2 3 4 5, check if we're we are  is equal to last index + 1
      if (sortedDeck[i].cost !== sortedDeck[i - 1].cost + 1) {
        return false;
      }

      return true;
    }
  }

  fourOfAkind() {
    let sortedDeck = this.sortByCost(this.cards);

    for (let i = 0; i < 3; i++) {
      if (!(sortedDeck[i].value === sortedDeck[i + 1].value)) {
        return false;
      }
    }
    for (let i = 4; i != 1; i--) {
      if (!(sortedDeck[i].value === sortedDeck[i - 1].value)) {
        return false;
      }
    }
    return true;
  }

  reset() {
    this.cards = [];
  }
}
