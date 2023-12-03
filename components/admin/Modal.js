import { Button, IconButton, Modal as MaterialModal } from "@mui/material";
import React from "react";
import styles from "../../styles/components/Modal.module.scss";
import { ModalControls, ModalSizes } from "./ModalSettings";
import { CloseIcon } from "../../utils/theme/icons";

function Modal({
  open,
  onClose,
  title,
  size,
  confirmAction,
  cancelAction,
  ...props
}) {
  return (
    <MaterialModal open={open} onClose={onClose}>
      <div className={styles.container}>
        <div
          className={
            size === ModalSizes.BIG
              ? `${styles.modal} + ${styles.big}`
              : size === ModalSizes.SMALL
              ? `${styles.modal} + ${styles.small}`
              : size === ModalSizes.MEDIUM
              ? `${styles.modal} + ${styles.medium}`
              : null
          }
        >
          <div className={styles.header}>
            <p>{title}</p>
            <IconButton onClick={onClose}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </div>
          <div className={styles.content}>
            {props.children}
            <div className={styles.controls}>
              <Button color="white" variant="contained" onClick={confirmAction}>
                {ModalControls.CONFIRM}
              </Button>
              &nbsp;
              <Button color="white" variant="contained" onClick={cancelAction}>
                {ModalControls.CANCEL}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MaterialModal>
  );
}

export default Modal;
