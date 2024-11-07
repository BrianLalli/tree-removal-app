import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const Typeahead = ({ label, data, onSelection, defaultValue }) => {
  return (
    <Autocomplete
      freeSolo
      id="customer-search"
      style={{
        width: "100%",
        backgroundColor: "#eee",
        color: "white",
        borderRadius: "16px",
      }}
      options={data}
      getOptionLabel={(option) => option.name}
      defaultValue={defaultValue}
      onChange={(event, newValue) => {
        onSelection(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label ? label : "Search Customers"}
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
        />
      )}
    />
  );
};

export default Typeahead;
