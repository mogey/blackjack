import React from "react";
import styles from "./card.module.css";

export default function Card(props) {
  const { card } = props;
  const cardString = card.value + card.suit.charAt(0).toUpperCase();
  if (card.visible) {
    return (
      <img
        src={"/assets/" + cardString + ".svg"}
        height={168}
        width={120}
        className={styles.card}
        alt={card.value + " " + card.suit}
      ></img>
    );
  } else {
    return (
      <img
        src="/assets/2B.svg"
        height={168}
        width={120}
        className={styles.cardNoShadow}
        alt="Unknown card"
      ></img>
    );
  }
}
