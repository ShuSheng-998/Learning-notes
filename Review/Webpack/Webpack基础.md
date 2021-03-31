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



### loader

Loaders 是一种预处理器，它可以在 Webpack 编译之前把你应用中的静态资源进行转换 