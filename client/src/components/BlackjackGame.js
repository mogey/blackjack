import React, { useState } from "react";
import Card from "./Cards/Card";
import useSound from "use-sound";
import hitSfx from "../audio/hit.mp3";
import standSfx from "../audio/stand.mp3";
import betSfx from "../audio/bet.mp3";
import dealSfx from "../audio/deal.mp3";

export default function BlackjackGame({ socket, gameState, user, balance }) {
  const [betAmount, setBetAmount] = useState(50);
  const [playHit] = useSound(hitSfx);
  const [playStand] = useSound(standSfx);
  const [playBet] = useSound(betSfx);
  const [playDeal] = useSound(dealSfx);

  const myPlayer = gameState.players.find((p) => p.isYou);
  const otherPlayers = gameState.players.filter((p) => !p.isYou);
  const isMyTurn = gameState.currentPlayerId === user.id;
  const isBetting = gameState.state === "betting";
  const isPlaying = gameState.state === "playing";
  const isResults = gameState.state === "results";
  const myStatus = myPlayer?.status;

  const handleBet = () => {
    if (betAmount > 0 && betAmount <= balance) {
      playBet();
      socket.emit("bj-bet", { amount: betAmount });
    }
  };

  const handleHit = () => {
    playHit();
    socket.emit("bj-hit");
  };

  const handleStand = () => {
    playStand();
    socket.emit("bj-stand");
  };

  const handleNewRound = () => {
    playDeal();
    socket.emit("bj-new-round");
  };

  const handleLeave = () => {
    socket.emit("leave-table");
  };

  const getResultClass = (result) => {
    if (result === "win" || result === "blackjack") return "result-win";
    if (result === "lose") return "result-lose";
    if (result === "tie") return "result-tie";
    return "";
  };

  const getResultText = (result) => {
    if (result === "blackjack") return "BLACKJACK!";
    if (result === "win") return "WIN";
    if (result === "lose") return "LOSE";
    if (result === "tie") return "PUSH";
    return "";
  };

  return (
    <div className="game-container">
      <div className="game-top-bar">
        <button className="btn-back" onClick={handleLeave}>
          &#8592; Leave
        </button>
        <span className="game-title">Blackjack</span>
        <span className="game-balance">${balance.toLocaleString()}</span>
      </div>

      <div className="felt-table blackjack-table">
        {/* Dealer Section */}
        <div className="dealer-section">
          <div className="dealer-label">
            DEALER
            {gameState.dealer.handValue !== null && (
              <span className="hand-value">{gameState.dealer.handValue}</span>
            )}
          </div>
          <div className="cards-row">
            {gameState.dealer.hand.map((card, i) => (
              <Card key={i} card={card} />
            ))}
          </div>
        </div>

        {/* Other Players */}
        {otherPlayers.length > 0 && (
          <div className="other-players">
            {otherPlayers.map((player) => (
              <div
                key={player.id}
                className={`other-player ${
                  gameState.currentPlayerId === player.id ? "active-turn" : ""
                }`}
              >
                <div className="player-info-bar">
                  <span className="player-name">{player.username}</span>
                  {player.bet > 0 && (
                    <span className="player-bet">${player.bet}</span>
                  )}
                  {player.result && (
                    <span className={`player-result ${getResultClass(player.result)}`}>
                      {getResultText(player.result)}
                      {player.payout > 0 && ` +$${player.payout}`}
                    </span>
                  )}
                </div>
                <div className="cards-row small-cards">
                  {player.hand.map((card, i) => (
                    <Card key={i} card={card} small />
                  ))}
                </div>
                <div className="player-hand-value">{player.handValue}</div>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="table-divider"></div>

        {/* My Hand */}
        {myPlayer && (
          <div className={`my-section ${isMyTurn ? "my-turn" : ""}`}>
            {myPlayer.result && (
              <div className={`result-banner ${getResultClass(myPlayer.result)}`}>
                {getResultText(myPlayer.result)}
                {myPlayer.payout > 0 && (
                  <span className="payout"> +${myPlayer.payout}</span>
                )}
              </div>
            )}
            <div className="my-hand-label">
              YOUR HAND
              <span className="hand-value">{myPlayer.handValue}</span>
              {myPlayer.bet > 0 && (
                <span className="my-bet">Bet: ${myPlayer.bet}</span>
              )}
            </div>
            <div className="cards-row my-cards">
              {myPlayer.hand.map((card, i) => (
                <Card key={i} card={card} />
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="controls-section">
          {isBetting && myStatus !== "ready" && (
            <div className="bet-controls">
              <div className="bet-input-group">
                <button
                  className="btn-chip"
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                >
                  -
                </button>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) =>
                    setBetAmount(
                      Math.max(0, Math.min(balance, parseInt(e.target.value) || 0))
                    )
                  }
                  className="bet-input"
                />
                <button
                  className="btn-chip"
                  onClick={() =>
                    setBetAmount(Math.min(balance, betAmount + 10))
                  }
                >
                  +
                </button>
              </div>
              <div className="quick-bets">
                {[25, 50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    className="btn-quick-bet"
                    onClick={() => setBetAmount(Math.min(balance, amt))}
                  >
                    ${amt}
                  </button>
                ))}
                <button
                  className="btn-quick-bet all-in"
                  onClick={() => setBetAmount(balance)}
                >
                  ALL IN
                </button>
              </div>
              <button className="btn-gold bet-btn" onClick={handleBet}>
                Place Bet ${betAmount}
              </button>
            </div>
          )}

          {isBetting && myStatus === "ready" && (
            <div className="waiting-message">
              Waiting for other players to bet...
            </div>
          )}

          {isPlaying && isMyTurn && myStatus === "playing" && (
            <div className="action-controls">
              <button className="btn-action btn-stand" onClick={handleStand}>
                STAND
              </button>
              <button className="btn-action btn-hit" onClick={handleHit}>
                HIT
              </button>
            </div>
          )}

          {isPlaying && !isMyTurn && myStatus === "playing" && (
            <div className="waiting-message">
              Waiting for{" "}
              {gameState.players.find(
                (p) => p.id === gameState.currentPlayerId
              )?.username || "other player"}
              ...
            </div>
          )}

          {isPlaying && (myStatus === "stood" || myStatus === "busted" || myStatus === "blackjack") && (
            <div className="waiting-message">
              {myStatus === "busted"
                ? "Busted! Waiting for others..."
                : myStatus === "blackjack"
                  ? "Blackjack! Waiting for others..."
                  : "Standing. Waiting for others..."}
            </div>
          )}

          {isResults && myStatus !== "idle" && (
            <button className="btn-gold" onClick={handleNewRound}>
              New Round
            </button>
          )}

          {isResults && myStatus === "idle" && (
            <div className="waiting-message">
              Waiting for others to ready up...
            </div>
          )}

          {gameState.state === "waiting" && (
            <div className="waiting-message">
              Waiting for players to join...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
