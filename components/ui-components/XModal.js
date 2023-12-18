import { Button, CircularProgress, IconButton, Modal } from "@mui/material";
import React from "react";
import styles from "../../styles/components/Modal.module.scss";
import { ModalControls, ModalSizes } from "../admin/ModalSettings";
import { CloseIcon } from "../../utils/theme/icons";

function XModal({
  loading,
  open,
  onClose,
  title,
  size,
  confirmAction,
  cancelAction,
  formId,
  hideControls,
  ...props
}) {
  return (
    <Modal open={open} onClose={onClose}>
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
            {!hideControls ? (
              <div className={styles.controls}>
                {loading ? (
                  <Button>
                    <CircularProgress size={"25px"} color="black" />
                  </Button>
                ) : (
                  <>
                    <Button
                      color="white"
                      variant="contained"
                      type={confirmAction ? "" : "submit"}
                      onClick={confirmAction ? confirmAction : null}
                      form={formId ? formId : null}
                    >
                      {ModalControls.CONFIRM}
                    </Button>
                    &nbsp;
                    <Button
                      color="white"
                      variant="contained"
                      onClick={cancelAction}
                    >
                      {ModalControls.CANCEL}
                    </Button>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default XModal;
