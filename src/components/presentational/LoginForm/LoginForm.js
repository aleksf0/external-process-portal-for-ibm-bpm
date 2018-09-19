import React from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ inputRef, onSubmit, onChange, user, inProgress }) => {
  return (
    <form className="login-form">
      <div className="form-group">
        <label>Username:</label>
        <input
          ref={inputRef}
          name="username"
          type="text"
          className="form-control"
          value={user.username}
          onChange={onChange}
          tabIndex={1} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          name="password"
          type="password"
          className="form-control"
          value={user.password}
          onChange={onChange}
          tabIndex={2} />
      </div>
      <input
        type="submit"
        disabled={inProgress}
        value={inProgress ? 'Authenticating...' : 'Login'}
        className="btn btn-default"
        onClick={onSubmit}
        tabIndex={3} />
    </form>
  );
};

LoginForm.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  user: PropTypes.object,
  inProgress: PropTypes.bool
};

export default LoginForm;
