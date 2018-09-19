import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as exposedItemActions from '../../../actions/exposedItemActions';
import * as taskActions from '../../../actions/taskActions';
import * as pickedProcessInstanceActions from '../../../actions/pickedProcessInstanceActions';
import SearchForm from '../../presentational/common/SearchForm';
import ActionPicker from '../../presentational/common/ActionPicker';
import Tasks from '../../presentational/common/Tasks';
import ShowMoreItems from '../../presentational/common/ShowMoreItems';
import ExposedItems from '../../presentational/ExposedItems';
import toastr from 'toastr';
import { browserHistory } from 'react-router';
import { Container, Row, Col } from 'react-grid-system';

class TasksPage extends React.Component {

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
    this.handlePickedExposedItem = this.handlePickedExposedItem.bind(this);
    this.handleViewInstanceSelection = this.handleViewInstanceSelection.bind(this);
  }

  componentWillMount() {
    this.setState({ searchFilter: this.props.taskSearchState.searchCriteria.searchFilter });
    this.search(this.props.taskSearchState.searchCriteria);
    if (this.props.exposedItems.length === 0) { // This is a very slow service, hence only load first time after login and refresh after logout
      this.props.exposedItemActions.retrieve(this.props.user)
        .catch(error => {
          toastr.error(error);
        });
    }
  }

  componentWillUnmount() {
    this.props.taskActions.resetTaskSearch();
  }

  setSearchFilter(event) {
    this.setState({ searchFilter: event.target.value });
  }

  search(searchCriteria, focusSearchFilter = true) {
    this.setState({ inProgress: true });
    this.props.taskActions.search(this.props.user, searchCriteria)
      .then(() => {
        this.setState({ inProgress: false });
        toastr.success('Tasks retrieved successfully.');
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
    this.search(Object.assign({}, this.props.taskSearchState.searchCriteria, { searchFilter: this.state.searchFilter }));
  }

  handleShowMoreClick(event) {
    event.preventDefault();
    this.search(Object.assign({}, this.props.taskSearchState.searchCriteria, { limit: this.props.taskSearchState.searchCriteria.limit * 2 }), false);
  }

  handlePickedCompletionState(event, completionStateFilter) {
    event.preventDefault();
    this.search(Object.assign({}, this.props.taskSearchState.searchCriteria, { completionStateFilter }));
  }

  handlePickedExposedItem(exposedItem, event) {
    event.preventDefault();
    if (exposedItem.type === 'service') {
      window.open(exposedItem.runURL, '_blank');
    } else {
      if (!this.state.inProgress) { // prevents multiple instances when doubleclicking on a link
        this.setState({ inProgress: true });
        this.props.exposedItemActions.start(this.props.user, exposedItem.startURL)
          .then(() => {
            this.setState({ inProgress: false });
            toastr.success(`Instance started -<br/>${this.props.startedExposedItem.name}`);
            this.handleViewInstanceSelection(this.props.startedExposedItem.piid);
          })
          .catch(error => {
            this.setState({ inProgress: false });
            toastr.error(error);
          });
      }
    }
  }

  handleViewInstanceSelection(processInstanceId, event) {
    if (event) {
      event.preventDefault();
    }
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

  render() {
    return (
      <Container fluid={true} className="tasks-page">
        <Row>
          <Col md={9}>
            <SearchForm
              inputRef={el => this.searchFormInput = el}
              onSubmit={this.handleFormSubmit}
              onChange={this.setSearchFilter}
              searchFilter={this.state.searchFilter}
              inProgress={this.state.inProgress} />
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <ActionPicker
              className="tasks-page__action-picker"
              actions={[
                { label: 'Open Tasks', value: 'Open' },
                { label: 'Completed Tasks', value: 'Completed' }
              ]}
              pickedActionValue={this.props.taskSearchState.searchCriteria.completionStateFilter}
              handlePickedAction={this.handlePickedCompletionState}
              inProgress={this.state.inProgress} />
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <Tasks
              tasks={this.props.taskSearchState.results.items}
              handleViewInstanceSelection={this.handleViewInstanceSelection}
              inProgress={this.state.inProgress} />
            <ShowMoreItems
              length={this.props.taskSearchState.results.items.length}
              total={this.props.taskSearchState.results.total}
              handleShowMoreClick={this.handleShowMoreClick}
              inProgress={this.state.inProgress} />
          </Col>
          <Col md={3}>
            <ExposedItems
              items={this.props.exposedItems}
              handlePickedExposedItem={this.handlePickedExposedItem}
              inProgress={this.state.inProgress} />
          </Col>
        </Row>
      </Container>
    );
  }
}

TasksPage.propTypes = {
  user: PropTypes.object.isRequired,
  exposedItems: PropTypes.array.isRequired,
  taskSearchState: PropTypes.object.isRequired,
  startedExposedItem: PropTypes.object.isRequired,
  exposedItemActions: PropTypes.object.isRequired,
  taskActions: PropTypes.object.isRequired,
  pickedProcessInstanceActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user,
    exposedItems: state.exposedItems,
    taskSearchState: state.taskSearchState,
    startedExposedItem: state.startedExposedItem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    exposedItemActions: bindActionCreators(exposedItemActions, dispatch),
    taskActions: bindActionCreators(taskActions, dispatch),
    pickedProcessInstanceActions: bindActionCreators(pickedProcessInstanceActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksPage);

