import { CircularProgress } from "@mui/material";
import styles from "../../styles/components/XButton.module.scss";
import { deduceColor } from "../../utils/config/convertHelper";

function XButton({
  text,
  color,
  width,
  inversed,
  disabled = false,
  loading = false,
  action = () => {},
  props,
}) {
  return (
    <>
      {loading ? (
        <CircularProgress
          size={"20px"}
          style={{ color: color, margin: "16px 0px" }}
        />
      ) : (
        <button
          onClick={action}
          className={styles.xbutton}
          disabled={disabled}
          style={
            inversed
              ? {
                  opacity: disabled ? "0.6" : "1",
                  pointerEvents: disabled ? "none" : "all",
                  backgroundColor: deduceColor(color),
                  color: color,
                  width: width ?? "auto",
                  margin: "10px 0px",
                  border: `1px solid ${color}`,
                  transition: "0.1s",
                }
              : {
                  opacity: disabled ? "0.6" : "1",
                  pointerEvents: disabled ? "none" : "all",
                  backgroundColor: color,
                  color: deduceColor(color),
                  width: width ?? "auto",
                  margin: "10px 0px",
                  border: `1px solid ${color}`,
                  transition: "0.1s",
                }
          }
          onMouseOver={(e) => {
            if (inversed) {
              e.target.style.backgroundColor = color;
              e.target.style.color = deduceColor(color);
            } else {
              e.target.style.backgroundColor = deduceColor(color);
              e.target.style.color = color;
            }
          }}
          onMouseLeave={(e) => {
            if (inversed) {
              e.target.style.backgroundColor = deduceColor(color);
              e.target.style.color = color;
            } else {
              e.target.style.backgroundColor = color;
              e.target.style.color = deduceColor(color);
            }
          }}
        >
          {text}
        </button>
      )}
    </>
  );
}

export default XButton;
