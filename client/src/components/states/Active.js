import React from "react";
import { Row, Col, Button, Alert } from "react-bootstrap";
import { hit, newGame, stand } from "../../services/blackjack.service";
import Card from "../Cards/Card";
import useSound from "use-sound";

import hitSfx from '../../audio/hit.mp3';

export default function Active(props) {
  const { game, refetcher, user } = props; //destructure props so we know what we have

  const [playHit] = useSound(hitSfx);

  const rowPadding = { marginTop: "50px" };

  const onStandClick = () => {
    stand(user).then((response) => {
      if (response.status === 200) {
        refetcher.setRefetch(!refetcher.refetch);
      }
    });
  };

  const onNewGameClick = () => {
    newGame(user).then((response) => {
      if (response.status === 200) {
        refetcher.setRefetch(!refetcher.refetch);
      }
    });
  };

  const onHitClick = () => {
    playHit();
    hit(user).then((response) => {
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
            <Button
              onClick={() => {
                onNewGameClick();
              }}
              variant="primary"
              size="sm"
              style={{ float: "right", position: "relative", bottom: "3px" }}
            >
              New Game
            </Button>
          </Alert>
        </React.Fragment>
      ) : null}
      <center>
        <Row>
          <Col>
            <h3>
              Dealer's hand (
              {game.state !== "active" ? game.dealerHand.value : "?"})
            </h3>
          </Col>
        </Row>
        <Row className="">
          <Col className="d-inline-flex flex-row flex-nowrap justify-content-center">
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
        <Row className="d-flex flex-row flex-nowrap justify-content-center">
          <Col
            className="d-flex justify-content-center"
            style={{ minWidth: 0 }}
          >
            {game.playerHand.cards.map((card) => {
              return <Card card={card} />;
            })}
          </Col>
        </Row>
        <center>
          <Row style={rowPadding} a>
            <Col>
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
            <Col>
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
          </Row>
        </center>
      </center>
    </React.Fragment>
  );
}
