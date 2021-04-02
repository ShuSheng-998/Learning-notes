# 环境搭建与基本配置

### `presets`预设

将常用的`Plugin`打包，重命名为`preset-env`（一堆`plugin`的集合）

<img src="C:\Users\DELL\AppData\Roaming\Typora\typora-user-images\image-20210402154121775.png" alt="image-20210402154121775" style="zoom: 80%;" />

### `plugin`

* ES6+语法到ES5语法的转换
* 其他语法到ES6语法的转换（JSX、Vue语法）

# babel-polyfill

### core-js和regenerator

* `core-js`集成了对ES6+的新语法的`polyfill`补丁。提高兼容性（但不支持`generator`函数的兼容）
* `regenerator`：对`generator`的兼容

### 什么是`polyfill`

**补丁，对于低版本浏览器语法的兼容,core-js和regenerator的集合者**

* `babe`l只对语法做出转换，如果使用了诸如`promise`的语法，在语法上本质上是符合ES5规范的，所以要用到`babel-polyfill`来转换
* `babel-polyfill`导入后还不够，需要`Webpack`进行解析,把`babel-polyfill`的内容打包出来，放到文件中使用

* 如图，兼容IE6以下不支持`Array.prototype.indexof`

![image-20210402154549312](C:\Users\DELL\AppData\Roaming\Typora\typora-user-images\image-20210402154549312.png)

### 按需引入

* 在`.babelrc`文件中配置

  ![image-20210402160420895](C:\Users\DELL\AppData\Roaming\Typora\typora-user-images\image-20210402160420895.png)

### 出现一些问题

* 污染全局环境

# babel-runtime

解决污染环境问题

**为了不污染全局对象和内置的对象原型，但是又想体验使用新鲜语法的快感。**就可以配合使用`babel-runtime`和`babel-plugin-transform-runtime`。 比如当前运行环境不支持`promise`，可以通过引入`babel-runtime/core-js/promise`来获取`promise`， 或者通过`babel-plugin-transform-runtime`自动重写你的`promise`。也许有人会奇怪，为什么会有两个`runtime`插件，其实是有历史原因的：刚开始开始只有`babel-runtime`插件，但是用起来很不方便，在代码中直接引入`helper` 函数，意味着不能共享，造成最终打包出来的文件里有很多重复的`helper`代码。所以，`Babel`又开发了`babel-plugin-transform-runtime`，这个模块会将我们的代码重写，如将`Promise`重写成`_Promise`（只是打比方），然后引入`_Promise helper`函数。这样就避免了重复打包代码和手动引入模块的痛苦。

### 用法

```
1. `npm install --save-dev babel-plugin-transform-runtime`
2. `npm install --save babel-runtime`
3. 写入 `.babelrc`
复制代码
{
  "plugins": ["transform-runtime"]
}
复制代码
```

启用插件`babel-plugin-transform-runtime`后，`Babel`就会使用`babel-runtime`下的工具函数，转译代码如下：

```
'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var key = 'babel';
var obj = (0, _defineProperty3.default)({}, key, 'foo');
```