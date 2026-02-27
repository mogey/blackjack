import React, { useState, useEffect } from "react";

export default function Lobby({ socket, user, onJoinTable, balance }) {
  const [tables, setTables] = useState([]);
  const [creating, setCreating] = useState(false);
  const [gameType, setGameType] = useState("blackjack");

  useEffect(() => {
    socket.on("tables-list", (list) => {
      setTables(list);
    });
    socket.emit("get-tables");

    return () => {
      socket.off("tables-list");
    };
  }, [socket]);

  const handleCreate = () => {
    const maxPlayers = gameType === "poker" ? 6 : 5;
    socket.emit("create-table", { gameType, maxPlayers });
    setCreating(false);
  };

  const handleJoin = (tableId) => {
    socket.emit("join-table", { tableId });
  };

  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <div className="lobby-user-info">
          <span className="lobby-username">{user.username}</span>
          <span className="lobby-balance">${balance.toLocaleString()}</span>
        </div>
        <h2 className="lobby-title">Game Lobby</h2>
        <button
          className="btn-gold"
          onClick={() => setCreating(!creating)}
        >
          {creating ? "Cancel" : "Create Table"}
        </button>
      </div>

      {creating && (
        <div className="create-table-panel">
          <h3>Create New Table</h3>
          <div className="game-type-selector">
            <button
              className={`game-type-btn ${gameType === "blackjack" ? "active" : ""}`}
              onClick={() => setGameType("blackjack")}
            >
              <span className="game-icon">&#9824;</span>
              Blackjack
            </button>
            <button
              className={`game-type-btn ${gameType === "poker" ? "active" : ""}`}
              onClick={() => setGameType("poker")}
            >
              <span className="game-icon">&#9830;</span>
              Texas Hold'em
            </button>
          </div>
          <button className="btn-gold" onClick={handleCreate}>
            Create & Join
          </button>
        </div>
      )}

      <div className="tables-grid">
        {tables.length === 0 && !creating && (
          <div className="empty-lobby">
            <p>No tables available</p>
            <p className="empty-hint">Create a table to start playing</p>
          </div>
        )}
        {tables.map((table) => (
          <div key={table.id} className="table-card">
            <div className="table-card-header">
              <span className={`table-type ${table.gameType}`}>
                {table.gameType === "poker" ? "Texas Hold'em" : "Blackjack"}
              </span>
              <span className="table-id">#{table.id}</span>
            </div>
            <div className="table-card-body">
              <div className="table-players">
                <span className="player-count">
                  {table.playerCount}/{table.maxPlayers}
                </span>
                <span className="player-label">Players</span>
              </div>
              <div className="table-player-names">
                {table.players.map((name, i) => (
                  <span key={i} className="player-chip">{name}</span>
                ))}
              </div>
            </div>
            <div className="table-card-footer">
              <span className={`table-status ${table.state}`}>
                {table.state}
              </span>
              <button
                className="btn-join"
                onClick={() => handleJoin(table.id)}
                disabled={table.playerCount >= table.maxPlayers}
              >
                {table.playerCount >= table.maxPlayers ? "Full" : "Join"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
