const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');

const moduleName = process.env.MODULE_NAME;

const plugins = [
  new AssetsPlugin({
    filename: 'assets.json',
    fullPath: false,
    path: '../assets',
  })
];

const output = {
  library: 'module_' + moduleName.replace('-', '_') + '_[name]',
  path: '/assets',
  publicPath: '/assets/',
  filename: '[name].js'
};

let babelPresets = [
  'babel-preset-stage-2'
];

if (process.env.HASH_NAMES === '1') {
  output.filename = '[name].[hash].js';
}

if (process.env.NODE_ENV === 'production') {
  babelPresets = [
    'babel-preset-es2015',
    'babel-preset-stage-2'
  ];

  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      mangle: {
        keep_fnames: true
      }
    })
  );
}

const path = require('path');
const fs = require('fs');

const possibleEntries = {
  'app': './src/app.js',
  'pages': './src/pages.js',
  'marketplace': './src/marketplace.js',
};

const entry = {};
Object.keys(possibleEntries).forEach(k => {
  if (fs.existsSync(path.resolve(possibleEntries[k]))) {
    entry[k] = possibleEntries[k];
  }
});

module.exports = {
  entry,
  resolve: {
    extensions: [ '.js', '.vue', '.less' ]
  },
  // externals: {
  //   'vue': 'Vue',
  // },
  output,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules\/core-js/,
          /node_modules\/babel-/,
          /node_modules\/underscore/,
          /node_modules\/vue-inputmask/,
          /node_modules\/@platrum/,
        ],
        query: {
          babelrc: false,
          comments: false,
          presets: babelPresets
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
          name: 'font/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'js': 'babel-loader?babelrc=false&' + babelPresets.map(preset => 'presets[]=' + preset)
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: 'img/[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins
};
