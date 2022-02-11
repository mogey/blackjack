import Deck from "./deck.js";
import Card from "./card.js";
import BlackjackLobby from "./BlackjackLobby.js";
import Player from "./player.js";

let MyDeck = new Deck();

//Test for royal flush [10]
MyDeck = new Deck([
  new Card("clubs", "A"),
  new Card("clubs", "K"),
  new Card("clubs", "Q"),
  new Card("clubs", "J"),
  new Card("clubs", "10"),
]); /*
console.log(MyDeck);
console.log(MyDeck.getPokerValue());*/
//Test for straight flush ```needs to be implemented [9]

//Test for four of a kind ```implementation done [8]

//Test for full house [7]

//test for flush ```implementation done [6]

//test for straight ```implementation done [5]

//test for three of a kind [4]

//test for two pairs 3

//test for 1 pair [2]

//test for high card [1]
let playerOne = new Player(1, "Mogey", 1000);
let playerTwo = new Player(2, "Bob", 1000);

let game = new BlackjackLobby(0, playerOne);
game.addPlayer(playerTwo);

game.bet(playerOne, 200);
game.bet(playerTwo, 1000);

game.initRound();

game.hit(playerOne);
game.stand(playerTwo);
game.stand(playerOne);

console.log(JSON.stringify(game, null, 4));
