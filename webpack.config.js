const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// console.log(path.resolve(__dirname)); // /Users/muyang/Desktop/learning/webpack5
const isDev = process.env.NODE_ENV !== "production";
module.exports = {
  mode: "development", // 开发模式
  devtool: false, // 是否需要生成source-map
  entry: {
    // 入口文件
    main: "./src/index.js",
  },
  output: {
    filename: "[name].js", //入口代码块文件名的生成规则
    chunkFilename: "[name].js", //非入口模块的生成规则
  },
  // 增量编译 - 不管是首次还是文件变更后，速度都快了很多
  watch:true,
  // 持久化缓存
  cache: {
    // 两个选项
    // 1. memory - 内存 filesystem，硬盘 默认是 memory，因为比较快，filesystem，硬盘慢一点，但是可以持久化
    // 2. 如果 type 为 filesystem 不推荐使用cnpm，可能会有冲突
    type: "filesystem",
    // 缓存目录 可以配置也可以不配置，默认值是这个
    cacheDirectory: path.resolve(__dirname, "node_modules/.cache/webpack"),
  },
  optimization: {
    usedExports: true, //标注使用到的导出
    moduleIds: "named", //模块名称的生成规则 named 包含路径信息
    chunkIds: "named", //代码块名称的生成规则
    // 模块名不变，打包出来的hash不变 deterministic实现一个长期缓存
  },
  resolve: {
    // 配置三个备份，如果需要polyfill，不需要，配置false即可
    /* fallback:{
            'crypto':require.resolve('crypto-browserify'),
            'stream':require.resolve('stream-browserify'),
            'buffer':require.resolve('buffer')
        }, */
    // 备胎回退
    fallback: {
      crypto: false,
      stream: false,
      buffer: false,
    },
  },
  devServer: {
    // 启动配置
    port: 8080,
  },
  module: {
    // 模块定义
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, //不打包 不编译node_modules下面的文件
        use: [
          {
            loader: "babel-loader",
            options: {
              // @babel/preset-env -> es6->es5
              // @babel/preset-react -> 转化jsx
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.png$/,
        type: "asset/resource", //对标file-loader
      },
      {
        test: /\.ico$/,
        type: "asset/inline", //对标url-loader 模块的大小<limit base64字符串
      },
      {
        test: /\.txt$/,
        type: "asset/source", //对标raw-loader
      },
      {
        test: /\.jpg$/,
        type: "asset", //对标raw-loader
        parser: {
          // 大于最大值走resource，不然走inline(base64) // logo.jpg 8k
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
