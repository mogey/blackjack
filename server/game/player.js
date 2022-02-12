import Deck from "./deck.js";

export default class BJPlayer {
  constructor(id, name, money) {
    this.hand = new Deck();
    this.money = money;
    this.betAmount = 0;
    this.id = id;
    this.name = name;
    this.state = "bet"; //bet ready active stand lose win tie
  }

  bet(betAmount) {
    this.betAmount = betAmount;
    this.money -= betAmount;
    this.state = "ready";
  }

  active() {
    this.state = "active";
  }
  stand() {
    this.state = "stand";
  }

  ready() {
    this.state = "ready";
  }

  lose() {
    this.state = "lose";
  }

  win() {
    this.state = "win";
  }

  tie() {
    this.state = "tie";
  }
}
