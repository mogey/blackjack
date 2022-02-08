import Deck from "./deck.js";
import Card from "./card.js";

let MyDeck = new Deck();

//Test for royal flush [10]
MyDeck = new Deck([
  new Card("clubs", "A"),
  new Card("clubs", "K"),
  new Card("clubs", "Q"),
  new Card("clubs", "J"),
  new Card("clubs", "10"),
]);
console.log(MyDeck.getPokerValue());
//Test for straight flush ```needs to be implemented [9]

//Test for four of a kind ```implementation done [8]

//Test for full house [7]

//test for flush ```implementation done [6]

//test for straight ```implementation done [5]

//test for three of a kind [4]

//test for two pairs 3

//test for 1 pair [2]

//test for high card [1]
