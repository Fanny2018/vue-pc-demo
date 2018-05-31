const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const cssConfig = require('./css-config.json');
const cssTest = require('./css-test');

const globalConfig = require('../global.config');
const appPath = globalConfig.appPath;
const isProduction = process.env.NODE_ENV === 'production';
const publicPaths = [path.resolve(appPath, 'assets'), path.resolve(appPath, '../node_modules')];

module.exports = {
  entry: {
    vendor: ['vue', 'vue-router'],
    app: path.resolve(appPath, 'app.js')
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve('src')
    }
  },
  module: {
    rules: [{
      test: /\.(vue|ts)$/,
      enforce: 'pre',
      include: [path.resolve('src')],
      use: [{
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }],
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      use: ['vue-loader']
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [path.resolve('src')]
    }, {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: appPath
    }, {
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join(globalConfig.staticPublicPath, `img/[name]${isProduction ? '.[hash]' : ''}.[ext]`)
        }
      }]
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join(globalConfig.staticPublicPath, `fonts/[name]${isProduction ? '.[hash]' : ''}.[ext]`)
        }
      }]
    }, {
      test: cssTest(cssConfig.language),
      include: publicPaths,
      use: ExtractTextPlugin.extract({
        fallback: 'vue-style-loader',
        use: ['css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins () {
              return [require('autoprefixer')];
            }
          }
        }, cssConfig.language + '-loader']
      })
    }, {
      test: cssTest(cssConfig.language),
      exclude: publicPaths,
      use: ['vue-style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
          plugins () {
            return [require('autoprefixer')];
          }
        }
      }, cssConfig.language + '-loader']
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(appPath, 'index.html')
      // favicon: path.resolve(appPath, 'assets/images/favicon.ico')
    })
  ]
};
