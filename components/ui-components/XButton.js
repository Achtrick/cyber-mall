import React from "react";
import styles from "../../styles/components/XButton.module.scss";
import { deduceColor } from "../../utils/config/convertHelper";

function XButton({ text, color, action = () => {}, props }) {
  return (
    <button
      onClick={action}
      className={styles.xbutton}
      style={{
        backgroundColor: color,
        color: deduceColor(color),
        margin: "10px 0px",
        border: `1px solid ${color}`,
        transition: "0.1s",
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = deduceColor(color);
        e.target.style.color = color;
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = color;
        e.target.style.color = deduceColor(color);
      }}
    >
      {text}
    </button>
  );
}

export default XButton;
