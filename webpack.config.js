const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    main: './src/index.js',
  },
  optimization: {
    usedExports: true, //标使用到的导出
    moduleIds: 'named', //模块名称的生成规则
    chunkIds: 'named', //代码块名称的生成规则
    // 模块名不变，打包出来的hash不变 deterministic实现一个长期缓存
  },
  resolve: {
    /* fallback:{
            'crypto':require.resolve('crypto-browserify'),
            'stream':require.resolve('stream-browserify'),
            'buffer':require.resolve('buffer')
        }, */
    fallback: {
      crypto: false,
      stream: false,
      buffer: false,
    },
  },
  output: {
    filename: '[name].js', //入口代码块文件名的生成规则
    chunkFilename: '[name].js', //非入口模块的生成规则
  },
  // 增量编译
  // watch:true,
  // 持久化缓存
  cache: {
    // 两个选项
    // memory - 内存，filesystem，硬盘 默认是 memory，因为比较快，filesystem，硬盘慢一点，但是可以持久化
    // 如果 type 为 filesystem 不推荐使用cnpm，可能会有冲突
    type: 'filesystem',
    // 缓存目录 可以配置也可以不配置，默认值是这个
    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
  },
  devServer: {
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, //不打包 不编译node_modules下面的文件
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
      {
        test: /\.png$/,
        type: 'asset/resource', //对标file-loader
      },
      {
        test: /\.ico$/,
        type: 'asset/inline', //对标url-loader 模块的大小<limit base64字符串
      },
      {
        test: /\.txt$/,
        type: 'asset/source', //对标raw-loader
      },
      {
        test: /\.jpg$/,
        type: 'asset', //对标raw-loader
        parser: {
          // 大于最大值走resource，不然走inline
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
