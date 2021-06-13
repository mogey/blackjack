import react from "react";

export default function Card(props) {
  const { card } = props;
  const cardString = card.value + card.suit.charAt(0).toUpperCase();

  const style = { margin: "5px" };
  if (card.visible) {
    return (
      <img
        src={"/assets/" + cardString + ".svg"}
        height={168}
        width={120}
        style={style}
        alt={card.value + " " + card.suit}
      ></img>
    );
  } else {
    return (
      <img
        src="/assets/2B.svg"
        height={168}
        width={120}
        style={style}
        alt="Unknown card"
      ></img>
    );
  }
}
