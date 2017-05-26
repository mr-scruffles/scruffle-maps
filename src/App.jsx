import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'tether/dist/js/tether';
import 'bootstrap/dist/js/bootstrap';

import makeRoutes from './Routes';

const App = () => <div>{makeRoutes()}</div>;

ReactDOM.render(<App />, document.getElementById('app'));
