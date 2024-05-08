import CancelIcon from "@mui/icons-material/Cancel";
import React from "react";
import styles from "../../styles/components/XTag.module.scss";

function XTag({ entries, action, displayExpr, ...props }) {
  return (
    <div className={styles.tagsContainer}>
      {entries?.map((entry, index) => {
        return (
          <span className={styles.tag} key={index}>
            {displayExpr ? entry[displayExpr] : entry}&nbsp;
            <CancelIcon
              sx={{ cursor: "pointer" }}
              fontSize="15px"
              onClick={() => action(entry)}
            />
          </span>
        );
      })}
    </div>
  );
}

export default XTag;
