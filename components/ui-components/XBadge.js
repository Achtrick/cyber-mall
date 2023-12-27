import React from "react";
import { deduceColor } from "../../utils/config/convertHelper";
import styles from "../../styles/components/XBadge.module.scss";

function XBadge({ content, color, ...props }) {
  return (
    <div className={styles.badgeContainer}>
      <span
        className={styles.badge}
        style={{
          backgroundColor: color,
          color: deduceColor(color),
        }}
      >
        5
      </span>
      {props.children}
    </div>
  );
}

export default XBadge;
