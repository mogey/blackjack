import "./App.css";
import Blackjack from "./components/Blackjack";
import { newGame } from "./services/blackjack.service";

function App() {
  const localStorage = window.localStorage;
  const user = parseInt(localStorage.getItem("userID"));
  if (!user) {
    newGame().then((response) => {
      if (response.status === 200) {
        localStorage.setItem("userID", response.data.id.toString());
      }
    });
  }
  return <Blackjack user={user}></Blackjack>;
}

export default App;
