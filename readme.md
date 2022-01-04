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