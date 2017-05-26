import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router';
import Login from './Login';

const Navbar = props =>
  (
    <nav className="navbar navbar-toggleable-md navbar-light bg-faded navbar-fixed-top">
      <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav1">
        <span className="navbar-toggler-icon" />
      </button>
      <a className="navbar-brand" href="">Scruffle Maps</a>
      <div className="collapse navbar-collapse" id="navbarNav1">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/map">Map</Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Login auth={props.auth} />
          </li>
        </ul>
      </div>
    </nav>
  );

Navbar.propTypes = { auth: T.object.isRequired };

export default Navbar;
