import React, { useState } from "react";
import "../assets/styles/searchbar.css"; // Ensure this path is correct for your project
import { Autocomplete, TextField } from "@mui/material";
import Typeahead from "./Typeahead";

const SearchBar = ({ data, onSelect }) => {
  const onSelectCustomer = (selectedCustomer) => {
    if (!selectedCustomer) return;
    onSelect(selectedCustomer);
  };

  return (
    <div className="search-bar-container" style={{ position: "relative" }}>
      <div className="search-input-wrapper">
        <Typeahead
          label="Search Customers"
          data={data}
          onSelection={onSelectCustomer}
        />
      </div>
    </div>
  );
};

export default SearchBar;
