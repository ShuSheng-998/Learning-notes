### 什么是DOM

从网络传给渲染引擎的HTML字节流，对于**渲染引擎**来说是无法理解的，**需要构建一种内部结构才能理解**，这个结构就是DOM

简言之，DOM 是表述 HTML 的内部数据结构，它会将 Web 页面和 JavaScript 脚本连接起来，并过滤一些不安全的内容。

## DOM树如何生成

#### HTML解析器模块

* 渲染引擎内部，有个HTML解析器的模块，将HTML字节流转换成DOM结构

* 网络进程加载了多少数据，HTML 解析器便解析多少数据。

#### 整体流程

* 网络进程**接收到响应头后**，**根据响应头中的 content-type 字段来判断文件的类型**，比如 content-type 的值是“text/html”，那这**是一个 HTML 类型的文件**，然后为该请求选择或者**创建一个渲染进程**。

* 渲染进程准备好后和HTML解析器形成数据通路，渲染进程把HTML字节流传给HTML解析器，解析器生成DOM树

#### 具体流程

**三个阶段**，**阶段二和三**

* 通过分词器，将字节流转换成Token（V8中的词法分析）

  Token分成`Tag Token`和`文本Token`，`Tag Token`分为`StartTag`和`EndTag`

* 生成DOM节点

  - 如果压入到栈中的是StartTag Token，HTML 解析器会为该 Token 创建一个 DOM 节点，然后将该节点加入到 DOM 树中，它的父节点就是栈中相邻的那个元素生成的节点。
  - 如果分词器解析出来是文本 Token，那么会生成一个文本节点，然后将该节点加入到 DOM 树中，文本 Token 是不需要压入到栈中，它的父节点就是当前栈顶 Token 所对应的 DOM 节点。
  - 如果分词器解析出来的是EndTag 标签，比如是 EndTag div，HTML 解析器会查看 Token 栈顶的元素是否是 StarTag div，如果是，就将 StartTag div 从栈中弹出，表示该 div 元素解析完成。

* 挂载DOM节点到DOM树

## JavaScript是如何影响DOM树的

#### 内嵌脚本

`执行到script时，渲染进程暂停，即HTML解析器暂停，JS引擎启动，修改之前的DOM结构，执行完成后，渲染进程回复执行`

我们再来看看稍微复杂点的 HTML 文件，如下所示：

```html
<html>
<body>
    <div>1</div>
    <script>
    let div1 = document.getElementsByTagName('div')[0]
    div1.innerText = 'time.geekbang'
    </script>
    <div>test</div>
</body>
</html>
```

我在两段 div 中间插入了一段 JavaScript 脚本，这段脚本的解析过程就有点不一样了。script标签之前，所有的解析流程还是和之前介绍的一样，但是解析到script标签时，渲染引擎判断这是一段脚本，此时 HTML 解析器就会暂停 DOM 的解析，因为接下来的 JavaScript 可能要修改当前已经生成的 DOM 结构。

通过前面 DOM 生成流程分析，我们已经知道当解析到 script 脚本标签时，其 DOM 树结构如下所示：

![img](http://blog.poetries.top/img-repo/2019/11/64.png)

这时候 HTML 解析器暂停工作，JavaScript 引擎介入，并执行 script 标签中的这段脚本，因为这段 JavaScript 脚本修改了 DOM 中第一个 div 中的内容，所以执行这段脚本之后，div 节点内容已经修改为 time.geekbang 了。脚本执行完成之后，HTML 解析器恢复解析过程，继续解析后续的内容，直至生成最终的 DOM。

#### 内嵌src式

**其整个执行流程还是一样的**，执行到 JavaScript 标签时，**暂停整个 DOM 的解析**，执行 JavaScript 代码，不过这里执行 JavaScript 时，**需要先下载这段 JavaScript 代码**。这里需要重点关注下载环境，因为**JavaScript 文件的下载过程会阻塞 DOM 解析**，而通常下载又是非常耗时的，会受到网络环境、JavaScript 文件大小等因素的影响。

不过 **Chrome 浏览器做了很多优化**，其中一个主要的优化是**预解析操作**。当渲染引擎收到字节流之后，会开启一个预解析线程，**用来分析 HTML 文件中包含的 JavaScript、CSS 等相关文件，解析到相关文件之后，预解析线程会提前下载这些文件。**

我们知道引入 **JavaScript 线程会阻塞 DOM**，不过也有一些**相关的策略来规避**，

**比如使用 CDN 来加速 JavaScript 文件的加载，压缩 JavaScript 文件的体积。**

* 另外，如果 JavaScript 文件中没有操作 DOM 相关代码，就可以将该 JavaScript 脚本设置为异步加载，通过 async 或 defer 来标记代码，使用方式如下所示：

* async 和 defer 虽然都是异步的，不过还有一些差异，使用 async 标志的脚本文件一旦加载完成，会立即执行；而使用了 defer 标记的脚本文件，需要在 DOMContentLoaded 事件之前执行。

#### Script标签中涉及CSS样式

现在我们知道了 JavaScript 是如何阻塞 DOM 解析的了，那接下来我们再来结合文中代码看看另外一种情况：

```text
<head>
    <style src='theme.css'></style>
</head>
<body>
    <div>1</div>
    <script>
            let div1 = document.getElementsByTagName('div')[0]
            div1.innerText = 'time.geekbang' // 需要 DOM
            div1.style.color = 'red'  // 需要 CSSOM
        </script>
    <div>test</div>
</body>
</html>
```

该示例中，JavaScript 代码出现了 div1.style.color = ‘red' 的语句，它是用来操纵 CSSOM 的，所以在执行 JavaScript 之前，需要先解析 JavaScript 语句之上所有的 CSS 样式。所以如果代码里引用了外部的 CSS 文件，那么在执行 JavaScript 之前，还需要等待外部的 CSS 文件下载完成，并解析生成 CSSOM 对象之后，才能执行 JavaScript 脚本。

而 JavaScript 引擎在解析 JavaScript 之前，是不知道 JavaScript 是否操纵了 CSSOM 的，所以渲染引擎在遇到 JavaScript 脚本时，不管该脚本是否操纵了 CSSOM，都会执行 CSS 文件下载，解析操作，再执行 JavaScript 脚本。

所以说 JavaScript 脚本是依赖样式表的，这又多了一个阻塞过程。至于如何优化，我们在下篇文章中再来深入探讨。

通过上面的分析，我们知道了 JavaScript 会阻塞 DOM 生成，而样式文件又会阻塞 JavaScript 的执行，所以在实际的工程中需要重点关注 JavaScript 文件和样式表文件，使用不当会影响到页面性能的