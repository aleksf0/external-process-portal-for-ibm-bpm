import React from 'react';
import PropTypes from 'prop-types';

const BusinessDataItem = ({ businessDataObject }) => {

  let businessDataItemJsx = (
    <div className="business-data-item">
      <div className="business-data-item__label">
        {businessDataObject.label}:
      </div>
      <div className="business-data-item__value">
        {String(businessDataObject.value)}
      </div>
    </div>
  );
  return businessDataObject.value !== null ? businessDataItemJsx : null;
};

BusinessDataItem.propTypes = {
  businessDataObject: PropTypes.object.isRequired
};

export default BusinessDataItem;
