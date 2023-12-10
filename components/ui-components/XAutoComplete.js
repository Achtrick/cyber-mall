import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const XAutoComplete = ({
  formData,
  setFormData,
  options,
  value,
  attributeKey,
}) => {
  return (
    <Autocomplete
      size="small"
      sx={{
        width: "100%",
        margin: "5px 0px",
      }}
      value={value}
      options={options}
      onChange={(e, val) => {
        setFormData({
          ...formData,
          [attributeKey]: val !== null ? val : "",
        });
      }}
      renderInput={(params) => (
        <TextField
          required
          sx={{
            backgroundColor: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "5px !important",
              border: "1px solid #ccc !important",
            },
          }}
          {...params}
        />
      )}
    />
  );
};

export default XAutoComplete;
