import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';

const SearchForm = onlyUpdateForKeys(['searchFilter', 'inProgress'])(({ inputRef, onSubmit, onChange, searchFilter, inProgress }) => {

  return (
    <div className="search-form">
      <form onSubmit={onSubmit}>
        <div>
          <input
            ref={inputRef}
            name="searchFilter"
            type="text"
            className="form-control"
            value={searchFilter}
            onChange={onChange}
            disabled={inProgress} />
        </div>
      </form>
    </div>
  );

});

SearchForm.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  searchFilter: PropTypes.string.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default SearchForm;
