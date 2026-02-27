import Deck from "./deck.js";

export default class BlackjackTable {
  constructor(id, maxPlayers = 5) {
    this.id = id;
    this.gameType = "blackjack";
    this.maxPlayers = maxPlayers;
    this.players = new Map();
    this.playerOrder = [];
    this.dealer = { hand: new Deck(), revealed: false };
    this.deck = new Deck();
    this.state = "waiting"; // waiting, betting, playing, results
    this.currentPlayerIndex = -1;
  }

  addPlayer(userId, username) {
    if (this.players.size >= this.maxPlayers) return false;
    if (this.players.has(userId)) return false;
    this.players.set(userId, {
      id: userId,
      username,
      hand: new Deck(),
      bet: 0,
      status: "idle",
      result: null,
      payout: 0,
    });
    this.playerOrder.push(userId);
    if (this.state === "waiting" && this.players.size >= 1) {
      this.state = "betting";
    }
    return true;
  }

  removePlayer(userId) {
    if (!this.players.has(userId)) return;
    this.players.delete(userId);
    this.playerOrder = this.playerOrder.filter((id) => id !== userId);

    if (this.players.size === 0) {
      this.state = "waiting";
      this.currentPlayerIndex = -1;
      return;
    }

    if (this.state === "playing") {
      const activePlayers = this.getActivePlayers();
      if (activePlayers.length === 0) {
        this.dealerPlay();
      } else if (this.currentPlayerIndex >= this.playerOrder.length) {
        this.currentPlayerIndex = 0;
        this.advanceToNextActive();
      }
    }

    if (this.state === "betting") {
      this.checkAllBetsPlaced();
    }
  }

  placeBet(userId, amount) {
    if (this.state !== "betting") return false;
    const player = this.players.get(userId);
    if (!player) return false;
    if (player.status === "ready") return false;
    if (amount <= 0) return false;

    player.bet = amount;
    player.status = "ready";
    this.checkAllBetsPlaced();
    return true;
  }

  checkAllBetsPlaced() {
    const allReady = this.playerOrder.every((id) => {
      const p = this.players.get(id);
      return p && p.status === "ready";
    });
    if (allReady && this.players.size > 0) {
      this.startRound();
    }
  }

  startRound() {
    this.deck = new Deck();
    this.deck.generateDeck();
    this.deck.shuffle();
    this.dealer.hand = new Deck();
    this.dealer.revealed = false;

    for (const [, player] of this.players) {
      player.hand = new Deck();
      player.result = null;
      player.payout = 0;
      player.status = "playing";
    }

    // Deal 2 rounds of cards
    for (let round = 0; round < 2; round++) {
      for (const pid of this.playerOrder) {
        const p = this.players.get(pid);
        p.hand.addCard(this.deck.drawCard(true));
      }
      if (round === 0) {
        this.dealer.hand.addCard(this.deck.drawCard(true));
      } else {
        this.dealer.hand.addCard(this.deck.drawCard(false));
      }
    }

    // Check for natural blackjacks
    for (const pid of this.playerOrder) {
      const p = this.players.get(pid);
      if (p.hand.getDeckValue() === 21) {
        p.status = "blackjack";
      }
    }

    this.state = "playing";
    this.currentPlayerIndex = 0;
    this.advanceToNextActive();
  }

  getActivePlayers() {
    return this.playerOrder.filter((pid) => {
      const p = this.players.get(pid);
      return p && p.status === "playing";
    });
  }

  advanceToNextActive() {
    while (this.currentPlayerIndex < this.playerOrder.length) {
      const pid = this.playerOrder[this.currentPlayerIndex];
      const p = this.players.get(pid);
      if (p && p.status === "playing") return;
      this.currentPlayerIndex++;
    }
    this.dealerPlay();
  }

  hit(userId) {
    if (this.state !== "playing") return false;
    const currentPid = this.playerOrder[this.currentPlayerIndex];
    if (userId !== currentPid) return false;
    const player = this.players.get(userId);
    if (!player || player.status !== "playing") return false;

    player.hand.addCard(this.deck.drawCard(true));
    const handValue = player.hand.getDeckValue();

    if (handValue > 21) {
      player.status = "busted";
      this.currentPlayerIndex++;
      this.advanceToNextActive();
    } else if (handValue === 21) {
      player.status = "stood";
      this.currentPlayerIndex++;
      this.advanceToNextActive();
    }
    return true;
  }

