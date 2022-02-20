const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    index: path.join(__dirname, 'src/entries/dev.tsx'),
    popup: path.join(__dirname, 'src/entries/extension.tsx'),
    eventPage: path.join(__dirname, 'src/eventPage.ts'),
  },
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    hot: true,
    port: 3000,
    static: {
      directory: 'public',
    },
    open: true,
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: process.env.WEBPACK_SERVE ? 'fonts' : 'js/fonts',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/',
              publicPath: 'assets',
            },
          },
        ],
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // Creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // Translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // Compiles Sass to CSS
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [`${__dirname}/src/global.scss`],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        DEV_ACCOUNT_ID: JSON.stringify(process.env.DEV_ACCOUNT_ID),
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: path.join(__dirname, 'dist'),
          // toType: 'file',
        },
      ],
    }),
  ],
}
