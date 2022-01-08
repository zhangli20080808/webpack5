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
 
