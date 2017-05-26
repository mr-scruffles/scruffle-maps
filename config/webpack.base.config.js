/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const PATHDIR = require('./paths');
const env = require('./env');

module.exports = {
  context: PATHDIR.SRC,
  entry: {
    app: './App.jsx',
  },
  output: {
    path: PATHDIR.DIST,
    filename: '[name].bundle.[chunkHash].js',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx$|\.js$/,
        include: PATHDIR.SRC,
        loader: 'eslint-loader',
      },
      {
        test: /\.css$|\.map$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
            },
          }],
        }),
      },
      {
        test: /.jsx?$/,
        include: PATHDIR.SRC,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(eot|ttf|svg|gif|png)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(env),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
    new CleanWebpackPlugin(['dist'], {
      root: PATHDIR.ROOT,
      verbose: true,
    }),
    new ExtractTextPlugin({ filename: '[name].[contentHash].css' }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Tether: 'tether',
    }),
  ],
};
