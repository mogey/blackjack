import { useEffect, useState } from "react";
import Blackjack from "./components/Blackjack";
import LoginForm from "./components/LoginForm";
import { getUser } from "./services/blackjack.service";
import { io } from "socket.io-client";
import Lobby from "./components/Lobby";

function App(props) {
  const localStorage = window.localStorage;
  const [user, setUser] = useState(localStorage.getItem("id")); //Get userID from local storage
  const [socket, setsocket] = useState(null);

  useEffect(() => {
    const newsocket = io("http://localhost:5002");
    setsocket(newsocket);
    return () => newsocket.close();
  }, [setsocket]);

  useEffect(() => {
    localStorage.setItem("id", user);
  }, [user]);

  return user ? (
    socket ? (
      <Lobby user={user} socket={socket}></Lobby>
    ) : (
      <h1>not connected</h1>
    )
  ) : (
    <LoginForm setUser={setUser} />
  );
}

export default App;
