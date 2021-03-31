## JSX的诞生

他是 JavaScrip 的一种扩展语法。 React 官方推荐使用这种语法来描述 UI 信息。JSX 可能会让你想起某种模板语言，但是它具有 JavaScrip 的全部能力

- JSX 执行更快，因为它在编译为 JavaScript 代码后进行了优化。
- 它是类型安全的，在编译过程中就能发现错误。
- 使用 JSX 编写模板更加简单快速。

## 编译

本质上来讲，**JSX 只是为 `React.createElement(component, props, ...children) `方法提供的语法糖**

```
<div className="num" index={1}>
  <span>123456</span>
</div>
"use strict";

React.createElement("div", {
  className: "num",
  index: 1
}, React.createElement("span", null, "123456"));
```

具体效果可以[在此体验](https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwEwlgbgBAxgNgQwM5IHIILYFMC8AiAOwFcM8owCQsAPHAbwEYBfAPgCgopgkAHBAlgwBMAZgAsAVgBswAPS9-7OeAgsgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=es2015%2Creact%2Cstage-0&prettier=false&targets=&version=7.3.4)

这就是为什么尽管你看不到里面使用过`React`,但是如果你不引入模块的话JSX会报错.

## JSX原理

从上面的编译代码来看,JSX最终包含的信息其实分别是: **元素标签, 元素属性, 子元素.**如果用Javascript对象来表示的话:

```
{
  tag: 'div',
  attrs: { className: 'num', index: 1},
  children: [
    {
      tag: 'span',
      arrts: null,
      children: null
    }
  ]
}
```

所以整个过程大概如下
![图片描述](https://segmentfault.com/img/bVbv3y5?w=1070&h=180)

至于为什么会有中间编译成JS对象那一步而不直接编译成Dom元素.

- 除了普通页面还可能渲染到canvas或者原生App(React Native了解一下)
- 后面的diff比较需要用到