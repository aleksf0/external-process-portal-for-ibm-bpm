import React from 'react';
import PropTypes from 'prop-types';
import ExposedItem from './ExposedItem';
import Preloader from '../common/Preloader';
import { onlyUpdateForKeys } from 'recompose';

const ExposedItems = onlyUpdateForKeys(['items', 'inProgress'])(({ items, handlePickedExposedItem, inProgress }) => {

  return (
    <div>
      {items.length > 0 ? items.map(item =>
        <ExposedItem key={item.ID} item={item} handlePickedExposedItem={handlePickedExposedItem} inProgress={inProgress} />
      ) : <Preloader />}
    </div>
  );

});

ExposedItems.propTypes = {
  items: PropTypes.array.isRequired,
  handlePickedExposedItem: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default ExposedItems;
