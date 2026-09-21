import { Button, CircularProgress, IconButton, Modal } from "@mui/material";
import styles from "../../styles/components/XModal.module.scss";
import { CloseIcon } from "../../utils/theme/icons";
import { ModalSizes } from "../admin/ModalSettings";

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
    <Modal style={{ zIndex: "1000 !important" }} open={open} onClose={onClose}>
      <div className={styles.container}>
        <div
          className={
            size === ModalSizes.SMALL
              ? `${styles.modal} + ${styles.small}`
              : size === ModalSizes.XSMALL
              ? `${styles.modal} + ${styles.xsmall}`
              : size === ModalSizes.MEDIUM
              ? `${styles.modal} + ${styles.medium}`
              : size === ModalSizes.BIG
              ? `${styles.modal} + ${styles.big}`
              : null
          }
        >
          <div className={styles.header}>
            <p>{title}</p>
            <IconButton color="white" onClick={onClose}>
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
                      color="black"
                      style={{ color: "white" }}
                      variant="contained"
                      onClick={cancelAction}
                    >
                      cancel
                    </Button>
                    &nbsp;
                    <Button
                      color="black"
                      style={{ color: "white" }}
                      variant="contained"
                      type={confirmAction ? "" : "submit"}
                      onClick={confirmAction ? confirmAction : null}
                      form={formId ? formId : null}
                    >
                      confirm
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
