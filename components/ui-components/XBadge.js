import React from "react";
import { deduceColor } from "../../utils/config/convertHelper";
import styles from "../../styles/components/XBadge.module.scss";

function XBadge({ content, color, ...props }) {
  return (
    <div className={styles.badgeContainer}>
      <span
        className={
          content > 0 ? styles.badge : `${styles.badge} + ${styles.hidden}`
        }
        style={{
          backgroundColor: color,
          color: deduceColor(color),
        }}
      >
        <p>{content}</p>
      </span>

      {props.children}
    </div>
  );
}

export default XBadge;
