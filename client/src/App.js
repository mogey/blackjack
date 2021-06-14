import { useEffect, useState } from "react";
import "./App.css";
import Blackjack from "./components/Blackjack";
import { getUser } from "./services/blackjack.service";

function App(props) {
  const localStorage = window.localStorage;
  const [user, setUser] = useState(localStorage.getItem("userID"));

  useEffect(() => {
    getUser().then((response) => {
      if (response.status === 200 && response.data.id) {
        console.log("got id from server: " + response.data.id);
        localStorage.setItem("userID", response.data.id);
        setUser(response.data.id);
      }
    });
  }, [localStorage]);
  console.log("user id is " + user);
  return user ? <Blackjack user={user}></Blackjack> : null;
}

export default App;
