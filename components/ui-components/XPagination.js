import { Pagination } from "@mui/material";
import React from "react";

function XPagination({ page, count, onChange, color }) {
  return (
    <>
      <Pagination
        color={color}
        onChange={onChange}
        count={count}
        page={page + 1}
        variant="outlined"
      />
    </>
  );
}

export default XPagination;
