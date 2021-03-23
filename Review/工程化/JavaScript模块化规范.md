## ~~什么是模块

- 将一个复杂的程序依据一定的规则/规范封装成几个块，并进行组合在一起
- 块的内部数据与实现是私有的，只是向外不暴露一些接口/方法与外部其他模块通信

## 1.*CommonJS*

CommonJS规范主要是用于服务端的模块化规范，可以说`NodeJS`是它的最佳实践。在服务端，模块的加载是运行时同步加载的，而在浏览器端，模块需要提前编译打包处理。

基本语法

```js
暴露：module.exports = value  或者  exports.xxx = value
引入：require(xxx),如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径
```

* 当使用require命令**加载同一个模块时，不会再执行该模块，而是取到缓存之中的值**。也就是说，CommonJS模块**无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果**，除非手动清除系统缓存。

## 2.AMD

- 特点：非同步加载模块，允许指定回调函数，浏览器一般采用AMD规范
- 代表作：**require.js**

```js
//定义没有依赖的模块
define([module],function(){
   return 模块
})

//定义有依赖的模块
define(['module1', 'module2'], function(m1, m2){
   return 模块
})

//引入使用模块
require(['module1', 'module2'], function(m1, m2){
   //使用m1/m2
})
```

1. 所有的模块都进行异步加载，模块加载不影响后面语句运行。

2. 所有依赖某些模块的语句均放置在回调函数中。

3. 提供全局define 函数（方法）来定义模块，require引入模块，exports导出模块。

* 使用AMD规范进行页面开发需要用到对应的库函数RequireJS。实际上AMD 是 RequireJS 在推广过程中对模块定义的规范化的产出。

RequireJS在实现JavaScript模块化开发的同时，主要是解决2个问题：

    1、多个js模块相互引用问题，被依赖模块需早与依赖模块加载。
    
    2、js加载的会阻塞浏览器页面渲染，加载文件越多，页面失去响应时间越长 
## 3.CMD

- 特点：专门用于浏览器端，模块的**加载是异步的**，模块使用时才会加载执行
- 代表作：**Sea.js**

```js
//定义没有依赖的模块
define(function(require, exports, module){
  exports.xxx = value
  module.exports = value
})

//定义有依赖的模块
define(function(require, exports, module){
  //引入依赖模块(同步)
  var module2 = require('./module2')
    //引入依赖模块(异步)
    require.async('./module3', function (m3) {
    })
  //暴露模块
  exports.xxx = value
})

//引入使用模块
define(function (require) {
  var m1 = require('./module1')
  var m4 = require('./module4')
  m1.show()
  m4.show()
})
```

##  AMD和CMD区别

AMD和CMD最大的区别是对依赖模块的执行时机处理不同：

    1、AMD推崇依赖前置，在定义模块的时候就要声明其依赖的模块
    
    2、CMD推崇就近依赖，只有在用到某个模块的时候再去require

不同点体现如下：

1、异步加载模块

    requireJS，SeaJS加载模块都是异步的，只不过AMD依赖前置，JS可以方便知道依赖模块是谁，立即加载。CMD就近依赖，需要使用把模块变为字符串解析一遍才知道依赖了那些模块。

2、依赖模块执行时机不同

       AMD在加载模块完成后就会执行改模块，所有依赖模块都加载执行完后会进入require的回调函数执行主逻辑，依赖模块的执行顺序和书写顺序不一定一致，主逻辑一定在所有依赖加载完成后才执行。
    
      CMD加载完某个依赖模块后并不执行，只是下载而已，在所有依赖模块加载完成后进入主逻辑，遇到require语句的时候才执行对应的模块，这样模块的执行顺序和书写顺序是完全一致的。
## 4.ES6模块化

- ES6模块使用`import`关键字导入模块，`export`关键字导出模块：

```js
/** 导出模块的方式 **/

var a = 0;
export { a }; //第一种
   
export const b = 1; //第二种 
  
let c = 2;
export default { c }//第三种 

let d = 2;
export default { d as e }//第四种，别名

/** 导入模块的方式 **/

import { a } from './a.js' //针对export导出方式，.js后缀可省略

import main from './c' //针对export default导出方式,使用时用 main.c

import 'lodash' //仅仅执行lodash模块，但是不输入任何值
```

命名式导出与默认导出

`export {<变量>}`这种方式一般称为 **命名式导出** 或者 **具名导出**，导出的是一个**变量的引用**。
`export default`这种方式称为 **默认导出** 或者 **匿名导出**，导出的是一个**值**。

## 5.ES6 模块与 CommonJS 模块的差异

它们有两个重大差异：

**① CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用**。

**② CommonJS 模块是运行时加载，ES6 模块是编译时输出接口**。

第二个差异是因为 **CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。**而 ES6 模块不是对象，**它的对外接口只是一种静态定义，在代码静态解析阶段就会生成**（在编译阶段就确定了输出结果，即变量和方法）。

下面重点解释第一个差异，我们还是举上面那个CommonJS模块的加载机制例子:

```
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}
// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

ES6 模块的运行机制与 CommonJS 不一样。**ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块**。