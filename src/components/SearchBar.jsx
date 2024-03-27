import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../assets/styles/searchbar.css'; // Ensure this path is correct for your project

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className='search-bar-container'>
      <form onSubmit={handleSearchSubmit} className='search-form'>
        <div className='search-input-wrapper'>
          <div className='search-icon-wrapper'>
            <FaSearch className='search-icon' />
          </div>
          <input
            type='text'
            className='search-input'
            placeholder='Search Jobs, Opportunities, Customers'
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>
        <button type='submit' className='search-button'>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
