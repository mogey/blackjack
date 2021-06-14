import React, { useEffect, useState } from "react";
import { getGame, replenish } from "../services/blackjack.service";
import Active from "./states/Active";
import Bet from "./states/Bet";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";

export default function Blackjack(props) {
  const { user } = props; //destructure props so we know what we have

  //Set up initial game stage before page loads in case game is rendered
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
  const [error, setError] = useState({ isError: false });
  const [refetch, setRefetch] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const refetcher = { refetch: refetch, setRefetch: setRefetch }; //allows us to trigger useEffect from within children components

  //Loads game state from backend
  useEffect(() => {
    setDataLoaded(false);
    getGame(user).then((resp) => {
      if (resp.status === 200) {
        setGame(resp.data);
        setDataLoaded(true);
      } else {
        setError({ errorMessage: resp.toString(), isError: true });
      }
    });
  }, [refetch, user]);

  //Hands click for replenish button
  const onReplenishClick = () => {
    replenish(user).then((response) => {
      if (response.status === 200) {
        refetcher.setRefetch(!refetcher.refetch);
      }
    });
  };

  if (dataLoaded) {
    return (
      <div style={{ backgroundColor: "#E9EADF", color: "#1A191B" }}>
        <Container>
          <Row style={{ position: "relative", top: "5px" }}>
            <Col xs={4}>
              <h4 style={{ position: "relative", top: "20px" }}>
                Bank: ${game.playerCredits}
              </h4>
            </Col>
            <Col>
              <h2>Blackjack</h2>
            </Col>
            <Col xs={4}>
              <h4 style={{ position: "relative", top: "20px" }}>
                Bet: ${game.betAmount}
              </h4>
            </Col>
          </Row>
          <hr />
          {game.playerCredits === 0 && game.state !== "active" ? (
            <Alert variant="info">
              You have run out of money, would you like to replenish your
              credits?.
              <Button
                onClick={() => {
                  onReplenishClick();
                }}
                size="sm"
                style={{ float: "right", position: "relative", bottom: "3px" }}
              >
                Replenish
              </Button>
            </Alert>
          ) : null}
          {error.isError ? (
            <Alert variant="danger">
              Error connecting to backend: {error.errorMessage}
            </Alert>
          ) : null}
          {game.state === "active" ||
          game.state === "lose" ||
          game.state === "win" ||
          game.state === "tie" ? (
            <Active game={game} refetcher={refetcher} user={user} />
          ) : null}
          {game.state !== "active" && game.state !== "bet" ? null : null}
          {game.state === "bet" ? (
            <Bet game={game} refetcher={refetcher} user={user} />
          ) : null}
        </Container>
      </div>
    );
  } else {
    return <div></div>;
  }

  /*

      <Container>
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
      </Container> */
}
