#### 前言

***

javascript从诞生之日起就是一门单线程的非阻塞的脚本语言。这是由其最初的用途来决定的：与浏览器交互。

#### 浏览器环境下js引擎的事件循环机制

***

##### 1. 执行栈与事件队列

当一个脚本第一次执行的时候，js引擎会解析这段代码，**并将其中的同步代码按照执行顺序加入执行栈中**，然后从头开始执行。如果当前执行的是一个方法，那么js会向执行栈中添加这个方法的执行环境，然后进入这个执行环境继续执行其中的代码。当这个执行环境中的代码 执行完毕并返回结果后，js会退出这个执行环境并把这个执行环境销毁，回到上一个方法的执行环境。。这个过程反复进行，直到执行栈中的代码全部执行完毕。



那么当一个异步代码（如发送ajax请求数据）执行后会如何呢？前文提过，**js的另一大特点是非阻塞，实现这一点的关键在于这项机制——事件队列（Task Queue）。**

js引擎**遇到一个异步事件后并不会一直等待其返回结果，而是会将这个事件挂起，**继续执行执行栈中的其他任务。当一个**异步事件返回结果后**，**js会将这个事件加入与当前执行栈不同的另一个队列，我们称之为事件队列**。被放入事件队列不会立刻执行其回调，而是等待当前执行栈中的所有任务都执行完毕， 主线程处于闲置状态时，主线程会去查找事件队列是否有任务。如果有，那么主线程会从中取出排在第一位的事件，并把这个事件对应的回调放入执行栈中，然后执行其中的同步代码...，如此反复，这样就形成了一个无限的循环。这就是这个过程被称为“事件循环（Event Loop）”的原因。

##### 3.macro task 与micro  task

- ## 宏任务有哪些

  - `<script>`标签中的运行代码
  - 事件触发的回调函数，例如`DOM Events`、`I/O`、`requestAnimationFrame`
  - `setTimeout`、`setInterval`的回调函数

  ## 微任务有哪些

  - **promises**：`Promise.then`、`Promise.catch`、`Promise.finally`
  - **`MutationObserver`**：[使用方式](http://javascript.ruanyifeng.com/dom/mutationobserver.html)
  - **`queueMicrotask`**：[使用方式](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask)
  - **`process.nextTick`**：Node独有

我们只需记住**当 当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，微任务永远在宏任务之前执行**。宏任务中有微任务，会先把这次的微任务执行完。才向下走

#### node环境下的事件循环机制

***

##### 1.与浏览器环境下有何不同

在node中，事件循环表现出的状态与浏览器中大致相同。不同的是node中有一套自己的模型。node中事件循环的实现是依靠的libuv引擎。我们知道node选择chrome v8引擎作为js解释器，v8引擎将js代码分析后去调用对应的node api，而这些api最后则由libuv引擎驱动，执行对应的任务，并把不同的事件放在不同的队列中等待主线程执行。 因此实际上node中的事件循环存在于libuv引擎中。

这个图是整个 Node.js 的运行原理，从左到右，从上到下，Node.js 被分为了四层，分别是 **应用层**、**V8引擎层**、**Node API层** 和 **LIBUV层。**

> 应用层：  即 JavaScript 交互层，常见的就是 Node.js 的模块，比如 http，fs
>
> V8引擎层： 即利用 V8 引擎来解析JavaScript 语法，进而和下层 API 交互
>
> NodeAPI层： 为上层模块提供系统调用，一般是由 C 语言来实现，和操作系统进行交互 。
>
> LIBUV层： 是跨平台的底层封装，实现了 事件循环、文件操作等，是 Node.js 实现异步的核心 。

无论是 Linux 平台还是 Windows 平台，Node.js 内部都是通过 **线程池** 来完成异步 I/O 操作的，而 LIBUV 针对不同平台的差异性实现了统一调用。因此，**Node.js 的单线程仅仅是指 JavaScript 运行在单线程中，而并非 Node.js 是单线程。**

##### 2.工作原理

Node.js 实现异步的核心是事件，也就是说，它把每一个任务都当成 **事件** 来处理，然后通过 Event Loop 模拟了异步的效果

Node.js 只用了一个主线程来接收请求，但它接收请求以后并没有直接做处理，而是放到了事件队列中，然后又去接收其他请求了，

空闲的时候，再通过 Event Loop 来处理这些事件，从而实现了异步效果，

当然对于IO类任务还需要依赖于系统层面的线程池来处理。

### **CPU密集型是短板**

至此，对于 Node.js 的单线程模型，我们应该有了一个简单而又清晰的认识，它通过事件驱动模型实现了高并发和异步 I/O，然而也有 Node.js 不擅长做的事情：

上面提到，如果是 I/O 任务，Node.js 就把任务交给线程池来异步处理，高效简单，因此 Node.js 适合处理I/O密集型任务。但不是所有的任务都是 I/O 密集型任务，当碰到CPU密集型任务时，即只用CPU计算的操作，比如要对数据加解密(node.bcrypt.js)，数据压缩和解压(node-tar)，这时 Node.js 就会亲自处理，一个一个的计算，前面的任务没有执行完，后面的任务就只能干等着 。