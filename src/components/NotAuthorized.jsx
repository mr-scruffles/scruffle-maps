import React from 'react';

const NotAuthorized = () =>
  (
    <div className="jumbotron jumbotron-fluid" data-test="not-authorized">
      <div className="container">
        <h1 className="display-3">Please Log In</h1>
        <p className="lead">You are not authorized to access this reasource, please login.</p>
      </div>
    </div>
  );

export default NotAuthorized;
