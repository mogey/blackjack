import Deck from "./deck.js";
import { getBestHand, compareScores } from "./deck.js";

export default class PokerTable {
  constructor(id, maxPlayers = 6, minBet = 10) {
    this.id = id;
    this.gameType = "poker";
    this.maxPlayers = maxPlayers;
    this.minBet = minBet; // big blind
    this.players = new Map();
    this.playerOrder = [];
    this.communityCards = [];
    this.deck = new Deck();
    this.pot = 0;
    this.currentBet = 0;
    this.state = "waiting"; // waiting, pre_flop, flop, turn, river, showdown
    this.currentPlayerIndex = -1;
    this.dealerIndex = 0;
    this.lastRaiserIndex = -1;
    this.roundActed = new Set(); // tracks who has acted this betting round
    this.winners = [];
    this.winningHand = null;
  }

  addPlayer(userId, username) {
    if (this.players.size >= this.maxPlayers) return false;
    if (this.players.has(userId)) return false;
    this.players.set(userId, {
      id: userId,
      username,
      hand: [],
      currentBet: 0,
      totalBet: 0,
      status: "waiting",
      lastAction: null,
    });
    this.playerOrder.push(userId);
    if (this.state === "waiting" && this.players.size >= 2) {
      this.startHand();
    }
    return true;
  }

  removePlayer(userId) {
    if (!this.players.has(userId)) return;

    // If in an active hand, fold them
    if (
      this.state !== "waiting" &&
      this.state !== "showdown" &&
      this.players.get(userId).status === "active"
    ) {
      this.players.get(userId).status = "folded";
    }

    this.players.delete(userId);
    this.playerOrder = this.playerOrder.filter((id) => id !== userId);

    if (this.players.size < 2) {
      if (this.state !== "waiting") {
        // If mid-hand with only 1 player left, they win
        const remaining = this.playerOrder[0];
        if (remaining) {
          this.winners = [remaining];
          this.winningHand = "Last player standing";
          const winner = this.players.get(remaining);
          if (winner) winner.lastAction = "wins";
          this.state = "showdown";
        }
      }
      if (this.players.size < 2) {
        this.state = "waiting";
      }
      return;
    }

    // Fix indices
    if (this.dealerIndex >= this.playerOrder.length) {
      this.dealerIndex = 0;
    }
    if (
      this.state !== "waiting" &&
      this.state !== "showdown"
    ) {
      this.checkBettingRoundComplete();
    }
  }

  startHand() {
    if (this.players.size < 2) return;

    this.deck = new Deck();
    this.deck.generateDeck();
    this.deck.shuffle();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.winners = [];
    this.winningHand = null;
    this.roundActed = new Set();

    // Reset players
    for (const [, p] of this.players) {
      p.hand = [];
      p.currentBet = 0;
      p.totalBet = 0;
      p.status = "active";
      p.lastAction = null;
    }

    // Move dealer button
    this.dealerIndex = this.dealerIndex % this.playerOrder.length;

    // Post blinds
    const sbIndex = (this.dealerIndex + 1) % this.playerOrder.length;
    const bbIndex = (this.dealerIndex + 2) % this.playerOrder.length;

    const sbPlayer = this.players.get(this.playerOrder[sbIndex]);
    const bbPlayer = this.players.get(this.playerOrder[bbIndex]);

    const smallBlind = Math.floor(this.minBet / 2);
    sbPlayer.currentBet = smallBlind;
    sbPlayer.totalBet = smallBlind;
    sbPlayer.lastAction = "small blind";
    this.pot += smallBlind;

    bbPlayer.currentBet = this.minBet;
    bbPlayer.totalBet = this.minBet;
    bbPlayer.lastAction = "big blind";
    this.pot += this.minBet;

    this.currentBet = this.minBet;

    // Deal 2 hole cards to each player
    for (let round = 0; round < 2; round++) {
      for (const pid of this.playerOrder) {
        const p = this.players.get(pid);
        if (p.status === "active") {
          p.hand.push(this.deck.drawCard(true));
        }
      }
    }

    // Pre-flop: action starts left of big blind
    this.state = "pre_flop";
    this.currentPlayerIndex =
      (bbIndex + 1) % this.playerOrder.length;
    this.lastRaiserIndex = bbIndex;
    this.roundActed = new Set();
  }

