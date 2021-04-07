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


### noParse（不去解析哪些依赖？）

`noParse` 。在引入一些第三方模块时（如jq)，我们知道他肯定不会引用其他的依赖模块。所以不需要webpack花费时间去解析他的内部依赖

启用noParse：

```js
  module: {
    // 不去解析jquery的依赖关系
    noParse: /jquery/
  },
```

### IgnorePlugin（忽略一些）

`IgnorePlugin`。在引入一些第三方模块时，例如momentJS、dayJS，会有很多语言包，会占用很多空间，**所以可以忽略所有语言包**，然后再按需引入，使构建效率更高

`ignorePlugin`启用方法：

```js
// 用法：
new webpack.IgnorePlugin(requestRegExp, [contextRegExp]);

//eg.
plugins: [new webpack.IgnorePlugin(/\.\/local/, /moment/)];
```

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


## 只能开发环境下配置

### 自动刷新

* 启动`webpack-dev-server`服务后，添加字段`watch: true`

* 自动刷新（watch）：整个网页全部刷新，速度较慢
* 自动刷新：整个网页全部刷新，状态会丢失

### 热更新

#### 热更新原理

> **大概流程是我们用webpack-dev-server启动一个服务之后，浏览器和服务端是通过websocket进行长连接，**
>
> **webpack内部实现的watch就会监听文件修改，只要有修改就webpack会重新打包编译到内存中，然后webpack-dev-server依赖中间件webpack-dev-middleware和webpack之间进行交互，**
>
> **每次热更新都会请求一个携带hash值的json文件和一个js，websocket传递的也是hash值，内部机制通过hash值检查进行热更新，如果这些模块无法更新，则会刷新页面 至于内部原理，因为水平限制，目前还看不懂。**

**模块热替换**(HMR - Hot Module Replacement)功能会**在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。**主要是通过以下几种方式，来显著加快开发速度：

- 保留在完全重新加载页面时**丢失的应用程序状态。**
- **只更新变更内容，**以节省宝贵的开发时间。
- 调整样式更加快速 - **几乎相当于在浏览器调试器中更改样式**

* 使用

  1. 在`webpack.dev.js`下导入

     `const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');`

  2. 在`devServer`下增加`hot: true`字段

  3. `dev`环境下，入口文件另外增加两个字段

     ```js
     entry: {
             // index: path.join(srcPath, 'index.js'),
             index: [
                 'webpack-dev-server/client?http://localhost:8080/',
                 'webpack/hot/dev-server',
                 path.join(srcPath, 'index.js')
             ],
             other: path.join(srcPath, 'other.js')
         },
     ```

  4. 新建`plugin`

     `new HotModuleReplacementPlugin()`

* 修改CSS自动更新，无需刷新页面

* 修改CSS模块，需要监听对应的模块的修改了？，然乎执行响应的回调

  ```js
   // 增加，开启热更新之后的代码逻辑
  if (module.hot) {
       module.hot.accept(['./math'], () => {
          const sumRes = sum(10, 30)
          console.log('sumRes in hot', sumRes)
     })
  }
  ```

  

### DllPlugin

对于第三方动态库，不用每次更新代码，编译时都重新打包，提前打包好，**以后直接引用**

* DllPlugin		打包出dll文件
* DllReferencePlugin        多次引用dll文件
* 利用`DllPlugin`和`DllReferencePlugin`预编译资源模块 通过`DllPlugin`来对那些我们引用但是绝对不会修改的npm包来进行预编译，再通过`DllReferencePlugin`将预编译的模块加载进来。

# 优化产出代码

**提升产品性能**

* 体积更小
* 合理分包，不重复加载
* 速度更快，内存使用更少

### 小图片base64编码

* 设置`options`的`limit`字段，对于小于5kb的图片使用base64编码存储，减少了一次http请求

  ```js
  {
                  test: /\.(png|jpg|jpeg|gif)$/,
                  use: {
                      loader: 'url-loader',
                      options: {
                          // 小于 5kb 的图片用 base64 格式产出
                          // 否则，依然延用 file-loader 的形式，产出 url 格式
                          limit: 5 * 1024,
  
                          // 打包到 img 目录下
                          outputPath: '/img1/',
  
                          // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
                          // publicPath: 'http://cdn.abc.com'
                      }
                  }
              },
  ```

  

### bundle加hash值

* 打包出来的JS文件，因为多入口的原因使用`[contentHash:8]`,代码变了，重新编译，hash值会变，缓存失效请求新的文件，**没改变则能命中缓存**

### 懒加载

* 使用定时器和`impot`

  ```js
  setTimeout(() => {
  	import('./dynamic-data.js').then((res) => {
  		console.log(res.default.message)  //注意可以使用defailt拿数据
  	})
  }, 1500)
  
  //danamic.js
  export default {
      message: 'this is dynamic data'
  }
  ```


### `splitChunks`Plugin抽离公共模块

**在线上环境配置下**，第三方模块或公共模块被单独打包

```js
`index.js`可以看成一个`chunk`，里面引用了许多js,

抽离公共代码（`splitChunksPlugin`），指从`index`入口文件这个`chunk`中抽离出符合条件的js文件重新组成一个`chunk`，然后在`new HtmlWebpackPlugin`中配置`chunks`属性，页面可以按需加载`chunk`
```

* 公共的模块
* 第三方模块

**防止多个入口文件引用了相同模块后，多次加载这个相同模块**，

**防止改业务代码后，hash值改变，再次去引入第三方模块**

* 导入

  ```js
  const TerserJSPlugin = require('terser-webpack-plugin')
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
  ```

* 使用（添加`optimization`属性，属性下的`splitChunks`对象）

  ```js
  optimization: {
          // 压缩 css
          minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  
          // 分割代码块
          splitChunks: {
              chunks: 'all',
              /**
               * initial 入口 chunk，对于异步导入的文件不处理
                  async 异步 chunk，只对异步导入的文件处理
                  all 全部 chunk
               */
  
              // 缓存分组
              cacheGroups: {
                  // 第三方模块
                  vendor: {
                      name: 'vendor', // chunk 名称
                      priority: 1, // 权限更高，优先抽离，重要！！！
                      test: /node_modules/,
                      minSize: 0,  // 大小限制
                      minChunks: 1  // 最少复用过几次,才会被独立打包
                  },
  
                  // 公共的模块
                  common: {
                      name: 'common', // chunk 名称
                      priority: 0, // 优先级
                      minSize: 0,  // 公共模块的大小限制
                      minChunks: 2  // 公共模块最少复用过几次
                  }
              }
          }
      }
  ```

### `IgnorePlugin`

### 使用CDN加速

* 修改`output`，修改所有静态文件url的前缀（JS）

![image-20210402135437579](C:\Users\DELL\AppData\Roaming\Typora\typora-user-images\image-20210402135437579.png)

* 将打包好的静态资源文件上传到CDN服务器上

* 也可以对图片进行CDN加速(添加`publicPath`属性)

  ![image-20210402135716693](C:\Users\DELL\AppData\Roaming\Typora\typora-user-images\image-20210402135716693.png)

# 关于开启多进程

* 项目较大，打包较慢，开启多进程能提高速度
* 项目较小，打包较快，开启多进程会由于**继承开销**，降低速度
* 加快或是减慢速度是相对的

