import React from 'react';
import PropTypes from 'prop-types';
import ProcessInstance from './ProcessInstance';
import Preloader from '../common/Preloader';
import { onlyUpdateForKeys } from 'recompose';

const ProcessInstances = onlyUpdateForKeys(['processInstances', 'inProgress'])(({ processInstances, handlePickedProcessInstance, inProgress }) => {
  return (
    <div>
      <div className="panel-group">
        {processInstances.length > 0 ? processInstances.map(processInstance =>
          <ProcessInstance
            handlePickedProcessInstance={handlePickedProcessInstance}
            key={processInstance.id}
            processInstance={processInstance}
            inProgress={inProgress} />
        ) : inProgress ? <Preloader /> : null}
      </div>
    </div>
  );
});

ProcessInstances.propTypes = {
  processInstances: PropTypes.array.isRequired,
  handlePickedProcessInstance: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default ProcessInstances;
