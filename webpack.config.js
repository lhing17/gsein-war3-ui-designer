const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// 加载 .env 文件
const env = dotenv.config().parsed || {};

// 将环境变量转换为可以注入的格式
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: './src/index.js',  // 确保入口文件正确
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: 'commonjs' }],
              ['@babel/preset-react', { runtime: 'automatic', development: process.env.NODE_ENV === 'development' }]
            ]
          }
        }
      },
      // 添加 CSS 处理规则
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer-browserify"),
      "assert": require.resolve("assert-browserify"),
      "vm": require.resolve("vm-browserify"),
      "process": require.resolve("process/browser"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  // 使用您的 HTML 模板
      filename: 'index.html',
      inject: true  // 自动注入打包后的 JS 文件
    }),
    // 添加 DefinePlugin 来注入环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      ...envKeys
    }),
    // 提供 process 和 Buffer 的 polyfill
    new webpack.ProvidePlugin({
      process: require.resolve('process/browser'),
      Buffer: ['buffer', 'Buffer']
    }),
    // 添加一个空的 browser 对象，解决 browser is not defined 错误
    new webpack.DefinePlugin({
      'browser': '{}'  // 定义一个空对象作为 browser
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      serveIndex: false // 禁用目录浏览
    },
    port: 8080,
    open: true,
    hot: true,
    setupMiddlewares: (middlewares, devServer) => {
      // 添加错误处理中间件
      middlewares.unshift((req, res, next) => {
        try {
          next();
        } catch (error) {
          if (error instanceof URIError) {
            console.error('URIError caught:', error.message);
            res.statusCode = 400;
            res.end('Bad Request: Invalid URL encoding');
          } else {
            next(error);
          }
        }
      });
      return middlewares;
    }
  }
};