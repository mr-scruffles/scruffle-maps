import React from 'react';
import { PropTypes as T } from 'prop-types';
import Navbar from './components/Navbar';

const Layout = (props) => {
  let children = null;
  if (props.children) {
    children = React.cloneElement(props.children, {
      auth: props.route.auth, // sends auth instance from route to children
    });
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm">
          <Navbar auth={props.route.auth} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <hr className="my-4" />
          {children}
        </div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: T.element.isRequired,
  route: T.shape({
    auth: T.object.isRequired },
  ).isRequired,
};

export default Layout;
