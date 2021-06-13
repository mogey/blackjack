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
import { Container, Row, Col, Button } from "react-bootstrap";

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

  const rowPadding = { paddingTop: "20px" };

  useEffect(() => {
    getGame().then((resp) => {
      setGame(resp.data);
    });
  }, [refetch]);

  const onHitClick = () => {
    hit().then(() => {
      setRefetch(!refetch);
    });
  };

  const onBetClick = () => {
    bet(betAmount).then(() => {
      setBetamount(0);
      setRefetch(!refetch);
    });
  };

  const onStandClick = () => {
    stand().then(() => {
      setRefetch(!refetch);
    });
  };

  const onNewGameClick = () => {
    newGame().then(() => {
      setBetamount(0);
      setRefetch(!refetch);
    });
  };

  const onReplenishClick = () => {
    replenish().then(() => {
      setRefetch(!refetch);
    });
  };

  return (
    <div>
      <Container>
        <Row>
          <Col xs={4} />
          <Col>
            <h2>Blackjack</h2>
          </Col>
          <Col xs={4} />
        </Row>
        <hr />
        <Row>
          <Col>
            <h3>Dealer's hand</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={3} />
          <Col>
            {game.dealerHand.cards.map((card) => {
              return <Card card={card} />;
            })}
          </Col>
          <Col xs={3} />
        </Row>
        <br />
        <Row>
          <Col>
            <h3>Your hand</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={3} />
          <Col>
            {game.playerHand.cards.map((card) => {
              return <Card card={card} />;
            })}
          </Col>
          <Col xs={3} />
        </Row>
        <Row style={rowPadding}>
          <Col xs={4} />
          <Col xs={1}>
            <Button onClick={() => onStandClick()} size="sm">
              Stand
            </Button>
          </Col>
          <Col xs={1}>
            <Button onClick={() => onHitClick()} size="sm">
              Hit
            </Button>
          </Col>
          <Col xs={4} />
        </Row>
        <Row style={rowPadding}>
          <Col xs={4} />
          <Col>
            <h4>Bets are ${game.state}</h4>
          </Col>
          <Col xs={4} />
        </Row>
      </Container>
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
      </Container>
    </div>
  );
}
