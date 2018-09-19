import React from 'react';
import PropTypes from 'prop-types';
import Task from './Task';
import Preloader from '../Preloader';
import { onlyUpdateForKeys } from 'recompose';

const Tasks = onlyUpdateForKeys(['tasks', 'inProgress'])(({ tasks, handleViewInstanceSelection, inProgress }) => {

  return (
    <div className="panel-group">
      {tasks.length > 0 ? tasks.map(task =>
        <Task
          handleViewInstanceSelection={handleViewInstanceSelection}
          key={task.id}
          task={task} />
      ) : inProgress ? <Preloader /> : null}
    </div>
  );

});

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  handleViewInstanceSelection: PropTypes.func,
  inProgress: PropTypes.bool.isRequired
};

export default Tasks;
