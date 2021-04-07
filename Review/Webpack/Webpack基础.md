### 概念

> 本质上，*webpack* 是一个现代 JavaScript 应用程序的*静态模块打包器(module bundler)*。当 webpack 处理应用程序时，它会递归地构建一个*依赖关系图(dependency graph)*，其中包含应用程序需要的每个**模块**，然后将所有这些模块打包成一个或多个 ***bundle***。

# 初始化和安装

- 在工作目录新建一个文件夹

- `npm install --global webpack` 全局安装，在c盘下会生成node_modules文件夹中会包含webpack。`请注意，这不是推荐的做法。全局安装会将您锁定到特定版本的webpack，并且在使用不同版本的项目中可能会失败。`官方并不推荐全局安装。

- `npm install --save-dev webpack` 安装在本地开发环境中

- `npm install --save-dev webpack-cli` webpack4之后要安装cli。把cli安装到开发环境中。

- `-D`就是`--save-dev`的缩写

- `由于我们将Webpack安装在了本地`，因此无法直接在命令行内使用“webpack”指令。项目内部只能使用

  `npx webpack`的形式.

# 初始化一个项目

使用`npm init` 首先初始化一个项目，首先在命令行内定位到所要放项目的文件夹，然后执行`npm init`，创建即可。

# 打包一个简单的文件

