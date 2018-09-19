import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem, Tooltip, OverlayTrigger } from 'react-bootstrap';

const ExposedItem = ({ item, handlePickedExposedItem, inProgress }) => {

  const DISPLAY_NAME_LENGTH_ALLOWED = 45;
  const displayName = item.displayName + (item.showProcessAppName ? ' (' + (item.processAppName ? item.processAppName : item.topLevelToolkitName) + ') ' : '') + (item.showBranch ? ' (' + item.branchName + ') ' : '');
  const displayNameMinified = displayName.length > DISPLAY_NAME_LENGTH_ALLOWED ? displayName.substr(0, DISPLAY_NAME_LENGTH_ALLOWED - 10) + '...' + displayName.substr(-10) : displayName;
  const tooltip = (<Tooltip id="tooltip">{displayName}</Tooltip>);

  return (
    <div className="exposed-item">
      <img className={item.type === 'service' ? 'exposed-item__icon--service' : 'exposed-item__icon--process'} />
      <span className="exposed-item__link-container">
        <OverlayTrigger placement="top" delayShow={500} overlay={tooltip}>
          <a className={'exposed-item__link ' + (inProgress ? 'exposed-item__link--disabled' : 'exposed-item__link--enabled')}
            onClick={e => { e.preventDefault(); handlePickedExposedItem(item, e); }}>
            {displayNameMinified}
          </a>
        </OverlayTrigger>
        {item.children.length > 0 &&
          <DropdownButton id={item.ID} pullRight={true} bsSize="xsmall" title="" onSelect={handlePickedExposedItem}>
            {item.children.map(childItem =>
              <MenuItem key={childItem.ID} eventKey={childItem}>{childItem.snapshotName}</MenuItem>
            )}
          </DropdownButton>
        }
      </span>
    </div>
  );
};

ExposedItem.propTypes = {
  item: PropTypes.object.isRequired,
  handlePickedExposedItem: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default ExposedItem;
