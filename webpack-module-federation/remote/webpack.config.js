let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    publicPath: 'http://localhost:8082/',
  },
  devServer: {
    port: 8082,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    //
    new ModuleFederationPlugin({
      name: 'remoteApp', // remote向外暴露的全局变量名
      //构建出来的文件名，名字随便写，其实就是容器向外暴露的时候会提供一个文件，名字就是remoteEntry
      filename: 'remoteEntry.js', 
      // 可以暴露多个组件
      exposes: {
        './NewsList': './src/NewsList',
      },
      remotes: {
        hostApp: 'hostApp@http://localhost:8081/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
};
