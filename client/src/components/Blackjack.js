import react, { useEffect, useState } from "react";
import {
  bet,
  getGame,
  hit,
  newGame,
  replenish,
  stand,
} from "../services/blackjack.service";
import Card from "./Cards/Card";

export default function Blackjack() {
  const [game, setGame] = useState({
    gameDeck: {
      cards: [],
      value: 0,
    },
    playerHand: {
      cards: [{ value: 2, suit: "B" }],
      value: 0,
    },
    dealerHand: {
      cards: [],
      value: 0,
    },
    playerCredits: 1000,
    betAmount: 0,
    state: "init",
    message: "",
  });
  const [betAmount, setBetamount] = useState(0);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    getGame().then((resp) => {
      setGame(resp.data);
    });
  }, [refetch]);
  return (
    <div>
      <p>{"Credits: $" + game.playerCredits}</p>
      {game.playerCredits === 0 ? (
        <button
          onClick={() => {
            replenish().then(() => {
              setBetamount(0);
              setRefetch(!refetch);
            });
          }}
        >
          Replenish
        </button>
      ) : null}
      <br />
      <p>{"Bet: $" + game.betAmount}</p>
      <br />
      <button
        onClick={() => {
          newGame().then(() => {
            setBetamount(0);
            setRefetch(!refetch);
          });
        }}
      >
        New Game
      </button>
      <br />
      <button
        onClick={() => {
          hit().then(() => {
            setBetamount(0);
            setRefetch(!refetch);
          });
        }}
        disabled={
          game.state !== "active" && game.state !== "ready" ? true : false
        }
      >
        Hit
      </button>
      <br />
      <button
        onClick={() => {
          stand().then(() => {
            setBetamount(0);
            setRefetch(!refetch);
          });
        }}
        disabled={
          game.state !== "active" && game.state !== "ready" ? true : false
        }
      >
        Stand
      </button>
      <br />
      <input
        onChange={(e) => {
          setBetamount(e.target.value);
        }}
        placeholder="Bet Amount"
        value={betAmount}
      ></input>
      <button
        onClick={() => {
          bet(betAmount).then(() => {
            setBetamount(0);
            setRefetch(!refetch);
          });
        }}
        disabled={game.state !== "ready"}
      >
        Bet
      </button>
      <br />
      <h1>Your hand({game.playerHand.value})</h1>
      {game.playerHand.cards.map((card) => {
        return <Card card={card}></Card>;
      })}
      <br />
      <h1>
        Dealer hand(
        {game.state !== "active" && game.state !== "ready"
          ? game.dealerHand.value
          : game.dealerHand.cards[0].value}
        )
      </h1>
      {game.dealerHand.cards.map((card) => {
        return <Card card={card}></Card>;
      })}
      <br />
      {game.state}
      <br /> <br />
      <p color="red">{game.message}</p>
      <br />
      <pre>debug{JSON.stringify(game, null, 2)}</pre>
    </div>
  );
}
