# 一、拆分配置和merge

* 公共配置（Common）		——webpack.common.js
* 开发环境配置（在dev中引入Common）  ——webpack.dev.js
* 生产环境配置（线上的配置,在prod中引入Common）      ——webpack.prod.js
* `path.js`存放路径

### 入口文件和输出文件分开

#### 入口文件

* **写在`webpack.common.js`中**

  ```
  //单入口
  index: path.join(srcPath, 'index.js')
  //多入口
  entry: {
  	index: path.join(srcPath, 'index.js')
  	other:path.join(srcPath, 'other.js')
  }
  ```

* **在`index.js`中引入`.css`或`.less`文件后，对应的`loader`模块就会起作用**

* `plugins`中要有`HtmlWebpackPlugin`

  ```js
  //单入口文件
  plugins: [
          new HtmlWebpackPlugin({
              template: path.join(srcPath, 'index.html'),
              filename: 'index.html'
          })
      ]
  //多入口
  plugins: [
          // 多入口 - 生成 index.html
          new HtmlWebpackPlugin({
              template: path.join(srcPath, 'index.html'),
              filename: 'index.html',
              // chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用
              chunks: ['index', 'vendor', 'common']  //要考虑代码分割，表示所引入的JS文件
          }),
          // 多入口 - 生成 other.html
          new HtmlWebpackPlugin({
              template: path.join(srcPath, 'other.html'),
              filename: 'other.html',
              chunks: ['other', 'vendor', 'common']  // 考虑代码分割
          })
      ]
  ```

  **现在你不仅不需要手动的写 `index.html` 文件，而且也不用手动的打开浏览器了。Webpack 都帮你完成了。**

#### 输出

* **写在`webpack.prod.js`下**

  ```js
  //单入口时
  output: {
          filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
          path: distPath,
          // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
      },
  //多入口时
   output: {
          // filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
          filename: '[name].[contentHash:8].js', // name 即多入口时 entry 的 key
          path: distPath,
          // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
      },
  ```



### merge使用

* 使用`webpack-merge`区分线上环境和开发环境

* 从`webpack.common.js`导入`webpackCommonConfig`

* 从`webpack-merge`导入`smart`

* 调用`smart`构建`module.export`

  ```js
  const path = require('path')
  const webpack = require('webpack')
  const webpackCommonConf = require('./webpack.common.js')
  const { smart } = require('webpack-merge')
  const { srcPath, distPath } = require('./paths')
  
  module.exports = smart(webpackCommonConf, {...})//...为具体配置
  ```

### 不同环境配置不同mode

* `webpack.dev.js`

  1. mode要为`development`
  2. `plugis`中的`webpack.DefinePlugin`要由`window.ENV:JSON.stringfy('development')`

  ```jsx
  module.exports = smart(webpackCommonConf, {
      mode: 'development',//mode要为development
      module: {
          rules: [
              // 直接引入图片 url
              {
                  test: /\.(png|jpg|jpeg|gif)$/,
                  use: 'file-loader'
              }
          ]
      },
      plugins: [
          new webpack.DefinePlugin({
              // window.ENV = 'development'
              ENV: JSON.stringify('development')
          })
      ],
      devServer: {
          port: 8080,
          progress: true,  // 显示打包的进度条
          contentBase: distPath,  // 根目录
          open: true,  // 自动打开浏览器
          compress: true,  // 启动 gzip 压缩
  
          // 设置代理
          proxy: {
              // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
              '/api': 'http://localhost:3000',
  
              // 将本地 /api2/xxx 代理到 localhost:3000/xxx
              '/api2': {
                  target: 'http://localhost:3000',
                  pathRewrite: {
                      '/api2': ''
                  }
              }
          }
      }
  })
  ```

* `webpack.prod.js`

  1. mode要为`production`
  2. `plugis`中的`webpack.DefinePlugin`要由`window.ENV:JSON.stringfy('production')`

  ```jsx
  module.exports = smart(webpackCommonConf, {
      mode: 'production',			//mode要为production
      output: {
          filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
          path: distPath,
          // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
      },
      module: {
          rules: [
              // 图片 - 考虑 base64 编码的情况
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
          ]
      },
      plugins: [
          new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
          new webpack.DefinePlugin({
              // window.ENV = 'production'
              ENV: JSON.stringify('production')
          })
      ]
  })
  ```

# 二、启动本地服务

### 安装

* `npm install --save-dev webpack-dev-server`

### package.json配置

* 在`scripts`中指定`"dev"`属性的指令和路径

  ```js
  "dev": "webpack-dev-server --config build-optimization/webpack.dev.js",
  ```

### 在`webpack.dev.js`中配置`devServer`