  stand(userId) {
    if (this.state !== "playing") return false;
    const currentPid = this.playerOrder[this.currentPlayerIndex];
    if (userId !== currentPid) return false;
    const player = this.players.get(userId);
    if (!player || player.status !== "playing") return false;

    player.status = "stood";
    this.currentPlayerIndex++;
    this.advanceToNextActive();
    return true;
  }

  dealerPlay() {
    this.dealer.revealed = true;
    this.dealer.hand.cards.forEach((c) => (c.visible = true));

    const playersStillIn = this.playerOrder.some((pid) => {
      const p = this.players.get(pid);
      return p && (p.status === "stood" || p.status === "blackjack");
    });

    if (playersStillIn) {
      while (this.dealer.hand.getDeckValue() < 17) {
        this.dealer.hand.addCard(this.deck.drawCard(true));
      }
    }

    this.calculateResults();
  }

  calculateResults() {
    const dealerValue = this.dealer.hand.getDeckValue();
    const dealerBusted = dealerValue > 21;
    const dealerBlackjack =
      this.dealer.hand.cards.length === 2 && dealerValue === 21;

    for (const pid of this.playerOrder) {
      const p = this.players.get(pid);
      if (!p) continue;

      if (p.status === "busted") {
        p.result = "lose";
        p.payout = 0;
      } else if (p.status === "blackjack") {
        if (dealerBlackjack) {
          p.result = "tie";
          p.payout = p.bet;
        } else {
          p.result = "blackjack";
          p.payout = Math.floor(p.bet * 2.5);
        }
      } else if (dealerBusted) {
        p.result = "win";
        p.payout = p.bet * 2;
      } else if (p.hand.getDeckValue() > dealerValue) {
        p.result = "win";
        p.payout = p.bet * 2;
      } else if (p.hand.getDeckValue() < dealerValue) {
        p.result = "lose";
        p.payout = 0;
      } else {
        p.result = "tie";
        p.payout = p.bet;
      }
    }

    this.state = "results";
  }

  newRound(userId) {
    const player = this.players.get(userId);
    if (!player) return false;
    player.status = "idle";
    player.bet = 0;
    player.hand = new Deck();
    player.result = null;
    player.payout = 0;

    const allIdle = this.playerOrder.every((pid) => {
      const p = this.players.get(pid);
      return p && p.status === "idle";
    });

    if (allIdle) {
      this.state = "betting";
      this.dealer.hand = new Deck();
      this.dealer.revealed = false;
      this.currentPlayerIndex = -1;
    }
    return true;
  }

  /**
   * Return sanitized state for a specific player.
   * Never sends the deck. Hides dealer's face-down card during play.
   */
  getStateForPlayer(userId) {
    return {
      tableId: this.id,
      gameType: "blackjack",
      state: this.state,
      maxPlayers: this.maxPlayers,
      currentPlayerIndex: this.currentPlayerIndex,
      currentPlayerId:
        this.currentPlayerIndex >= 0 &&
        this.currentPlayerIndex < this.playerOrder.length
          ? this.playerOrder[this.currentPlayerIndex]
          : null,
      players: this.playerOrder
        .map((pid) => {
          const p = this.players.get(pid);
          if (!p) return null;
          return {
            id: pid,
            username: p.username,
            hand: p.hand.cards.map((c) => ({
              value: c.value,
              suit: c.suit,
              visible: true,
            })),
            handValue: p.hand.getDeckValue(),
            bet: p.bet,
            status: p.status,
            result: p.result,
            payout: p.payout,
            isYou: pid === userId,
          };
        })
        .filter(Boolean),
      dealer: {
        hand: this.dealer.hand.cards.map((c) => ({
          value: c.visible ? c.value : null,
          suit: c.visible ? c.suit : null,
          visible: c.visible,
        })),
        handValue: this.dealer.revealed
          ? this.dealer.hand.getDeckValue()
          : null,
      },
    };
  }
}
