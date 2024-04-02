import React, { useState } from "react";
import "../assets/styles/searchbar.css"; // Ensure this path is correct for your project
import { Autocomplete, TextField } from "@mui/material";

const SearchBar = ({ data, onSelect }) => {
  const [searchValue, setSearchValue] = useState("");

  const onSelectCustomer = (selectedName) => {
    if (!selectedName) return;
    const customer = data.find((customer) => {
      return customer.name == selectedName;
    });
    delete customer.labelKey;
    onSelect(customer);
    setSearchValue("");
  };

  return (
    <div className="search-bar-container" style={{ position: "relative" }}>
      <div className="search-input-wrapper">
        <Autocomplete
          freeSolo
          id="customer-search"
          style={{
            width: "400px",
            backgroundColor: "#eee",
            color: "white",
            borderRadius: "16px",
          }}
          onSelect={(e) => {
            if (e.target?.value) onSelectCustomer(e.target.value);
          }}
          options={data}
          clearOnEscape={true}
          inputValue={searchValue}
          onInputChange={(e, value) => {
            setSearchValue(value);
          }}
          getOptionLabel={(customer) => customer.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Customers"
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default SearchBar;
