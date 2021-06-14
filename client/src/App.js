import { useEffect, useState } from "react";
import "./App.css";
import Blackjack from "./components/Blackjack";
import { getUser } from "./services/blackjack.service";

function App(props) {
  const localStorage = window.localStorage;
  const [user, setUser] = useState(localStorage.getItem("userID")); //Get userID from local storage

  //Validate userID and set userID in localStorage
  useEffect(() => {
    getUser().then((response) => {
      if (response.status === 200 && response.data.id) {
        localStorage.setItem("userID", response.data.id);
        setUser(response.data.id);
      }
    });
  }, [localStorage]);
  console.log("User ID is " + user);

  //Return the app if the user has a session
  return user ? <Blackjack user={user}></Blackjack> : null;
}

export default App;
