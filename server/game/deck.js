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
        if (value === "J" || value === "K" || value === "Q") {
          cost = 10;
        } else if (value !== "A") {
          cost = parseInt(value);
        } else {
          cost = 11;
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

    //Sort the deck by card "costs" so that Ace is at the back
    let sortedDeck = [...this.cards];
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

    //Loop through the deck and calculate value of each card
    sortedDeck.forEach((card) => {
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

  reset() {
    this.cards = [];
  }
}
