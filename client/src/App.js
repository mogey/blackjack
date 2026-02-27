import React, { useEffect, useState, useCallback } from "react";
import Auth from "./components/Auth";
import Lobby from "./components/Lobby";
import BlackjackGame from "./components/BlackjackGame";
import PokerGame from "./components/PokerGame";
import { connectSocket, disconnectSocket, getSocket } from "./services/socket";
import { getBalance } from "./services/api";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const stored = window.localStorage.getItem("casinoUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

  const refreshBalance = useCallback(async () => {
    if (!user) return;
    const resp = await getBalance(user.id);
    if (resp.status === 200) {
      setBalance(resp.data.balance);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket();

    const onConnect = () => {
      socket.emit("authenticate", { userId: user.id });
    };

    const onAuthenticated = (data) => {
      setAuthenticated(true);
      setBalance(data.balance);
    };

    const onTableState = (state) => {
      setGameState(state);
      refreshBalance();
    };

    const onError = (data) => {
      setError(data.message);
      setTimeout(() => setError(""), 3000);
    };

    const onDisconnect = () => {
      setAuthenticated(false);
    };

    const onLeftTable = () => {
      setGameState(null);
      refreshBalance();
    };

    socket.on("connect", onConnect);
    socket.on("authenticated", onAuthenticated);
    socket.on("table-state", onTableState);
    socket.on("error", onError);
    socket.on("disconnect", onDisconnect);
    socket.on("left-table", onLeftTable);

    if (socket.connected) {
      socket.emit("authenticate", { userId: user.id });
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("authenticated", onAuthenticated);
      socket.off("table-state", onTableState);
      socket.off("error", onError);
      socket.off("disconnect", onDisconnect);
      socket.off("left-table", onLeftTable);
    };
  }, [user, refreshBalance]);

  const handleLogin = (userData) => {
    window.localStorage.setItem("casinoUser", JSON.stringify(userData));
    setUser(userData);
    setBalance(userData.balance);
  };

  const handleLogout = () => {
    disconnectSocket();
    window.localStorage.removeItem("casinoUser");
    setUser(null);
    setAuthenticated(false);
    setGameState(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const socket = getSocket();

  if (gameState) {
    const GameComponent =
      gameState.gameType === "poker" ? PokerGame : BlackjackGame;
    return (
      <div className="app-wrapper">
        {error && <div className="global-error">{error}</div>}
        <GameComponent
          socket={socket}
          gameState={gameState}
          user={user}
          balance={balance}
        />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {error && <div className="global-error">{error}</div>}
      <div className="lobby-top-actions">
        <button className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
      {authenticated ? (
        <Lobby
          socket={socket}
          user={user}
          balance={balance}
          onJoinTable={(state) => setGameState(state)}
        />
      ) : (
        <div className="connecting-message">Connecting to server...</div>
      )}
    </div>
  );
}

export default App;
