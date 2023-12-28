import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const XAutoComplete = ({
  formData,
  setFormData,
  options,
  value,
  attributeKey,
  optionDisplayExpr,
  optionValueExpr,
  required,
  onChange,
  placeholder,
}) => {
  return (
    <Autocomplete
      size="small"
      sx={{
        width: "100%",
        margin: "5px 0px",
      }}
      value={options.find((option) => option[optionValueExpr] === value)}
      options={options}
      getOptionLabel={(options) => options[optionDisplayExpr] || ""}
      onChange={
        onChange
          ? onChange
          : (e, val) => {
              setFormData({
                ...formData,
                [attributeKey]: val !== null ? val[optionValueExpr] : "",
              });
            }
      }
      renderInput={(params) => (
        <TextField
          placeholder={placeholder}
          required={required}
          sx={{
            backgroundColor: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "5px !important",
              border: "1px solid #ccc !important",
            },
            "& .MuiAutocomplete-input": {
              fontFamily:
                "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
              padding: " 4px 0px !important",
              fontWeight: "400",
              fontSize: "14px",
            },
          }}
          {...params}
        />
      )}
    />
  );
};

export default XAutoComplete;
