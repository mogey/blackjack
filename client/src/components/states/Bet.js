import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { bet, deal } from "../../services/blackjack.service";
export default function Bet(props) {
  const { game, refetcher, user } = props; //destructure props so we know what we have

  const [betAmount, setBetAmount] = useState();
  const rowPadding = {
    margin: "25px auto",
    width: "50%",
  };

  const handleBetChange = (e) => {
    setBetAmount(e.target.value);
  };

  const handleBetClick = () => {
    bet(betAmount, user).then((response) => {
      if (response.status === 200) {
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
          <Form inline>
            <Form.Label style={{ margin: "10px" }}>Place your bet</Form.Label>
            <Form.Control
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
              onClick={() => {
                handleBetClick();
              }}
              style={{ backgroundColor: "#2D6233" }}
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
