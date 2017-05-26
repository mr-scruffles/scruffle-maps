const _ = require('lodash');
const path = require('path');
const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV || 'development';

// Load global env vars.
const globalDotEnv = dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
  silent: true,
});

// Load node env specific vars.
const envDotEnv = dotenv.config({
  path: path.resolve(__dirname, `${NODE_ENV}.config.env`),
  silent: true,
});

// Combine global and node env vars.
const allVars = _.assign({ NODE_ENV }, globalDotEnv.parsed, envDotEnv.parsed);

// Create initial configuration for webpack.DefinePlugin.
const initialConfig = _.reduce(_.keys(allVars), (env, key) => {
  // eslint-disable-next-line
  env[`process.env.${key.toUpperCase()}`] = JSON.stringify(allVars[key]);
  return env;
}, {});

// Add any specific node env that start with 'REACT_APP_' set via command line.
const filteredReactVars = _.filter(_.keys(process.env), key => /^REACT_APP_/i.test(key));
const config = _.reduce(filteredReactVars, (env, key) => {
  // eslint-disable-next-line
  env[`process.env.${key}`] = JSON.stringify(process.env[key]);
  return env;
}, initialConfig);

module.exports = config;
