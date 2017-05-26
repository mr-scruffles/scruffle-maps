import { browserHistory } from 'react-router';
import { EventEmitter } from 'events';
import Auth0Lock from 'auth0-lock';
import { isTokenExpired } from './JwtHelper';

/**
* Class AuthService is responsible for authenticating, and processing the JWT
* returned from Auth0.
*/
export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super();
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: `${window.location.origin}/login`,
        responseType: 'token',
      },
    });
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this.doAuthentication.bind(this));
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this.authorizationError.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this);
  }

  doAuthentication(authResult) {
    // Saves the user token
    AuthService.setToken(authResult.idToken);
    // navigate to the home route
    browserHistory.replace('/map');
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error);
      } else {
        this.setProfile(profile);
      }
    });

    this.emit('user_authenticated');
  }

  authorizationError() {
    // Unexpected authentication error
    console.log('Authentication Error');
    this.emit('user_auth_error');
  }

  login() {
    const options = {
      allowSignUp: false,
    };
    // Call the show method to display the widget.
    this.lock.show(options);
  }

  static loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = AuthService.getToken();
    return !!token && !isTokenExpired(token);
  }

  setProfile(profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile));
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile);
  }

  static getProfile() {
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  }

  static setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
  }

  static getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  static logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}
