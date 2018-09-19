import React from 'react';
import PropTypes from 'prop-types';

const ProcessInstanceHeader = ({ name }) => {

  return (
    <div className="process-instance-header">{name}</div>
  );

};

ProcessInstanceHeader.propTypes = {
  name: PropTypes.string.isRequired
};

export default ProcessInstanceHeader;
