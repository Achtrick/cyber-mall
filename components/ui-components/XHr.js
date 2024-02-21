import React from "react";

function XHr({ color, width = "100%", marginLeft, height = "1px" }) {
  return (
    <div
      style={{
        backgroundColor: color,
        height: height,
        width: width,
        margin: "20px 0px",
        marginLeft: marginLeft,
      }}
    ></div>
  );
}

export default XHr;
