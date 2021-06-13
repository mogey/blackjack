import react from "react";

export default function Card(props) {
  const { card } = props;
  const cardString = card.value + card.suit.charAt(0).toUpperCase();
  if (card.visible) {
    return <img src={"/assets/" + cardString + ".svg"}></img>;
  } else {
    return <img src="/assets/2B.svg"></img>;
  }
}
