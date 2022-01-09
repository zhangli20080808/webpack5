## 重点更新
1. 持久化缓存
2. tree-shaking
3. 模块联邦

### 持久化缓存 - 通过设置cache
1. webpack会缓存生成webpack模块和chunk，并改善构建速度 - node_modules/.cache
之前我们会通过babel-loader设置缓存，5中内置
2. webpack5中默认开启，缓存默认是在内存里，但可以对cache进行设置
3. webpack追踪每个模块的依赖，并创建文件系统快照，次快照会与真实文件系统进行比较，当检测到差异时，会触发
对应模块的重新构建
快照可以理解为对打包后的文件拍个照片

### 资源模块
1. raw-loader - asset/source 导出资源的源代码
2. file-loader - asset/resource 发送一个单独的文件并导出 url
3. url-loader - asset/inline 导出一个资源的 data url

5不需要以上三个loader

asset在导出一个资源的 data url和发送一个单独的文件并导出 url之间自动选择，之前通过使用url-loader，
并且配置资源体积限制实现
4. Rule.type
5. asset-modules

### URIs
1.webpack5支持在请求中处理协议
```js
import data from 'data:text/javascript,export default "title"'
console.log(data) // title
```
### chunk优化
### 移除nodejs的polyfill
1. webpack4中带了需要nodejs核心模块，一旦模块中使用了其他核心模块crypto，这些模块就会被自动启用，被打包进来
2. webpack5中不再自动引入这些polyfill
### 更强大的tree-shaking
1. tree-shaking就是在打包的时候剔除无用的代码
2. webpack4本身的tree-shaking是比较简单的，主要是找一个import进来的变量是否在这么模块内出现过
3. webpack5可以进行根据作用域之间的关系进行优化
```js
// 打包的时候会自动剔除 
// index.js
import { function1 } from './module1';
console.log(function1)
// module1.js
import { function3 } from './module2';
export function function1() {
  console.log('function1');
}
export function function2() {
  console.log('function2' + function3);
}
// module2.js
export function function3(){
    console.log('function3');
}
export function function4(){
    console.log('function4');
}
```
### sideEffects -package.json配置
1. 函数副作用指 调用函数时，除了返回函数值之外，还产生了附加的影响，例如修改全局变量
2. 严格的函数式语言要求函数必须无副作用
3. css文件也可以进行配置，要不要走tree-shaking
```js
// index.js
import './title.js'
import './index.css'
// title.js
document.title = 'zl'
export function getTitle(){
  // 
}
// package.json 留下css，打包之后，干掉title
sideEffects:["*.css"]
```
### 模块联邦

1. remote
```js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// 配置参数
name - string - 必传，模块的输出名，被换成引用时，路径为${name}/&{export}
library - object  - 声明全局变量的方式，name为umd的name
filename - string - 构建输出的文件名
remotes - object - 远程引用的应用名极其别名的映射，使用时以key值作为name
exposes - object - 被远程引用时可暴露的资源路径以及别名
shared - object - 与其他应用可共享的第三方依赖，使你的代码不用重复加载同一份依赖


// remote webpack.config.js
new ModuleFederationPlugin({
  name: 'remoteVar', // remote向外暴露的全局变量名
  //构建出来的文件名，名字随便写，其实就是容器向外暴露的时候会提供一个文件，名字就是remoteEntry
  filename: 'remoteEntry.js', 
  // 可以暴露多个组件
  exposes: {
    './NewsList': './src/NewsList',
  },
  // remotes: {
  //   host: 'hostVar@http://localhost:8081/remoteEntry.js',
  // },
  // shared: ['react', 'react-dom'],
}),
// webpack remote 打包結果 暴露出去這個模塊
var moduleMap = {
  './NewsList': () => {
    return Promise.all([
      __webpack_require__.e('vendors-node_modules_react_index_js'),
      __webpack_require__.e('src_NewsList_js'),
    ]).then(
      () => () =>
        __webpack_require__(/*! ./src/NewsList */ './src/NewsList.js')
    );
  },
};

========
// host webpack.config.js
new ModuleFederationPlugin({
  name: 'hostVar',
  //  指向一個遠程地址  remoteVar 代表全局變量名，消費遠程的組件
  remotes: {
    remote: 'remoteVar@http://localhost:8082/remoteEntry.js',
  },
  exposes: {
    './Slides': './src/Slides',
  },
  shared: ['react', 'react-dom'],
}),

module.exports = new Promise((resolve, reject) => {
	if(typeof remoteVar !== "undefined") return resolve();
	__webpack_require__.l("http://localhost:8082/remoteEntry.js", (event) => {
		if(typeof remoteVar !== "undefined") return resolve();
		var errorType = event && (event.type === 'load' ? 'missing' : event.type);
		var realSrc = event && event.target && event.target.src;
		__webpack_error__.message = 'Loading script failed.\n(' + errorType + ': ' + realSrc + ')';
		__webpack_error__.name = 'ScriptExternalLoadError';
		__webpack_error__.type = errorType;
		__webpack_error__.request = realSrc;
		reject(__webpack_error__);
	}, "remoteVar");
}).then(() => (remoteVar));
``` 
2. shared - 共享
1. 用来避免项目出现多个公共依赖，比如当前host和remote共享react-reactDom，其实可以共享一份react，避免重复加载
2. 任何一方加载过了，另一方不需要重新加载
```js
// 比如host启动加载文件资源，如果发现这些模块属于共享模块，会把这两个模块拿出来，放入share scope当中
// 再去加载远程的 remote 提供的模块的时候，remote模块会去 share scope

当然也是可以双向依赖的，目前是host使用remote中的模块，反过来也是可以的，进行配置
```
