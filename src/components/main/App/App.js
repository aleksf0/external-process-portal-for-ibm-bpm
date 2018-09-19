// This component handles the App template used on every page.
import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import PageHeader from '../../presentational/common/PageHeader';
import { connect } from 'react-redux';
import LoadingBar, { resetLoading } from 'react-redux-loading-bar';

class App extends React.Component {

  componentWillMount() {
    this.props.resetLoading();
  }

  render() {
    return (
      <div>
        <LoadingBar updateTime={100} progressIncrease={3} showFastActions style={{ backgroundColor: '#0086b3', height: '2px', position: 'fixed', zIndex: 999999 }} />
        <div className="container-fluid">
          <PageHeader user={this.props.user} inProgress={this.props.inProgress} />
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  user: PropTypes.object,
  inProgress: PropTypes.bool.isRequired,
  resetLoading: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user,
    inProgress: state.ajaxCallsInProgress == 0 ? false : true
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetLoading: bindActionCreators(resetLoading, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