```js
devServer: {
        port: 8080,
        progress: true,  // 显示打包的进度条
        contentBase: distPath,  // 根目录
        open: true,  // 自动打开浏览器
        compress: true,  // 启动 gzip 压缩

        // 设置代理
        proxy: {
            // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
            '/api': 'http://localhost:3000',

            // 将本地 /api2/xxx 代理到 localhost:3000/xxx
            '/api2': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    '/api2': ''
                }
            }
        }
    }
```

### 设置代理

```js
proxy: {
            // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
            '/api': 'http://localhost:3000',

            // 将本地 /api2/xxx 代理到 localhost:3000/xxx
            '/api2': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    '/api2': ''
                }
            }
        }
```

# 三、处理ES6/JSX

### 在`webpack.common.js`中处理

* 在`module`对象下的`rules`数组中添加`loder`对象，对象由`test`（正则）属性和`loader`等属性构成

  ```js
   module: {
          rules: [
              {
                  test: /\.js$/,
                  loader: ['babel-loader'],
                  include: srcPath,		//选哟处理的js
                  exclude: /node_modules/		//不需要处理的js
              },
              ...//其他loader
         ]
       }
  ```

* 安装`npm install --save-dev @babel/preset-react`

* 在项目目录下配置`.babelrc`文件

  ```jsx
  {
      "presets": ["@babel/preset-env"],//ES6
          //"presets": ["@babel/preset-react"],JSX
      "plugins": []
  }
  ```

### 抽离公共代码

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

### 异步加载JS（懒加载）

* 使用定时器和`impot`

  ```
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


### 不在`webpack.common.js`中处理

### 在`webpack.dev.js(开发环境下)`中使用`style-loader`

* 在`module`对象下的`rules`数组中添加`loder`对象，对象由`test`（正则）属性和`loader`等属性构成

  ```jsx
  {
       test: /\.css$/,
                  // loader 的执行顺序是：从后往前
       loader: ['style-loader', 'css-loader', 'postcss-loader'] // 加了 postcss,兼容浏览器
  },   
  {
         test: /\.less$/,
            // 增加 'less-loader' ，注意顺序
         loader: ['style-loader', 'css-loader', 'less-loader']
  }
  ```

  **`postcss-loader`需要安装(另外还有autoprefixer)在项目目录下和配置文件**

  ```js
  //postcss.config.js
  module.exports = {
      plugins: [require('autoprefixer')]
  }
  ```

### 在`webpack.prod.js(线上环境)`下抽离CSS文件

* 引入`MiniCssExtractPlugin = require('mini-css-extract-plugin')`

* 使用`MiniCssExtractPlugin.loader`

  ```js
  // 抽离 css
              {
                  test: /\.css$/,
                  loader: [
                      MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                      'css-loader',
                      'postcss-loader'
                  ]
              },
   // 抽离 less --> css
              {
                  test: /\.less$/,
                  loader: [
                      MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                      'css-loader',
                      'less-loader',
                      'postcss-loader'
                  ]
              }
  ```

* 抽离出的CSS放在哪里(`new MiniCssExtractPlugin`)

  指定`filename`,使用hash值，``

  ```js
  plugins: [
          new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
          new webpack.DefinePlugin({
              // window.ENV = 'production'
              ENV: JSON.stringify('production')
          }),
  
          // 抽离 css 文件
          new MiniCssExtractPlugin({
              filename: 'css/main.[contentHash:8].css'
          })
      ],
  
  ```

### 在`webpack.prod.js(线上环境)`下压缩CSS文件

* 引入`const TerserJSPlugin = require('terser-webpack-plugin')`和

  ​    	`const OptimizeCSSAssetsPlugin = require('optimize-css-assets-pluginn')`

* 增加一个`plugin`

  ```js
  optimization: {
          // 压缩 css
          minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
     }
  ```

# 五、处理图片

* 开发配置下`webpack.dev.js`，`modules`对象下的`rules`数组添加`file-loader`,直接以文件形式引入

  ```js
   module: {
          rules: [
              // 直接引入图片 url
              {
                  test: /\.(png|jpg|jpeg|gif)$/,
                  use: 'file-loader'
              }
          ]
      },
  ```

* 线上配置下`webpack.prod.js`，`modules`对象下的`rules`数组添加`url-loader`,在文件小于5kb时，直接用html格式引入，减少了一次HTTP请求

  ```jsx
   module: {
          rules: [
              // 图片 - 考虑 base64 编码的情况
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
          ]
      },
  ```

* `webpack.prod.js`中的`output`，`filename`，使用hash，让js文件可以区分，下次访问时，如果js文件没有变化，那么hash值将不变，即命中缓存

  ```js
  output: {
          filename: '[name].[contentHash:8].js',  // 打包代码时，加上 hash 戳
          path: distPath,
          // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
      },
  ```

  