import React from 'react';
import PropTypes from 'prop-types';
import BusinessDataItem from './BusinessDataItem';
import { onlyUpdateForKeys } from 'recompose';

const BusinessData = onlyUpdateForKeys(['businessData'])(({ businessData }) => {

  return (
    <div className="business-data">
      {businessData.length > 0 ? businessData.map(businessDataObject =>
        <BusinessDataItem key={businessDataObject.alias} businessDataObject={businessDataObject} />
      ) : null}
    </div>
  );

});

BusinessData.propTypes = {
  businessData: PropTypes.array.isRequired
};

export default BusinessData;
