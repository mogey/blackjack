import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Row,
} from "react-bootstrap";
import { login } from "../services/blackjack.service";

export default function LoginForm(props) {
  const [name, setName] = useState();
  const [pin, setPin] = useState();
  const [responseData, setResponse] = useState();
  const [nameMessage, setNameMessage] = useState("");
  const [pinMessage, setPinMessage] = useState("");

  const localStorage = window.localStorage;

  useEffect(() => {
    validate();
  }, [name, pin]);

  const validate = () => {
    let isValid = true;
    if (!name || name.length > 32) {
      setNameMessage("Name is required, must be less than 32 characters.");
      isValid = false;
    } else {
      setNameMessage("");
    }
    if (!pin || pin.length > 4) {
      setPinMessage("Pin is required, must be 4 or less characters");
      isValid = false;
    } else {
      setPinMessage("");
    }
    return isValid;
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };

  const handleLoginClick = (e) => {
    login(name, pin).then((response) => {
      if (response) {
        if (response.status === 200) {
          props.setUser(response.data.token);
        } else {
          setResponse(responseData);
        }
      }
    });
    e.preventDefault();
  };

  return (
    <React.Fragment>
      <Row
        className="d-flex flex-row flex-nowrap justify-content-center"
        style={{ margin: "50px" }}
      >
        <Col>
          <h1>Login/Register</h1>

          <Form>
            <Form.Group
              controlId="formBasicUsername"
              style={{ marginTop: "10px" }}
            >
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter username"
                onChange={(e) => {
                  handleNameChange(e);
                }}
              />
            </Form.Group>
            <Form.Text className="text-warning">{nameMessage}</Form.Text>

            <Form.Group
              controlId="formBasicPassword"
              style={{ marginTop: "10px" }}
            >
              <Form.Label>Pin (4 digits)</Form.Label>
              <Form.Control
                type="password"
                placeholder="Pin"
                onChange={(e) => {
                  handlePinChange(e);
                }}
              />
            </Form.Group>
            <Form.Text className="text-warning">{pinMessage}</Form.Text>
            <br />
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => {
                handleLoginClick(e);
              }}
            >
              Login/Register
            </Button>
          </Form>
        </Col>
      </Row>
    </React.Fragment>
  );
}