  getActiveCount() {
    return this.playerOrder.filter((pid) => {
      const p = this.players.get(pid);
      return p && p.status === "active";
    }).length;
  }

  advancePlayer() {
    if (this.getActiveCount() <= 1) {
      this.resolveLastPlayer();
      return;
    }

    let attempts = 0;
    do {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) % this.playerOrder.length;
      attempts++;
      if (attempts > this.playerOrder.length) break;
    } while (
      this.players.get(this.playerOrder[this.currentPlayerIndex])?.status !==
      "active"
    );

    this.checkBettingRoundComplete();
  }

  checkBettingRoundComplete() {
    const activePlayers = this.playerOrder.filter((pid) => {
      const p = this.players.get(pid);
      return p && p.status === "active";
    });

    if (activePlayers.length <= 1) {
      this.resolveLastPlayer();
      return;
    }

    // Round complete if everyone active has matched the current bet and has acted
    const allMatched = activePlayers.every((pid) => {
      const p = this.players.get(pid);
      return p.currentBet === this.currentBet && this.roundActed.has(pid);
    });

    if (allMatched) {
      this.advancePhase();
    }
  }

  resolveLastPlayer() {
    const activePlayers = this.playerOrder.filter((pid) => {
      const p = this.players.get(pid);
      return p && p.status === "active";
    });

    if (activePlayers.length === 1) {
      const winnerId = activePlayers[0];
      this.winners = [winnerId];
      this.winningHand = "Last player standing";
      this.state = "showdown";
    } else if (activePlayers.length === 0) {
      this.state = "showdown";
      this.winners = [];
    }
  }

  call(userId) {
    if (!this.isValidAction(userId)) return false;
    const player = this.players.get(userId);
    const toCall = this.currentBet - player.currentBet;
    if (toCall <= 0) return this.check(userId);

    player.totalBet += toCall;
    player.currentBet = this.currentBet;
    player.lastAction = "call";
    this.pot += toCall;
    this.roundActed.add(userId);
    this.advancePlayer();
    return true;
  }

  raise(userId, amount) {
    if (!this.isValidAction(userId)) return false;
    const player = this.players.get(userId);
    const raiseTotal = Math.max(amount, this.currentBet + this.minBet);
    const toAdd = raiseTotal - player.currentBet;
    if (toAdd <= 0) return false;

    player.totalBet += toAdd;
    player.currentBet = raiseTotal;
    player.lastAction = "raise";
    this.pot += toAdd;
    this.currentBet = raiseTotal;
    this.lastRaiserIndex = this.currentPlayerIndex;
    // Reset roundActed since everyone needs to act again after a raise
    this.roundActed = new Set([userId]);
    this.advancePlayer();
    return true;
  }

  check(userId) {
    if (!this.isValidAction(userId)) return false;
    const player = this.players.get(userId);
    if (player.currentBet < this.currentBet) return false; // can't check if there's a bet to match

    player.lastAction = "check";
    this.roundActed.add(userId);
    this.advancePlayer();
    return true;
  }

  fold(userId) {
    if (!this.isValidAction(userId)) return false;
    const player = this.players.get(userId);
    player.status = "folded";
    player.lastAction = "fold";
    this.roundActed.add(userId);
    this.advancePlayer();
    return true;
  }

  isValidAction(userId) {
    if (
      this.state === "waiting" ||
      this.state === "showdown"
    )
      return false;
    const currentPid = this.playerOrder[this.currentPlayerIndex];
    if (userId !== currentPid) return false;
    const player = this.players.get(userId);
    if (!player || player.status !== "active") return false;
    return true;
  }

  advancePhase() {
    // Reset per-round betting
    for (const [, p] of this.players) {
      p.currentBet = 0;
    }
    this.currentBet = 0;
    this.roundActed = new Set();

    if (this.state === "pre_flop") {
      // Flop: deal 3 community cards
      this.deck.drawCard(); // burn
      for (let i = 0; i < 3; i++) {
        this.communityCards.push(this.deck.drawCard(true));
      }
      this.state = "flop";
    } else if (this.state === "flop") {
      this.deck.drawCard(); // burn
      this.communityCards.push(this.deck.drawCard(true));
      this.state = "turn";
    } else if (this.state === "turn") {
      this.deck.drawCard(); // burn
      this.communityCards.push(this.deck.drawCard(true));
      this.state = "river";
    } else if (this.state === "river") {
      this.showdown();
      return;
    }

    // Set action to first active player left of dealer
    this.currentPlayerIndex =
      (this.dealerIndex + 1) % this.playerOrder.length;
    let attempts = 0;
    while (
      this.players.get(this.playerOrder[this.currentPlayerIndex])?.status !==
      "active"
    ) {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) % this.playerOrder.length;
      attempts++;
      if (attempts > this.playerOrder.length) break;
    }
    this.lastRaiserIndex = this.currentPlayerIndex;

    // If only 1 or 0 active players, resolve
    if (this.getActiveCount() <= 1) {
      this.resolveLastPlayer();
    }
  }

  showdown() {
    this.state = "showdown";

    const activePlayers = this.playerOrder.filter((pid) => {
      const p = this.players.get(pid);
      return p && p.status === "active";
    });

    if (activePlayers.length === 0) {
      this.winners = [];
      return;
    }

    if (activePlayers.length === 1) {
      this.winners = [activePlayers[0]];
      this.winningHand = "Last player standing";
      return;
    }

    // Evaluate hands
    let bestScore = null;
    let bestPlayers = [];
    let bestHandName = "";

    for (const pid of activePlayers) {
      const p = this.players.get(pid);
      const allCards = [...p.hand, ...this.communityCards];
      const result = getBestHand(allCards);
      if (!result) continue;

      if (!bestScore) {
        bestScore = result.score;
        bestPlayers = [pid];
        bestHandName = result.name;
      } else {
        const cmp = compareScores(result.score, bestScore);
        if (cmp > 0) {
          bestScore = result.score;
          bestPlayers = [pid];
          bestHandName = result.name;
        } else if (cmp === 0) {
          bestPlayers.push(pid);
        }
      }
    }

    this.winners = bestPlayers;
    this.winningHand = bestHandName;
  }

  newHand() {
    if (this.state !== "showdown") return false;
    if (this.players.size < 2) {
      this.state = "waiting";
      return false;
    }
    this.dealerIndex = (this.dealerIndex + 1) % this.playerOrder.length;
    this.startHand();
    return true;
  }

  /**
   * Return sanitized state for a specific player.
   * Hides other players' hole cards until showdown.
   */
  getStateForPlayer(userId) {
    const activePlayers = this.playerOrder.filter((pid) => {
      const p = this.players.get(pid);
      return p && p.status === "active";
    });

    return {
      tableId: this.id,
      gameType: "poker",
      state: this.state,
      maxPlayers: this.maxPlayers,
      pot: this.pot,
      currentBet: this.currentBet,
      minBet: this.minBet,
      communityCards: this.communityCards.map((c) => ({
        value: c.value,
        suit: c.suit,
        visible: true,
      })),
      currentPlayerId:
        this.currentPlayerIndex >= 0 &&
        this.currentPlayerIndex < this.playerOrder.length
          ? this.playerOrder[this.currentPlayerIndex]
          : null,
      dealerId:
        this.dealerIndex >= 0 && this.dealerIndex < this.playerOrder.length
          ? this.playerOrder[this.dealerIndex]
          : null,
      winners: this.winners,
      winningHand: this.winningHand,
      players: this.playerOrder
        .map((pid) => {
          const p = this.players.get(pid);
          if (!p) return null;
          const showCards =
            pid === userId ||
            (this.state === "showdown" && p.status === "active");
          return {
            id: pid,
            username: p.username,
            hand: p.hand.map((c) => ({
              value: showCards ? c.value : null,
              suit: showCards ? c.suit : null,
              visible: showCards,
            })),
            currentBet: p.currentBet,
            totalBet: p.totalBet,
            status: p.status,
            lastAction: p.lastAction,
            isYou: pid === userId,
            isDealer: this.playerOrder[this.dealerIndex] === pid,
          };
        })
        .filter(Boolean),
    };
  }
}
