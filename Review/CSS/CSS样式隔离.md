### 不建议使用行内样式

> 使用行内样式的缺点
>
> - 样式不能复用。
> - 样式权重太高，样式不好覆盖。
> - 表现层与结构层没有分离。
> - 不能进行缓存，影响加载效率。

### 不建议使用导入样式

在 css 中使用 @import 会有以下两种情况：

1、在 IE6-8 下，@import 声明指向的样式表并不会与页面其他资源并发加载，而是等页面所有资源加载完成后才开始下载。

2、如果在 link 标签中去 @import 其他 css，页面会等到所有资源加载完成后，才开始解析 link 标签中 @import 的 css。

### 使用预处理器 Sass/Less

随着时间的不断发展，我们逐渐发现，编写源生的 css 其实并不友好，例如：源生的 css 不支持变量，不支持嵌套，不支持父选择器等等，这些种种问题，催生出了像 sass/less 这样的预处理器。

预处理器主要是强化了 css 的语法，弥补了上文说了这些问题，但本质上，打包出来的结果和源生的 css 都是一样的，只是对开发者友好，写起来更顺滑。

### 后处理器 PostCSS

随着前端工程化的不断发展，越来越多的工具被前端大佬们开发出来，愿景是把所有的重复性的工作都交给机器去做，在 css 领域就产生了 postcss。

postcss 可以称作为 css 界的 babel，它的实现原理是通过 ast 去分析我们的 css 代码，然后将分析的结果进行处理，从而衍生出了许多种处理 css 的使用场景。

常用的 postcss 使用场景有：

- 配合 stylelint 校验 css 语法
- 自动增加浏览器前缀 autoprefixer
- 编译 css next 的语法

### CSS 模块化迅速发展（解决命名冲突）

随着 react、vue 等基于模块化的框架的普及使用，我们编写源生 css 的机会也越来越少。我们常常将页面拆分成许多个小组件，然后像搭积木一样将多个小组件组成最终呈现的页面。

但是我们知道，css 是根据类名去匹配元素的，如果有两个组件使用了一个相同的类名，后者就会把前者的样式给覆盖掉，看来解决样式命名的冲突是个大问题。

为了解决这个问题，产生出了 CSS 模块化的概念。

### CSS Modules

CSS Modules 指的是我们像 import js 一样去引入我们的 css 代码，代码中的每一个类名都是引入对象的一个属性，通过这种方式，即可在使用时明确指定所引用的 css 样式。

并且 CSS Modules 在打包的时候会自动将类名转换成 hash 值，完全杜绝 css 类名冲突的问题。

使用方式如下：

1、定义 css 文件。

```
.className {
  color: green;
}
/* 编写全局样式 */
:global(.className) {
  color: red;
}

/* 样式复用 */
.otherClassName {
  composes: className;
  color: yellow;
}

.otherClassName {
  composes: className from "./style.css";
}
复制代码
```

2、在 js 模块中导入 css 文件。

```
import styles from "./style.css";

element.innerHTML = '<div class="' + styles.className + '">';
复制代码
```

3、配置 css-loader 打包。

CSS Modules 不能直接使用，而是需要进行打包，一般通过配置 css-loader 中的 modules 属性即可完成 css modules 的配置。

```
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use:{
          loader: 'css-loader',
          options: {
            modules: {
              // 自定义 hash 名称
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            }
          }
       }
    ]
  }
};

复制代码
```

4、最终打包出来的 css 类名就是由一长串 hash 值生成。

```
._2DHwuiHWMnKTOYG45T0x34 {
  color: red;
}

._10B-buq6_BEOTOl9urIjf8 {
  background-color: blue;
}
```

### CSS In JS

CSS in JS，意思就是使用 js 语言写 css，完全不需要些单独的 css 文件，所有的 css 代码全部放在组件内部，以实现 css 的模块化。

CSS in JS 其实是一种编写思想，目前已经有超过 40 多种方案的实现，最出名的是 styled-components。

使用方式如下：

```
import React from "react";
import styled from "styled-components";

// 创建一个带样式的 h1 标签
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// 创建一个带样式的 section 标签
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

// 通过属性动态定义样式
const Button = styled.button`
  background: ${props => (props.primary ? "palevioletred" : "white")};
  color: ${props => (props.primary ? "white" : "palevioletred")};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

// 样式复用
const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

<Wrapper>
  <Title>Hello World, this is my first styled component!</Title>
  <Button primary>Primary</Button>
</Wrapper>;
复制代码
```

可以看到，我们直接在 js 中编写 css，案例中在定义源生 html 时就创建好了样式，在使用的时候就可以渲染出带样式的组件了。

除此之外，还有其他比较出名的库：

- emotion
- radium
- glamorous