import React, { useState } from "react";
import Card from "./Cards/Card";
import useSound from "use-sound";
import betSfx from "../audio/bet.mp3";
import dealSfx from "../audio/deal.mp3";

export default function PokerGame({ socket, gameState, user, balance }) {
  const [raiseAmount, setRaiseAmount] = useState(20);
  const [playBet] = useSound(betSfx);
  const [playDeal] = useSound(dealSfx);

  const myPlayer = gameState.players.find((p) => p.isYou);
  const otherPlayers = gameState.players.filter((p) => !p.isYou);
  const isMyTurn = gameState.currentPlayerId === user.id;
  const isShowdown = gameState.state === "showdown";
  const isWaiting = gameState.state === "waiting";
  const amIActive = myPlayer?.status === "active";
  const callAmount = myPlayer
    ? gameState.currentBet - myPlayer.currentBet
    : 0;
  const canCheck = callAmount === 0;

  const handleCall = () => {
    playBet();
    socket.emit("poker-call-amount");
  };

  const handleRaise = () => {
    playBet();
    const total = Math.max(
      gameState.currentBet + gameState.minBet,
      raiseAmount
    );
    socket.emit("poker-raise", { amount: total });
  };

  const handleCheck = () => {
    socket.emit("poker-check");
  };

  const handleFold = () => {
    socket.emit("poker-fold");
  };

  const handleNewHand = () => {
    playDeal();
    socket.emit("poker-new-hand");
  };

  const handleLeave = () => {
    socket.emit("leave-table");
  };

  const getPhaseLabel = () => {
    switch (gameState.state) {
      case "pre_flop": return "Pre-Flop";
      case "flop": return "Flop";
      case "turn": return "Turn";
      case "river": return "River";
      case "showdown": return "Showdown";
      case "waiting": return "Waiting";
      default: return gameState.state;
    }
  };

  const getStatusIcon = (player) => {
    if (player.isDealer) return "D";
    return null;
  };

  return (
    <div className="game-container">
      <div className="game-top-bar">
        <button className="btn-back" onClick={handleLeave}>
          &#8592; Leave
        </button>
        <span className="game-title">Texas Hold'em</span>
        <span className="game-balance">${balance.toLocaleString()}</span>
      </div>

      <div className="felt-table poker-table">
        {/* Phase indicator */}
        <div className="poker-phase">{getPhaseLabel()}</div>

        {/* Other Players (around the table) */}
        <div className="poker-seats">
          {otherPlayers.map((player) => (
            <div
              key={player.id}
              className={`poker-seat ${
                gameState.currentPlayerId === player.id ? "active-turn" : ""
              } ${player.status === "folded" ? "folded" : ""}`}
            >
              <div className="seat-info">
                <span className="seat-name">
                  {player.isDealer && <span className="dealer-chip">D</span>}
                  {player.username}
                </span>
                {player.lastAction && (
                  <span className="seat-action">{player.lastAction}</span>
                )}
              </div>
              <div className="seat-cards">
                {player.hand.map((card, i) => (
                  <Card key={i} card={card} small />
                ))}
              </div>
              {player.currentBet > 0 && (
                <div className="seat-bet">${player.currentBet}</div>
              )}
              {isShowdown &&
                gameState.winners.includes(player.id) && (
                  <div className="winner-badge">WINNER</div>
                )}
            </div>
          ))}
        </div>

        {/* Community Cards + Pot */}
        <div className="community-section">
          <div className="pot-display">
            <span className="pot-label">POT</span>
            <span className="pot-amount">${gameState.pot}</span>
          </div>
          <div className="community-cards">
            {gameState.communityCards.map((card, i) => (
              <Card key={i} card={card} />
            ))}
            {/* Empty slots */}
            {Array.from({ length: 5 - gameState.communityCards.length }).map(
              (_, i) => (
                <div key={`empty-${i}`} className="card-slot"></div>
              )
            )}
          </div>
          {isShowdown && gameState.winningHand && (
            <div className="winning-hand-label">{gameState.winningHand}</div>
          )}
        </div>

        {/* My Hand */}
        {myPlayer && (
          <div className={`my-section poker-my-section ${isMyTurn ? "my-turn" : ""}`}>
            <div className="my-hand-label">
              {myPlayer.isDealer && <span className="dealer-chip">D</span>}
              YOUR HAND
              {myPlayer.currentBet > 0 && (
                <span className="my-bet">Bet: ${myPlayer.currentBet}</span>
              )}
              {myPlayer.status === "folded" && (
                <span className="folded-label">FOLDED</span>
              )}
            </div>
            <div className="cards-row my-cards">
              {myPlayer.hand.map((card, i) => (
                <Card key={i} card={card} />
              ))}
            </div>
            {isShowdown && gameState.winners.includes(user.id) && (
              <div className="result-banner result-win">
                YOU WIN! +${Math.floor(gameState.pot / gameState.winners.length)}
              </div>
            )}
            {isShowdown && !gameState.winners.includes(user.id) && myPlayer.status !== "folded" && (
              <div className="result-banner result-lose">Better luck next time</div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="controls-section">
          {!isShowdown && !isWaiting && isMyTurn && amIActive && (
            <div className="poker-controls">
              <button className="btn-action btn-fold" onClick={handleFold}>
                FOLD
              </button>
              {canCheck ? (
                <button className="btn-action btn-check" onClick={handleCheck}>
                  CHECK
                </button>
              ) : (
                <button className="btn-action btn-call" onClick={handleCall}>
                  CALL ${callAmount}
                </button>
              )}
              <div className="raise-group">
                <input
                  type="number"
                  value={raiseAmount}
                  onChange={(e) =>
                    setRaiseAmount(Math.max(gameState.minBet, parseInt(e.target.value) || 0))
                  }
                  className="raise-input"
                  min={gameState.currentBet + gameState.minBet}
                />
                <button className="btn-action btn-raise" onClick={handleRaise}>
                  RAISE
                </button>
              </div>
            </div>
          )}

          {!isShowdown && !isWaiting && !isMyTurn && amIActive && (
            <div className="waiting-message">
              Waiting for{" "}
              {gameState.players.find(
                (p) => p.id === gameState.currentPlayerId
              )?.username || "other player"}
              ...
            </div>
          )}

          {!isShowdown && !isWaiting && myPlayer?.status === "folded" && (
            <div className="waiting-message folded-msg">
              You folded. Waiting for hand to finish...
            </div>
          )}

          {isShowdown && (
            <button className="btn-gold" onClick={handleNewHand}>
              Next Hand
            </button>
          )}

          {isWaiting && (
            <div className="waiting-message">
              Waiting for players to join (need at least 2)...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
