import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";

export default function Lobby(props) {
  const { socket, user } = props;
  const [roomCode, setRoomcode] = useState(window.location.pathname);
  const [players, setPlayers] = useState([]);

  const handleRoomCodeChange = (e) => {
    setRoomcode(e.target.value);
    socket.emit("roomCode", e.target.value);
  };

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("login", user);
    });
    socket.on("players", (players) => {
      setPlayers(players);
    });
    return () => {
      socket.off("roomCode");
      socket.off("players");
    };
  }, [socket, roomCode, user]);

  const handleJoinClick = (e) => {};

  const handleCreateClick = (e) => {
    socket.emit("createRoom", user, (response) => {
      setRoomcode(response);
      window.location.pathname = response;
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <FormLabel>Enter your room code</FormLabel>
            <FormControl
              autoFocus
              onChange={(e) => handleRoomCodeChange(e)}
              placeholder="Room code"
              value={roomCode}
              style={{ width: "150px", margin: "20px" }}
            ></FormControl>
            <Button
              onClick={(e) => {
                handleJoinClick(e);
              }}
            >
              Join
            </Button>
            <Button
              onClick={(e) => {
                handleCreateClick(e);
              }}
            >
              Create Room
            </Button>
          </Form>
          There are {players.length} players online!
          {JSON.stringify(players, null, 0)};
        </Col>
      </Row>
    </Container>
  );
}
