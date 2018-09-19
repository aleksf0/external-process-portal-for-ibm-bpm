import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../../../actions/userActions';
import { browserHistory } from 'react-router';
import { purgeStoredState } from 'redux-persist';
import { asyncLocalStorage } from 'redux-persist/storages';

class LogoutPage extends React.Component {

  componentWillMount() {
    purgeStoredState({ storage: asyncLocalStorage }).then(() => {
      this.props.actions.logout();
      browserHistory.push('/');
    });
  }

  render() {
    return null;
  }

}

LogoutPage.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(LogoutPage);


