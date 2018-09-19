import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as processInstanceActions from '../../../actions/processInstanceActions';
import * as pickedProcessInstanceActions from '../../../actions/pickedProcessInstanceActions';
import SearchForm from '../../presentational/common/SearchForm';
import ActionPicker from '../../presentational/common/ActionPicker';
import ProcessInstances from '../../presentational/ProcessInstances';
import ShowMoreItems from '../../presentational/common/ShowMoreItems';
import toastr from 'toastr';
import { browserHistory } from 'react-router';
import { Container, Row, Col } from 'react-grid-system';

class ProcessInstancesPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      searchFilter: '',
      inProgress: false
    };

    this.setSearchFilter = this.setSearchFilter.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleShowMoreClick = this.handleShowMoreClick.bind(this);
    this.handlePickedCompletionState = this.handlePickedCompletionState.bind(this);
    this.handlePickedProcessInstance = this.handlePickedProcessInstance.bind(this);
  }

  componentWillMount() {
    this.setState({ searchFilter: this.props.processInstanceSearchState.searchCriteria.searchFilter });
    this.search(this.props.processInstanceSearchState.searchCriteria);
  }

  componentWillUnmount() {
    this.props.processInstanceActions.resetProcessInstanceSearch();
  }

  setSearchFilter(event) {
    this.setState({ searchFilter: event.target.value });
  }

  search(searchCriteria, focusSearchFilter = true) {
    this.setState({ inProgress: true });
    this.props.processInstanceActions.search(this.props.user, searchCriteria)
      .then(() => {
        this.setState({ inProgress: false });
        toastr.success('Processes instances retrieved successfully.');
        if (focusSearchFilter && this.searchFormInput) {
          this.searchFormInput.focus();
          this.searchFormInput.select();
        }
      })
      .catch(error => {
        this.setState({ inProgress: false });
        toastr.error(error);
      });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.search(Object.assign({}, this.props.processInstanceSearchState.searchCriteria, { searchFilter: this.state.searchFilter }));
  }

  handleShowMoreClick(event) {
    event.preventDefault();
    this.search(Object.assign({}, this.props.processInstanceSearchState.searchCriteria, { limit: this.props.processInstanceSearchState.searchCriteria.limit * 2 }), false);
  }

  handlePickedCompletionState(event, completionStateFilter) {
    event.preventDefault();
    this.search(Object.assign({}, this.props.processInstanceSearchState.searchCriteria, { completionStateFilter }));
  }

  handlePickedProcessInstance(processInstanceId, event) {
    event.preventDefault();
    if (!this.state.inProgress) {
      this.setState({ inProgress: true });
      this.props.pickedProcessInstanceActions.retrieveAll(this.props.user, processInstanceId)
        .then(() => {
          this.setState({ inProgress: false });
          this.props.pickedProcessInstanceActions.storeIsPreloadedFromParent(true);
          toastr.success('Instance loaded.');
          browserHistory.push({
            pathname: '/pickedProcessInstance',
            query: {
              processInstanceId
            }
          });
        }).catch(error => {
          this.setState({ inProgress: false });
          toastr.error(error);
        });
    }
  }

  render() {
    return (
      <Container fluid={true} className="process-instances-page">
        <Row>
          <Col md={12}>
            <SearchForm
              inputRef={el => this.searchFormInput = el}
              onSubmit={this.handleFormSubmit}
              onChange={this.setSearchFilter}
              searchFilter={this.state.searchFilter}
              inProgress={this.state.inProgress} />
          </Col>
        </Row>
        <Row>
          <Col>
            <ActionPicker
              className="process-instances-page__action-picker"
              actions={[
                { label: 'Active', value: 'Active' },
                { label: 'Completed', value: 'Completed' }
              ]}
              pickedActionValue={this.props.processInstanceSearchState.searchCriteria.completionStateFilter}
              handlePickedAction={this.handlePickedCompletionState}
              inProgress={this.state.inProgress} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <ProcessInstances
              processInstances={this.props.processInstanceSearchState.results.items}
              handlePickedProcessInstance={this.handlePickedProcessInstance}
              inProgress={this.state.inProgress} />
            <ShowMoreItems
              length={this.props.processInstanceSearchState.results.items.length}
              total={this.props.processInstanceSearchState.results.total}
              handleShowMoreClick={this.handleShowMoreClick}
              inProgress={this.state.inProgress} />
          </Col>
        </Row>
      </Container>
    );
  }

}

ProcessInstancesPage.propTypes = {
  user: PropTypes.object.isRequired,
  processInstanceSearchState: PropTypes.object.isRequired,
  processInstanceActions: PropTypes.object.isRequired,
  pickedProcessInstanceActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user,
    processInstanceSearchState: state.processInstanceSearchState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    processInstanceActions: bindActionCreators(processInstanceActions, dispatch),
    pickedProcessInstanceActions: bindActionCreators(pickedProcessInstanceActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessInstancesPage);
