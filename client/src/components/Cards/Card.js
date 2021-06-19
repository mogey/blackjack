import React from "react";
import styles from "./card.module.css";
import { Image } from "react-bootstrap";

export default function Card(props) {
  const { card } = props;

  const cardString = card.value + card.suit.charAt(0).toUpperCase(); //converts card to a string to find the mapped image name

  if (card.visible) {
    return (
      <img
        src={"/blackjack/assets/" + cardString + ".svg"}
        className={styles.card}
        alt={card.value + " of " + card.suit}
      ></img>
    );
  } else {
    return (
      <img
        src="/blackjack/assets/2B.svg"
        className={styles.cardNoShadow}
        alt="Unknown card"
      ></img>
    );
  }
}
