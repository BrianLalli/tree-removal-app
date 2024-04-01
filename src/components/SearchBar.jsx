import React, { useState } from 'react';
import '../assets/styles/searchbar.css'; // Ensure this path is correct for your project

const SearchBar = ({ data, onSearch }) => { // Make sure to pass 'data' prop for search items
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchTermChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value) {
      const filteredResults = data.filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filteredResults);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
    setShowDropdown(false);
  };

  const handleResultClick = (item) => {
    setSearchTerm(item.name); // or any other identifier you prefer
    setShowDropdown(false);
    onSearch(item.name);
  };

  return (
    <div className='search-bar-container' style={{ position: 'relative' }}>
      <form onSubmit={handleSearchSubmit} className='search-form'>
        <div className='search-input-wrapper'>
          <input
            type='text'
            className='search-input'
            placeholder='Search Customer'
            value={searchTerm}
            onChange={handleSearchTermChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 300)} // Hide dropdown shortly after losing focus
          />
        </div>
        <button type='submit' className='search-button'>
          Search
        </button>
      </form>
      {showDropdown && (
        <div className='search-results-dropdown'>
          {filteredData.map((item, index) => (
            <div
              key={index}
              className='search-result-item'
              onClick={() => handleResultClick(item)}
            >
              <div className='search-results-text'>
                <img src={item.image} alt={item.name} className='search-result-image' />
                {item.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
