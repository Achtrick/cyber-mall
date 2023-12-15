import { Pagination } from "@mui/material";
import React from "react";

function XPagination({ page, count, onChange }) {
  return (
    <Pagination
      onChange={onChange}
      count={count}
      page={page + 1}
      variant="outlined"
    />
  );
}

export default XPagination;
