// Require our stuff
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// Our base configuration
const base = require('./webpack.base.config');

// Build path (dist folder)
const buildPath = path.resolve(__dirname, './dist');

// We merge the base configration with this one
const renderer = merge(base, {

  // Src file
  entry: './src/renderer.js',

  // Output file (dist/renderer.js)
  output: {
    filename: 'renderer.js',
    path: buildPath,
  },

  // We are using style, css and sass loader for our stylesheet
  // Using babel-loader and excluding the node_modules folder for the main.js file
  module: {
    rules: [
      {
        // SCSS -> CSS
        test: /(\.s[ac]ss$|\.css$)/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },

      { // Our babel loader (we are exclude node_modules except for @continuata directory)
        test: /\.js$/,
        exclude: /node_modules\/(?!@kaizokupuffball\/).*/,
        use: {
          loader: 'babel-loader',
          options: { 
            presets: ['@babel/preset-env'],
            plugins:['@babel/plugin-proposal-class-properties']
          }
        }
      },
    ],
  }, 

  // Optimizations
  optimization: {
    minimize: false
  },

  // Plugins
  plugins: [

    // Use HtmlWebpackPlugin to inject JS into
    // our HTML file
    new HtmlWebpackPlugin({
      template: './src/index.html',
      publicPath: '',
      inject: 'body'
    }),

    // Copy the unrar.exe file to the buildpath
    new CopyPlugin({
      patterns: [
        { 
          from: './bin/win32/unrar.exe',
          to: buildPath 
        }, 
        {
          from: './src/assets/readme.md',
          to: buildPath
        }, {
          from: './src/assets/icons',
          to: path.join(buildPath, '/icons')
        },
        {
          from: './src/assets/icon.ico',
          to: buildPath
        }
      ],
    })

  ],

  // Target
  target: 'electron-renderer',

});

module.exports = renderer;