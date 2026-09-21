import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";

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
        maxWidth: "520px",
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
            "& .MuiAutocomplete-input": {
              fontFamily: "inherit",
              minHeight: "24px",
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
