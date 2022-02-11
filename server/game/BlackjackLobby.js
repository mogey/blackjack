import Deck from "./deck.js";
import Player from "./player.js";

export default class BlackjackLobby {
  constructor(id, host) {
    this.id = id;
    this.gameDeck = new Deck();
    this.players = [];
    this.players.push(new Player(0, "Dealer", 0));
    this.players.push(host);
    this.turnPointer = 0;
    this.state = "bet"; //bet active end
  }

  bet(player, amount) {
    if (this.doesPlayerExist(player)) {
      this.players[this.players.indexOf(player)].bet(amount);
    } else {
      return false;
    }
  }

  stateCheck(state) {
    let readyCheck = true;
    this.players.forEach((player) => {
      if (player.state !== state) {
        readyCheck = false;
      }
    });
    return readyCheck;
  }

  initRound() {
    this.gameDeck.generateDeck();
    this.gameDeck.shuffle();
    this.players[0].ready();

    if (this.stateCheck("ready")) {
      this.state = "active";
      this.players.forEach((player) => {
        this.gameDeck.drawCard();
        player.hand.addCard(this.gameDeck.drawCard());
        player.hand.addCard(this.gameDeck.drawCard());
        player.active();
      });
      this.turnPointer = 1;
    } else {
      return false;
    }
  }

  doesPlayerExist(player) {
    if (this.players.indexOf(player)) {
      return this.players.indexOf(player);
    } else {
      return false;
    }
  }

  hit(player) {
    if (this.doesPlayerExist(player)) {
      let playerIndex = this.doesPlayerExist(player);
      this.players[playerIndex].hand.addCard(this.gameDeck.drawCard());
      if (this.players[playerIndex].hand.getDeckValue() > 21) {
        this.players[playerIndex].lose();
      }
      if (this.players[playerIndex].hand.getDeckValue() === 21) {
        this.players[playerIndex].stand();
      }
      if (!this.stateCheck("active")) {
        this.checkHands();
      }
      return true;
    } else {
      return false;
    }
  }

  stand(player) {
    if (this.doesPlayerExist(player)) {
      this.players[this.doesPlayerExist(player)].stand();
      if (!this.stateCheck("active")) {
        this.checkHands();
      }
      return true;
    } else {
      return false;
    }
  }

  addPlayer(player) {
    this.players.push(player);
  }

  dropPlayer(player) {
    if (this.players.indexOf(player) === 1) {
      return false;
    }
    if (this.turnPointer === this.players.indexOf(player)) {
      this.turnPointer--;
    }
    this.players = this.players.splice(this.players.indexOf(player), 2);
    return true;
  }

  checkHands() {
    if (!this.stateCheck("active")) {
      this.state = "end";
    }
    this.players.forEach((player) => {
      if (player.hand.getDeckValue() > 21) {
        player.lose();
        return;
      }
      if (this.players[0].hand.getDeckValue() > 21 && player.id !== 0) {
        player.win();
        return;
      }
      if (
        this.players[0].hand.getDeckValue() === player.hand.getDeckValue() &&
        player.id !== 0
      ) {
        player.tie();
        return;
      }
      if (player.id === 0) {
        return;
      }
      let playerDiff = 21 - player.hand.getDeckValue();
      let dealerDiff = 21 - this.players[0].hand.getDeckValue();

      if (playerDiff < dealerDiff) {
        player.win();
        return;
      }
      if (playerDiff > dealerDiff) {
        player.lose();
        return;
      }
      if (playerDiff === dealerDiff) {
        player.tie();
        return;
      }
    });
  }
}
