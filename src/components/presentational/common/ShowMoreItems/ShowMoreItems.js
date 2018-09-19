import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';
import { Button } from 'react-bootstrap';

const ShowMoreItems = onlyUpdateForKeys(['length', 'total', 'inProgress'])(({ length, total, handleShowMoreClick, inProgress }) => {

  return (
    <div className="show-more-items">
      {length < total ?
        <div>
          <p>Showing {length} out of approximately {total} results</p>
          <Button className="show-more-items__button" bsStyle="primary" onClick={handleShowMoreClick} disabled={inProgress}>Show More</Button>
        </div>
        : null}
    </div>
  );

});

ShowMoreItems.propTypes = {
  length: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  handleShowMoreClick: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default ShowMoreItems;
