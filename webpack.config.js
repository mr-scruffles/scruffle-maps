/* eslint-disable global-require */
const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;
let webpackConfig;

switch (TARGET) {
  case 'build:dev':
    webpackConfig = require('./config/webpack.dev.config.js');
    break;
  case 'server:dev':
    webpackConfig = merge.smart(require('./config/webpack.dev.config.js'), require('./config/webpack.dev.server.config.js'));
    break;
  case 'build:prod':
    webpackConfig = require('./config/webpack.prod.config.js');
    break;
  default:
    break;
}

const config = merge.smart(require('./config/webpack.base.config.js'), webpackConfig);

module.exports = config;
