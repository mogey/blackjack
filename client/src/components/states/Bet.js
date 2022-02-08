import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import useSound from "use-sound";
import { bet, deal } from "../../services/blackjack.service";
import betSfx from "../../audio/bet.mp3";

export default function Bet(props) {
  const { game, refetcher, user } = props; //destructure props so we know what we have

  const [betAmount, setBetAmount] = useState();
  const [playBet] = useSound(betSfx);
  const rowPadding = {
    margin: "25px auto",
    width: "50%",
  };

  const handleBetChange = (e) => {
    setBetAmount(e.target.value);
  };

  const handleBetClick = (event) => {
    event.preventDefault();
    bet(betAmount, user).then((response) => {
      if (response.status === 200) {
        playBet();
        setBetAmount();
        refetcher.setRefetch(!refetcher.refetch);
      } else {
        game.message = "Error " + response.status;
      }
    });
  };

  const handleDealClick = () => {
    deal(user).then((response) => {
      if (response.status === 200) {
        refetcher.setRefetch(!refetcher.refetch);
      }
    });
  };

  return (
    <React.Fragment>
      <Row style={rowPadding} className="justify-content-center">
        <Col>
          <Form inline onSubmit={handleBetClick}>
            <Form.Label style={{ margin: "10px" }}>Place your bet</Form.Label>
            <Form.Control
              autoFocus
              onChange={(e) => {
                handleBetChange(e);
              }}
              value={betAmount}
              placeholder="Bet amount"
              style={{ marginRight: "10px" }}
            />
          </Form>
        </Col>
      </Row>
      <center>
        <Row style={rowPadding}>
          <Col>
            <Button
              style={{ backgroundColor: "#2D6233" }}
              onClick={handleBetClick}
            >
              Bet
            </Button>
          </Col>
          <Col>
            <Button
              style={{ backgroundColor: "#7792792" }}
              onClick={() => {
                handleDealClick();
              }}
              variant="light"
            >
              Deal
            </Button>
          </Col>
        </Row>
      </center>
    </React.Fragment>
  );
}
