import React, { useEffect, useState } from "react";
import { getGame, replenish } from "../services/blackjack.service";
import Active from "./states/Active";
import Bet from "./states/Bet";
import useSound from "use-sound";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import replenishSfx from "../audio/replenish.mp3";
import { GiCoinflip, GiHelp, GiPiggyBank } from "react-icons/gi";

export default function Blackjack(props) {
  const { user } = props; //destructure props so swe know what we have

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
  const [playReplenish] = useSound(replenishSfx);
  const refetcher = { refetch: refetch, setRefetch: setRefetch }; //allows us to trigger useEffect from within children components

  //Loads game state from backend
  useEffect(() => {
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
    playReplenish();
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
          <Row
            className="d-flex justify-content-between"
            style={{ position: "relative", top: "5px" }}
          >
            {/*
            <Button
              variant="link"
              style={{ position: "relative", top: "10px" }}
            >
              <GiHelp />
          </Button>*/}

            <Col className="d-flex justify-content-center">
              <h5 style={{ position: "relative", top: "20px" }}>
                <GiPiggyBank style={{ position: "relative", top: "-1px" }} /> |
                ${game.playerCredits}
              </h5>
            </Col>
            <Col className="d-flex justify-content-center">
              <h3>Blackjack</h3>
            </Col>
            <Col className="d-flex justify-content-center">
              <h5 style={{ position: "relative", top: "20px" }}>
                <GiCoinflip style={{ position: "relative", top: "-1px" }} /> | $
                {game.betAmount}
              </h5>
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
    return (
      <div>
        {error.isError ? (
          <Alert variant="danger">
            Error connecting to backend: {error.errorMessage}
          </Alert>
        ) : null}
        <Spinner animation="grow" />
      </div>
    );
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
