import React from 'react';
import PropTypes from 'prop-types';

const SectionHeader = ({ name }) => {

  return (
    <p className="section-header">{name}</p>
  );

};

SectionHeader.propTypes = {
  name: PropTypes.string.isRequired
};

export default SectionHeader;
