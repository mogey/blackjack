import React from "react";
import styles from "./card.module.css";

export default function Card({ card, small }) {
  if (!card || !card.suit) {
    return (
      <img
        src={`${process.env.PUBLIC_URL}/assets/2B.svg`}
        className={`${styles.cardBack} ${small ? styles.small : ""}`}
        alt="Unknown card"
      />
    );
  }

  const cardString = card.value + card.suit.charAt(0).toUpperCase();
  const className = small
    ? `${styles.card} ${styles.small}`
    : styles.card;

  if (card.visible) {
    return (
      <img
        src={`${process.env.PUBLIC_URL}/assets/${cardString}.svg`}
        className={className}
        alt={`${card.value} of ${card.suit}`}
      />
    );
  } else {
    return (
      <img
        src={`${process.env.PUBLIC_URL}/assets/2B.svg`}
        className={`${styles.cardBack} ${small ? styles.small : ""}`}
        alt="Hidden card"
      />
    );
  }
}
