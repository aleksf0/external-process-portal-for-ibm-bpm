import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as userActions from '../../../actions/userActions';
import LoginForm from '../../presentational/LoginForm';
import toastr from 'toastr';

class LoginPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      user: {
        username: '',
        password: '',
        isAuthenticated: false
      },
      inProgress: false
    };

    this.login = this.login.bind(this);
    this.updateUserState = this.updateUserState.bind(this);
  }

  componentDidMount() {
    this.loginFormUsernameInput.focus();
  }

  login(event) {
    event.preventDefault();
    this.setState({ inProgress: true });
    this.props.actions.login(this.state.user)
      .then(() => {
        this.setState({ inProgress: false });
        browserHistory.push('/tasks');
      })
      .catch(error => {
        this.setState({ inProgress: false });
        toastr.error(error);
        this.loginFormUsernameInput.focus();
        this.loginFormUsernameInput.select();
      });
  }

  updateUserState(event) {
    const field = event.target.name;
    const user = Object.assign({}, this.state.user);
    user[field] = event.target.value;
    this.setState({ user });
  }

  render() {
    return (
      <LoginForm
        inputRef={el => this.loginFormUsernameInput = el}
        user={this.state.user}
        onSubmit={this.login}
        onChange={this.updateUserState}
        inProgress={this.state.inProgress} />
    );
  }
}

LoginPage.propTypes = {
  user: PropTypes.object,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user.isRequired
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
