import React from "react";
import { Row, Col, Button, Alert } from "react-bootstrap";
import { hit, newGame, stand } from "../../services/blackjack.service";
import Card from "../Cards/Card";
export default function Active(props) {
  const { game, refetcher, user } = props;

  const rowPadding = { marginTop: "50px" };

  const onStandClick = () => {
    stand().then((response) => {
      if (response.status === 200) {
        refetcher.setRefetch(!refetcher.refetch);
      }
    });
  };

  const onNewGameClick = () => {
    newGame().then((response) => {
      if (response.status === 200) {
        refetcher.setRefetch(!refetcher.refetch);
      }
    });
  };

  const onHitClick = () => {
    hit().then((response) => {
      if (response.status === 200) {
        refetcher.setRefetch(!refetcher.refetch);
      }
    });
  };

  return (
    <React.Fragment>
      {game.state !== "active" ? (
        <React.Fragment>
          <Alert variant="primary">
            You {game.state} the game!
            <hr />
            <Button
              onClick={() => {
                onNewGameClick();
              }}
              variant="primary"
              size="sm"
              className="justify-content-end"
            >
              New Game
            </Button>
          </Alert>
        </React.Fragment>
      ) : null}
      <Row>
        <Col>
          <h3>
            Dealer's hand (
            {game.state !== "active" ? game.dealerHand.value : "?"})
          </h3>
        </Col>
      </Row>
      <Row>
        <Col xs={3} />
        <Col>
          {game.dealerHand.cards.map((card) => {
            return <Card card={card} />;
          })}
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <h3>Your hand ({game.playerHand.value})</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={3} />
        <Col>
          {game.playerHand.cards.map((card) => {
            return <Card card={card} />;
          })}
        </Col>
      </Row>
      <Row style={rowPadding}>
        <Col xs={4} />
        <Col xs={1}>
          <Button
            style={{ backgroundColor: "#7792792" }}
            onClick={() => {
              onStandClick();
            }}
            disabled={game.state !== "active"}
            variant="light"
          >
            Stand
          </Button>
        </Col>
        <Col xs={1}>
          <Button
            style={{ backgroundColor: "#2D6233" }}
            onClick={() => {
              onHitClick();
            }}
            disabled={game.state !== "active"}
            variant="dark"
          >
            Hit
          </Button>
        </Col>
        <Col xs={4} />
      </Row>
    </React.Fragment>
  );
}
