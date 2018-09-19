import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const Activity = ({ activity }) => {

  return (
    <Button bsStyle="link" className={'activity ' + resolveStatusIconClass(activity.executionState, activity.optionType)}>
      <img className="activity__icon-placeholder"/>
      <span className="activity__name">{activity.name}</span>
    </Button>
  );

};

Activity.propTypes = {
  activity: PropTypes.object
};

export default Activity;

function resolveStatusIconClass(executionState, optionType) {
  let iconClass;
  if (executionState === 'READY') {
    if (optionType === 'REQUIRED') {
      iconClass = 'activity__icon-wrapper--ready-required';
    } else {
      iconClass = 'activity__icon-wrapper--ready-optional';
    }
  } else if (executionState === 'WAITING') {
    if (optionType === 'REQUIRED') {
      iconClass = 'activity__icon-wrapper--waiting-required';
    } else {
      iconClass = 'activity__icon-wrapper--waiting-optional';
    }
  } else if (executionState === 'WORKING') {
    iconClass = 'activity__icon-wrapper--working';
  } else if (executionState === 'COMPLETED') {
    iconClass = 'activity__icon-wrapper--completed';
  } else if (executionState === 'FAILED') {
    iconClass = 'activity__icon-wrapper--failed';
  } else {
    iconClass = 'activity__icon-wrapper--disabled';
  }
  return iconClass;
}
