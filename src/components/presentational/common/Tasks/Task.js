import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Moment from 'react-moment';
import { Container, Row, Col } from 'react-grid-system';

const Task = ({ task, handleViewInstanceSelection }) => {

  const taskDetails = resolveTaskDetails(task.assignedToTeamName, task.assignedToUserFullName, task.dueDate, task.closedDate);

  return (
    <div className="task panel panel-default">
      <div className="panel-body">
        <Container fluid={true}>
          <Row>
            <Col md={9}>
              <img className={resolveStatusIconClass(!!task.closedDate, task.isAtRisk, task.dueDate)} />
              <a className="task__subject-link" href={`${globalVars.config.api.environmentUrl}/teamworks/process.lsw?zWorkflowState=1&zTaskId=${task.id}&zResetContext=true`} target="_blank">{task.subject}</a>
              {handleViewInstanceSelection &&
                <span>
                  <DropdownButton id={task.id} bsSize="xsmall" title="" onSelect={handleViewInstanceSelection}>
                    <MenuItem eventKey={task.processInstanceId}>View Instance</MenuItem>
                  </DropdownButton>
                  <p className="task__process-instance-name">{task.processInstanceName}</p>
                </span>
              }
            </Col>
            <Col md={3} className="task__details-container">
              <div className="task__date-actor-container">
                <span className="task__date-prefix">{taskDetails.date.prefix}</span>
                <Moment format="LLL">{taskDetails.date.value}</Moment>
                <div>
                  {task.assignedToTeamName && <img className="task__actor-icon" />}
                  <span className="task__actor">{taskDetails.actor}</span>
                </div>
              </div>
              <div className="task__priority-container">
                <img className={resolvePriorityIconClass(task.priority)} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
  handleViewInstanceSelection: PropTypes.func
};

export default Task;

function resolveTaskDetails(assignedToTeamName, assignedToUserFullName, dueDate, closedDate) {
  let taskDetails;
  let actor = assignedToTeamName ? assignedToTeamName : (assignedToUserFullName ? '<actor-prefix>' + assignedToUserFullName : '');
  if (!closedDate) {
    taskDetails = {
      date: { prefix: 'Due: ', value: dueDate },
      actor: actor.replace('<actor-prefix>', 'Assigned to ')
    };
  } else {
    taskDetails = {
      date: { prefix: 'Completed: ', value: closedDate },
      actor: actor.replace('<actor-prefix>', 'Completed by ')
    };
  }
  return taskDetails;
}

function resolveStatusIconClass(isCompleted, isAtRisk, dueDate) {
  let iconClass;
  if (isCompleted) {
    iconClass = 'task__status-icon--completed';
  } else if (isAtRisk && new Date(dueDate) < new Date()) {
    iconClass = 'task__status-icon--overdue';
  } else if (isAtRisk && new Date(dueDate) > new Date()) {
    iconClass = 'task__status-icon--at-risk';
  } else {
    iconClass = 'task__status-icon--on-track';
  }
  return iconClass;
}

function resolvePriorityIconClass(priority) {
  let iconClass;
  switch (priority) {
    case 10:
      iconClass = 'task__priority-icon--highest';
      break;
    case 20:
      iconClass = 'task__priority-icon--high';
      break;
    case 40:
      iconClass = 'task__priority-icon--low';
      break;
    case 50:
      iconClass = 'task__priority-icon--lowest';
      break;
    default:
      iconClass = 'task__priority-icon--normal';
  }
  return iconClass;
}
