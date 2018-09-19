import React from 'react';
import PropTypes from 'prop-types';
import Activity from './Activity';
import ActionPicker from '../common/ActionPicker';
import { onlyUpdateForKeys } from 'recompose';

const Activities = onlyUpdateForKeys(['activities', 'pickedActivityStatusFilterValue', 'inProgress'])(({ activities, pickedActivityStatusFilterValue, handlePickedActivityStatusFilter, inProgress }) => {

  return (
    <div className="activities">
      <ActionPicker
        className="activities__action-picker"
        actions={[
          { label: 'Ready', value: 'READY' },
          { label: 'In progress', value: 'IN_PROGRESS' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'All', value: 'ALL' }
        ]}
        pickedActionValue={pickedActivityStatusFilterValue}
        handlePickedAction={handlePickedActivityStatusFilter}
        inProgress={inProgress} />
      {activities.map(activity =>
        <Activity key={activity.id} activity={activity} />
      )}
    </div>
  );

});

Activities.propTypes = {
  activities: PropTypes.array.isRequired,
  pickedActivityStatusFilterValue: PropTypes.string.isRequired,
  handlePickedActivityStatusFilter: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default Activities;
