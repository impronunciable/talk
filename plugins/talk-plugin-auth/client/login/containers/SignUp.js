import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSignUp } from 'coral-framework/hocs';
import { compose } from 'recompose';
import SignUp from '../components/SignUp';
import { connect } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import * as views from '../enums/views';
import { setView, setEmail, setPassword } from '../actions';
import t from 'coral-framework/services/i18n';

class SignUpContainer extends Component {
  state = {
    username: '',
    passwordRepeat: '',
    usernameError: '',
    emailError: '',
    passwordError: '',
    passwordRepeatError: '',
  };

  validate = data => {
    let valid = true;
    const changes = {};
    Object.keys(data).forEach(name => {
      const error = this.props.validate(name, data[name]);
      if (error) {
        valid = false;
      }
      changes[`${name}Error`] = error;
    });

    if (data.password !== data.passwordRepeat) {
      changes['passwordRepeatError'] = t('sign_in.passwords_dont_match');
      valid = false;
    }

    this.setState(changes);
    return valid;
  };

  handleSubmit = () => {
    const data = {
      username: this.state.username,
      email: this.props.email,
      password: this.props.password,
      passwordRepeat: this.state.passwordRepeat,
    };

    if (this.validate(data)) {
      this.props.signUp(data);
    }
  };

  setUsername = username => this.setState({ username });
  setPasswordRepeat = passwordRepeat => this.setState({ passwordRepeat });

  handleForgotPasswordLink = () => {
    this.props.setView(views.FORGOT_PASSWORD);
  };

  handleSignInLink = () => {
    this.props.setView(views.SIGN_IN);
  };

  render() {
    return (
      <SignUp
        onSubmit={this.handleSubmit}
        onUsernameChange={this.setUsername}
        onEmailChange={this.props.setEmail}
        onPasswordChange={this.props.setPassword}
        onPasswordRepeatChange={this.setPasswordRepeat}
        onForgotPasswordLink={this.handleForgotPasswordLink}
        onSignInLink={this.handleSignInLink}
        username={this.state.username}
        email={this.props.email}
        password={this.props.password}
        passwordRepeat={this.state.passwordRepeat}
        errorMessage={this.props.errorMessage}
        onRecaptchaVerify={this.handleRecaptchaVerify}
        requireEmailConfirmation={this.props.requireEmailConfirmation}
        loading={this.props.loading}
        success={this.props.success}
        usernameError={this.state.usernameError}
        emailError={this.state.emailError}
        passwordError={this.state.passwordError}
        passwordRepeatError={this.state.passwordRepeatError}
      />
    );
  }
}

SignUpContainer.propTypes = {
  setView: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  requireEmailConfirmation: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  validate: PropTypes.func.isRequired,
};

const mapStateToProps = ({ talkPluginAuth: state }) => ({
  email: state.email,
  password: state.password,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setView,
      setEmail,
      setPassword,
    },
    dispatch
  );

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSignUp
)(SignUpContainer);
