import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import actionToggleAuthorized from './redux/actions/login';
import AuthService from '../utils/AuthService';

class LoginControl extends React.Component {

  static propTypes = {
    auth: T.instanceOf(AuthService).isRequired,
    dispatch: T.func.isRequired,
    isAuthorized: T.bool.isRequired,
  }

  static contextTypes = {
    router: T.object,
  }

  constructor(props) {
    super(props);
    this.props.auth.on('user_authenticated', this.handleAuthenticationState.bind(this));
  }

  handleAuthenticationState() {
    this.props.dispatch(actionToggleAuthorized(AuthService.loggedIn()));
  }

  handleClick() {
    if (!AuthService.loggedIn()) {
      this.props.auth.login();
    } else {
      AuthService.logout();
      this.context.router.push('/placeholder');
      this.props.dispatch(actionToggleAuthorized(AuthService.loggedIn()));
    }
  }

  render() {
    const isAuthorized = this.props.isAuthorized;
    const config = {
      content: isAuthorized ? ' Logout' : ' Login',
      icon: isAuthorized ? 'fa fa-sign-out' : 'fa fa-sign-in',
      buttonStyle: isAuthorized ? 'btn btn-danger' : 'btn btn-success',
    };
    return (
      <button
        className={config.buttonStyle}
        onClick={e => this.handleClick(e)}
        id="myButton" data-loading-text="Loading..."
        ref={(elem) => { this.button = elem; }}
      >
        <i className={config.icon} />
        <span> {config.content}</span>
      </button>);
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorized,
});

export default connect(mapStateToProps)(LoginControl);
