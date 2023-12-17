import React from "react";
import Badge from "@mui/material/Badge";

function XBadge({ content, color, ...props }) {
  return (
    <Badge badgeContent={content} color={color}>
      {props.children}
    </Badge>
  );
}

export default XBadge;
