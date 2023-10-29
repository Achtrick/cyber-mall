import { Modal as MaterialModal } from "@mui/material";
import React from "react";
import styles from "../../styles/components/Modal.module.scss";
import { ModalSizes } from "./ModalSettings";

function Modal({ open, onClose, title, size, ...props }) {
  return (
    <MaterialModal open={open} onClose={onClose}>
      <div
        className={
          size === ModalSizes.BIG
            ? `${styles.modal} + ${styles.big}`
            : size === ModalSizes.SMALL
            ? `${styles.modal} + ${styles.small}`
            : null
        }
      >
        <div className={styles.header}>
          <p>{title}</p>
        </div>
        <div className={styles.content}>{props.children}</div>
      </div>
    </MaterialModal>
  );
}

export default Modal;
