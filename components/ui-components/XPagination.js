import { Pagination } from "@mui/material";
import React from "react";

function XPagination({ page, count, onChange }) {
  return (
    <>
      {count > 1 ? (
        <Pagination
          onChange={onChange}
          count={count}
          page={page + 1}
          variant="outlined"
        />
      ) : null}
    </>
  );
}

export default XPagination;
