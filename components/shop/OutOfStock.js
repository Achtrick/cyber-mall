import { InfoOutlined } from "@mui/icons-material";
import React from "react";

function OutOfStock(props) {
  return (
    <p
      style={{
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        color: "red",
      }}
    >
      <InfoOutlined style={{ fontSize: "14px" }} />
      &nbsp; Hors stock.
    </p>
  );
}

export default OutOfStock;
