# 优化打包构建速度

开发体验和效率提升

### 优化babel-loader

* `use`属性添加`?cacheDirectory`参数——开启缓存

* 指明`include`和`exclude`——指明范围

* **对未改变的代码段不再进行重新编译**

  ```jsx
  module: {
          rules: [
              {
                  test: /\.js$/,
                  loader: ['babel-loader?cacheDirectory'],
                  include: srcPath,
                  exclude: /node_modules/
              }
          ]
      },
  ```

  

### IgnorePlugin（忽略一些）



### noParse（不去管理哪些？）

### happyPack（多进程打包）

1.  JS是单线程的，但是可以开启多个进程进行打包

2.  提高构建速度（特别是多核CPU）

* 在`webpack.prod.js`中引入`const HappyPack = require('happypack')`

* 在`webpack.prod.js`的`rules`中添加`loader`

  ```jsx
  {
                  test: /\.js$/,
                  // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
                  use: ['happypack/loader?id=babel'],
                  include: srcPath,
                  // exclude: /node_modules/
              },
  ```

* 在`webpack.prod.js`的`Plugin`中添加`new HappyPack`

  ```jsx
  new HappyPack({
              // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
              id: 'babel',
              // 如何处理 .js 文件，用法和 Loader 配置中一样
              loaders: ['babel-loader?cacheDirectory']
          }),
  ```

  

### ParallelUglifyPlugin(多进程代码压缩)

* webpack内置Uglify工具压缩JS
* 本质上还是使用`UglifyJS`，只是帮助开启了多线程
* JS单线程，开启多进程啊压缩更快
* 和`happyPack`同理

使用

***

* 在`webpack.prod.js`中直接`new ParallelUglifyPlugin()`

  ```js
  new ParallelUglifyPlugin({
              // 传递给 UglifyJS 的参数
              // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
              uglifyJS: {
                  output: {
                      beautify: false, // 最紧凑的输出
                      comments: false, // 删除所有的注释
                  },
                  compress: {
                      // 删除所有的 `console` 语句，可以兼容ie浏览器
                      drop_console: true,
                      // 内嵌定义了但是只用到一次的变量
                      collapse_vars: true,
                      // 提取出出现多次但是没有定义成变量去引用的静态值
                      reduce_vars: true,
                  }
              }
          })
  ```

  

### 自动刷新

### 热更新

### DllPlugin

对于第三方库，不用每次跟新代码，编译时都重新打包，提前打包好，以后直接引用

# 优化产出代码

**提升产品性能**

# 关于开启多进程

* 项目较大，打包较慢，开启多进程能提高速度
* 项目较小，打包较快，开启多进程会由于**继承开销**，降低速度
* 加快或是减慢速度是相对的

