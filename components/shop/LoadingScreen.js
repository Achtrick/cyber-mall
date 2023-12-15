import { CircularProgress } from "@mui/material";
import React from "react";

function LoadingScreen(props) {
  return (
    <div className="loadingScreen">
      <CircularProgress color="primary" />
    </div>
  );
}

export default LoadingScreen;
