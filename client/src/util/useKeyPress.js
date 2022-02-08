import { useState, useEffect } from "react";

export default function useKeyPress(key) {
  const [keyPressed, setKeyPressed] = useState(false);

  function onKeyDown(e) {
    if (e.key === key) {
      setKeyPressed(true);
    }
  }

  function onKeyUp(e) {
    if (e.key === key) {
      setKeyPressed(false);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  }, []);
  return keyPressed;
}
