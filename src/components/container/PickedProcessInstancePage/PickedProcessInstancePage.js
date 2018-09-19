import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import ProcessInstanceHeader from '../../presentational/ProcessInstanceHeader';
import SectionHeader from '../../presentational/common/SectionHeader';
import BusinessData from '../../presentational/BusinessData';
import ActionPicker from '../../presentational/common/ActionPicker';
import Tasks from '../../presentational/common/Tasks';
import Activities from '../../presentational/Activities';
import * as pickedProcessInstanceActions from '../../../actions/pickedProcessInstanceActions';
import { Container, Row, Col } from 'react-grid-system';
import toastr from 'toastr';

class PickedProcessInstancePage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      completionStateFilter: 'Open',
      pickedActivityStatusFilterValue: 'READY',
      inProgress: false
    };

    this.handlePickedCompletionState = this.handlePickedCompletionState.bind(this);
    this.handlePickedActivityStatusFilter = this.handlePickedActivityStatusFilter.bind(this);
  }

  componentWillMount() {
    const processInstanceId = this.props.location.query.processInstanceId;
    if (processInstanceId) {
      if (!this.props.pickedProcessInstance.isPreloadedFromParent) {
        this.props.pickedProcessInstanceActions.retrieveAll(this.props.user, processInstanceId).then(() => {
          toastr.success('Instance loaded.');
        }).catch(error => {
          toastr.error(error);
        });
      }
      this.props.pickedProcessInstanceActions.storeIsPreloadedFromParent(false);
    } else {
      browserHistory.push('/tasks');
    }
  }

  componentWillUnmount() {
    this.props.pickedProcessInstanceActions.reset();
  }

  handlePickedCompletionState(event, completionStateFilter) {
    event.preventDefault();
    this.setState({ completionStateFilter, inProgress: true });
    this.props.pickedProcessInstanceActions.retrieveTasks(this.props.user, this.props.location.query.processInstanceId, completionStateFilter)
      .then(() => {
        this.setState({ inProgress: false });
        toastr.success('Instance tasks retrieved successfully.');
      })
      .catch(error => {
        this.setState({ inProgress: false });
        toastr.error(error);
      });
  }

  handlePickedActivityStatusFilter(event, pickedActivityStatusFilterValue) {
    event.preventDefault();
    this.setState({ pickedActivityStatusFilterValue, inProgress: true });
    this.props.pickedProcessInstanceActions.retrieveActivities(this.props.user, this.props.location.query.processInstanceId, pickedActivityStatusFilterValue)
      .then(() => {
        this.setState({ inProgress: false });
      })
      .catch(error => {
        this.setState({ inProgress: false });
        toastr.error(error);
      });
  }

  render() {
    return (
      <Container fluid={true} className="picked-process-instance-page">
        <Row>
          <Col md={12}>
            <ProcessInstanceHeader name={this.props.pickedProcessInstance.summary.name} />
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <SectionHeader name="Business Data" />
            <BusinessData businessData={this.props.pickedProcessInstance.businessData} />
            <SectionHeader name="Tasks" />
            <ActionPicker
              className="picked-process-instance-page__action-picker"
              actions={[
                { label: 'Open Tasks', value: 'Open' },
                { label: 'Completed Tasks', value: 'Completed' }
              ]}
              pickedActionValue={this.state.completionStateFilter}
              handlePickedAction={this.handlePickedCompletionState}
              inProgress={this.state.inProgress} />
            <Tasks
              tasks={this.props.pickedProcessInstance.tasks}
              inProgress={this.state.inProgress} />
          </Col>
          <Col md={3}>
            <SectionHeader name="Activities" />
            <Activities
              activities={this.props.pickedProcessInstance.activities}
              pickedActivityStatusFilterValue={this.state.pickedActivityStatusFilterValue}
              handlePickedActivityStatusFilter={this.handlePickedActivityStatusFilter}
              inProgress={this.state.inProgress} />
          </Col>
        </Row>
      </Container>
    );
  }

}

PickedProcessInstancePage.propTypes = {
  user: PropTypes.object.isRequired,
  pickedProcessInstance: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pickedProcessInstanceActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user,
    pickedProcessInstance: state.pickedProcessInstance
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pickedProcessInstanceActions: bindActionCreators(pickedProcessInstanceActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PickedProcessInstancePage);
