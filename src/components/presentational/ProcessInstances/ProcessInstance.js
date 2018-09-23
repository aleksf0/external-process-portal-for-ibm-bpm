import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Container, Row, Col } from 'react-grid-system';

const ProcessInstance = ({ processInstance, handlePickedProcessInstance, inProgress }) => {

  const dateDetails = resolveDateDetails(processInstance.status, processInstance.dueDate, processInstance.completionDate);

  return (
    <div className="process-instance panel panel-default">
      <Container fluid={true} className="panel-body">
        <Row>
          <Col md={10}>
            <div className="process-instance__image-container">
              <img className={resolveStatusIconClass(processInstance.riskState, processInstance.status)} />
            </div>
            <div className="process-instance__name-container">
              <a className={'process-instance__link ' + (inProgress ? 'process-instance__link--disabled' : 'process-instance__link--enabled')}
                onClick={(event) => { handlePickedProcessInstance(processInstance.id.split('.').pop(), event); }}>
                {processInstance.name}
              </a>
              <div className="process-instance__created-date-container">
                <span className="process-instance__created-date-prefix">Created: </span>
                <Moment format="LLL">{processInstance.creationDate}</Moment>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="process-instance__date-details-container">
              <span className="process-instance__date-prefix">{dateDetails.prefix}</span>
              {dateDetails.value && <Moment format="LLL">{dateDetails.value}</Moment>}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );

};

ProcessInstance.propTypes = {
  processInstance: PropTypes.object.isRequired,
  handlePickedProcessInstance: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default ProcessInstance;

function resolveDateDetails(status, dueDate, completionDate) {
  let dateDetails;
  if (status === 'ACTIVE' || status === 'SUSPENDED' || status === 'FAILED') {
    if (dueDate) {
      dateDetails = { prefix: 'Due: ', value: dueDate };
    } else {
      dateDetails = { prefix: 'No due date', value: null };
    }
  } else {
    dateDetails = { prefix: 'Completed: ', value: completionDate };
  }
  return dateDetails;
}

function resolveStatusIconClass(riskState, status) {
  let iconClass;
  switch (riskState) {
    case 'OnTrack':
      if (status === 'SUSPENDED') {
        iconClass = 'process-instance__icon--on-track-suspended';
      } else if (status === 'ACTIVE') {
        iconClass = 'process-instance__icon--on-track-active';
      } else if (status === 'FAILED') {
        iconClass = 'process-instance__icon--failed';
      } else {
        iconClass = 'process-instance__icon--completed';
      }
      break;
    case 'Overdue':
      if (status === 'SUSPENDED') {
        iconClass = 'process-instance__icon--overdue-suspended';
      } else if (status === 'ACTIVE') {
        iconClass = 'process-instance__icon--overdue-active';
      } else if (status === 'FAILED') {
        iconClass = 'process-instance__icon--failed';
      } else {
        iconClass = 'process-instance__icon--completed';
      }
      break;
    case 'AtRisk':
      if (status === 'SUSPENDED') {
        iconClass = 'process-instance__icon--at-risk-suspended';
      } else if (status === 'ACTIVE') {
        iconClass = 'process-instance__icon--at-risk-active';
      } else if (status === 'FAILED') {
        iconClass = 'process-instance__icon--failed';
      } else {
        iconClass = 'process-instance__icon--completed';
      }
      break;
    default:
      iconClass = 'process-instance__icon--completed';
  }
  return iconClass;
}
