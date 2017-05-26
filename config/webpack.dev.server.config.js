/* eslint-disable import/no-extraneous-dependencies */
const DashboardPlugin = require('webpack-dashboard/plugin');

const PATHDIR = require('./paths');

module.exports = {
  devServer: {
    contentBase: [PATHDIR.DIST],
    compress: true,
    port: 3000,
    inline: true,
    open: false,
    historyApiFallback: true,
  },
  plugins: [
    new DashboardPlugin(),
  ],
};
