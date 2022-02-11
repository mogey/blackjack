import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import useSound from "use-sound";
import { bet, deal } from "../../services/blackjack.service";
import betSfx from "../../audio/bet.mp3";
import dealSfx from "../../audio/deal.mp3";

export default function Bet(props) {
  const { game, refetcher, user } = props; //destructure props so we know what we have

  const [betAmount, setBetAmount] = useState(0);
  const [playBet] = useSound(betSfx);
  const [playDeal] = useSound(dealSfx);
  const rowPadding = {
    margin: "25px auto",
    width: "50%",
  };

  const handleBetChange = (e) => {
    if (Number.isInteger(parseInt(e.target.value))) {
      setBetAmount(parseInt(e.target.value));
    } else {
      setBetAmount(0);
    }
  };

  const handleBetClick = (event) => {
    event.preventDefault();
    if (betAmount === 0) {
      return handleDealClick(event);
    }
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

  const handleDealClick = (event) => {
    deal(user).then((response) => {
      if (response.status === 200) {
        playDeal();
        refetcher.setRefetch(!refetcher.refetch);
      }
    });
  };

  const handleValueButton = (e) => {
    if (e.target.id === "+") {
      if (betAmount + 10 > game.playerCredits) {
        return setBetAmount(game.playerCredits);
      }
      return setBetAmount(betAmount + 10);
    }
    if (e.target.id === "-") {
      if (betAmount - 10 < 0) {
        return setBetAmount(0);
      }

      return setBetAmount(betAmount - 10);
    }
    if (e.target.id === "++") {
      return setBetAmount(game.playerCredits);
    }
  };

  return (
    <React.Fragment>
      <center>
        <Row style={rowPadding} className="justify-content-center">
          <Col>
            <Form inline onSubmit={handleBetClick}>
              <Form.Label
                style={{ margin: "10px", width: "100%" }}
                className="text-center"
              >
                Place your bet
              </Form.Label>
              <InputGroup className="mx-auto">
                <Button
                  variant="danger"
                  id="-"
                  onClick={(e) => {
                    handleValueButton(e);
                  }}
                  style={{ margin: "2px" }}
                >
                  -
                </Button>
                <FormControl
                  autoFocus
                  type="number"
                  onChange={(e) => {
                    handleBetChange(e);
                  }}
                  value={betAmount}
                  placeholder="Bet amount"
                  style={{ width: "75px", margin: "2px" }}
                />
                <Button
                  variant="success"
                  id="+"
                  onClick={(e) => {
                    handleValueButton(e);
                  }}
                  style={{ margin: "2px" }}
                >
                  +
                </Button>
                <Button
                  variant="primary"
                  id="++"
                  onClick={(e) => {
                    handleValueButton(e);
                  }}
                  style={{ margin: "2px 2px 2px 10px" }}
                >
                  ++
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        <Row style={rowPadding}>
          <Col>
            <Button
              style={{ backgroundColor: "#2D6233" }}
              onClick={handleBetClick}
            >
              Bet
            </Button>
          </Col>
          {/*
          <Col>
            <Button
              style={{ backgroundColor: "#7792792" }}
              onClick={() => {
                handleDealClick();
              }}
              disabled={betAmount > 0}
              variant="light"
            >
              Deal
            </Button>
            </Col>*/}
        </Row>
      </center>
    </React.Fragment>
  );
}