- 在文件夹下新建一个`src`文件,下面新建一个app.js`文件。
- 根目录下新建一个`webpack.config.js`文件。为什么要建这个文件，因为直接使用`webpack`，它会寻找`webpack.config.js`把它当成默认的配置去运行。此时它不需要指定任何参数，就能读取里面的内容。
- `package.json` 里面的scripts配置文件添加打包参数， "build": "webpack"
- 执行`npm run build`，`Webpack`就会预先读取webpack.config.js，然后进行打包。 

```
// webpack.config.js
module.exports = {
    entry: __dirname + '/src/app.js',//我指定了入口文件，在src/main.js
    output: { 
        path: __dirname + '/dist', //打包后指定存放的目录,放在dist
        filename: 'bundle.js' //打包后的文件叫bundle.js
    }
}
复制代码
```

> __dirname是Node.js中一个全局变量，它指向当前执行脚本所在的目录。

- **如果你想有些个性化的需求，你想看到打包的进度，打包的模块，模块的信息，打包的原因。**
  - 在你初始化的时候，系统会自动生成`package.json`。现在找到根目录下的`package.json`文件。

![img](https://user-gold-cdn.xitu.io/2019/7/1/16bad8c1ca6b5add?imageView2/0/w/1280/h/960/format/webp/ignore-error/1) - 在里面的`scripts`下添加定义一个脚本， `    "dev":"webpack --config webpack.config.js --progress --display-modules --colors --display-reasons"    ` - 最后在命令行运行`npm run dev` **因为scripts脚本提供了命令的“别名”，像上面的以一个“dev”命令代替了一连串的命令，使用起来更为方便**,即便你没有在命令行输入以上的配置，你依然可以看到打包的进度；以看到打包有几个模块，模块的信息；字体为彩色；打包的原因。因为你在配置文件下定义了，就不需要了。

- 添加`start`更简单快捷的执行打包。在`package.json`里找到“scripts”脚本，添加

```
"start": "webpack --config webpack.config.js --progress --display-modules --colors --display-reasons"
```

# 主要组成部分

**mode**

- 提供mode配置选项，告知webpack使用相应的内置优化

- 有`development`和`production`

  ```
  module.exports = {
    mode: 'production',
  }
  ```

**Entry**: 指定webpack开始构建的入口模块，从该模块开始构建并计算出直接或间接依赖的模块或者库。**来作为构建其内部依赖图的开始**

**Output**：告诉webpack如何命名输出的文件以及输出的目录

**Module**: 模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。

**Chunk**：`coding split`的产物，我们可以对一些代码打包成一个单独的`chunk`，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间。在`webpack3`及以前我们都利用`CommonsChunkPlugin`将一些公共代码分割成一个`chunk`，实现单独加载。在`webpack4` 中`CommonsChunkPlugin`被废弃，使用`SplitChunksPlugin`

**Loader**：模块转换器，用于把模块原内容按照需求转换成新内容，能够去**处理**那些**非 JavaScript 文件**。是一种预处理器，它可以在 Webpack 编译之前把你应用中的静态资源进行转换

* 在module.rules下配置相关规则

```
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.ts$/, use: 'ts-loader' },
    ],
  },
}
```

**Plugin**：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

- loader 被用于转换某些类型的模块，**而插件则可以用于执行范围更广的任务。**插件的范围包括，**从打包优化和压缩，一直到重新定义环境中的变量。**插件接口功能极其强大，可以用来处理各种各样的任务。

- 想要使用一个插件，**你只需要 require() 它，然后把它添加到 plugins 数组中。\**多数插件可以通过\**选项(option)自定义**。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。

  ```
  const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过 npm 安装
  const webpack = require('webpack') // 用于访问内置插件
  
  const config = {
    module: {
      rules: [{ test: /\.txt$/, use: 'raw-loader' }],
    },
    plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  }
  
  module.exports = config
  ```

# 编译流程

## 两个对象

* `Compiler`对象：负责文件监听和启动编译。`Compiler`对象中包含了完整的webpack配置，全局只有一个`Compiler`实例。
* `Compilation`对象:当`webpack`以开发模式运行时，每当检测到文件变化，一次新的`Compilation`将被创建。一个`Compilation`对象包含了当前的模块资源、编译生成资源、变化的文件等。`Compilation`对象也提供了很多事件回调供插件做扩展运用。

## 流程

Webpack的运行流程是一个串行的过程，从启动到结束依次执行以下流程：

1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
2. 编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理。
3. 输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

如果只执行一次构建，以上阶段将会按照顺序各执行一次。但在开启监听模式下，流程将变为如下： ![webpack-flow](https://user-gold-cdn.xitu.io/2019/9/5/16d003a354ad6e96?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

下面具体介绍一下 `webpack`的三个大阶段具体的小步。

### 初始化阶段

初始化阶段大致分为：

- 合并`shell`和**配置文件的参数**，并且实例化Complier对象**。
- **加载插件**
- **处理入口：**寻找指定的入口文件，实例化`compiler`对象

### 编译阶段

编译阶段大致分为

* 从编译程序对象的run函数开始执行编译  ，清楚缓存并建立一次新的编译
* `Compilation`过程：调用响应的`loader`对静态资源模块做处理，如果模块中有模块，那么回递归查找模块并进行处理，直到所有入口文件处理完毕。，最后生成`chunks`，并对`chunks`做优化

>  build-module使用对应的 `Loader` 去转换一个模块。

>  normal-module-loader在**用 `Loader` 对一个模块转换完后，使用 `acorn` 解析转换后的内容，输出对应的抽象语法树（`AST`），以方便 `Webpack` 后面对代码的分析。**

> program从配置的入口模块开始，分析其 `AST`，当遇到 `require` 等导入其它模块语句时，便将其加入到**依赖的模块列表**，同时对新找出的**依赖模块递归分析**，最终搞清所有模块的**依赖关系**。

> seal所有模块及其**依赖**的模块都通过 `Loader` 转换完成后，根据依赖关系开始生成 `Chunk`。

### 输出阶段

| 事件名      | 解释                                                         |
| ----------- | ------------------------------------------------------------ |
| should-emit | 所有需要输出的文件已经生成好，询问插件哪些文件需要输出，哪些不需要。 |
| emit        | 确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出内容。 |
| after-emit  | 文件输出完毕。                                               |
| done        | 成功完成一次完成的编译和输出流程。                           |
| failed      | 如果在编译和输出流程中遇到异常导致 `Webpack` 退出时，就会直接跳转到本步骤，插件可以在本事件中获取到具体的错误原因。 |

1. 初始化参数，从配置文件和shell语句中读取并合并参数，得到最终的参数 '
2. 根据参数初始化编译程序对象，加载配置的插件
3. 确定入口，根据配置的entry找出所有的入口文件
4. 编译模块，从入口文件出发，调用所有配置的loader对模块进行翻译，如果模块中有模块，那么回递归查找模块并进行处理，直到所有入口文件处理完毕。 
5. 完成模块编译，通过上一步得到每一个模块的最终内容以及相应的依赖关系
6. 输出资源，根据入口文件和模块之间的依赖关系，组装成一个个包含多个模块chunk，**把每个chunk转换成单独文件加入到输出列表，这是最后一次可以修改输 出内容的机会**
7. 输出完成，根据配置的路径和文件名把文件内容写入到文件系统

# 基本loader

注意loader的执行顺序是**从后往前**

1. post-css（浏览器兼容，自动添加css前缀），style-loader（把css代码注入到JS中，通过DOM操作来加载css）,css-loader（加载CSS，支持模块化，压缩，文件导入）
2. file-loader,把文件输出到一个文件夹中，**在代码中通过相对URL去引用输出的文件**
3. image-loader,加载并且压缩图片文件
4. url-loader(优化)
5. babel-loader(相关配置在babelrc)把 ES6 转换成 ES5
6. source-map-loader：加载额外的 `Source Map` 文件，以方便断点调试
7. ts-loader

