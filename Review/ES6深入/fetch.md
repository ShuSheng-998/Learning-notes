# Fetch 入门

# 一、什么是Fetch ？

## Fetch的定义

Fetch本质上是一种标准，该标准定义了请求、响应和绑定的流程。 Fetch标准还定义了Fetch () JavaScript API，它在相当低的抽象级别上公开了大部分网络功能，我们今天讲的主要是Fetch API。Fetch API 提供了一个获取资源的接口（包括跨域）。它类似于 XMLHttpRequest ，但新的API提供了更强大和灵活的功能集。 **Fetch 的核心在于对 HTTP 接口的抽象**，包括 Request，Response，Headers，Body，以及用于初始化异步请求的 global fetch。

# 二、如何使用Fetch

## fetch() 方法的使用

Fetch API 提供了一种全局fetch()方法，该方法位于 WorkerOrGlobalScope 这一个 mixin 中 方法用于发起获取资源的请求。它返回一个 promise，这个 promise 会在请求响应后被 resolve，并传回 Response 对象。

```
fetch(input?: Request | string, init?: RequestInit): Promise<Response>

fetch(url, options).then(function(response) {
  // 处理 HTTP 响应
}, function(error) {
  // 处理网络错误
})
复制代码
```

## fetch() 参数

fetch方法可以接收两个参数input和options。

- input 参数可以是字符串，包含要获取资源的 URL。也可以是一个[ Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) 对象。
- options 是一个可选参数。一个配置项对象，包括所有对请求的设置。可选的参数有：

> method: 请求使用的方法，如 GET、POST。
> headers: 请求的头信息，包含与请求关联的Headers对象。
> body: 请求的 body 信息。注意 GET 或 HEAD 方法的请求不能包含 body 信息
> mode: 请求的模式，如 cors、 no-cors 或者 same-origin。
> credentials: 请求的 credentials，如 omit、same-origin 或者 include。为了在当前域名内自动发送 cookie ， 必须提供这个选项。

## 常用的fetch请求

### HTML

```
fetch('/index/fetchHtml')
  .then((res) => {
    return res.text()
  }).then((result) => {
    document.body.innerHTML += result
  })
  .catch((err) => {
  })
复制代码
```

### JSON

```
fetch('/api/user/CaiCai')
  .then((res) => {
    return res.json()
  })
  .then((json) => {
    console.log(json)
  })
  .catch((err => {
  }))

复制代码
```

### POST Form

```
function postForm() {
  const form = document.querySelector('form')
  const name = encodeURI(document.getElementsByName('name')[0].value)
  fetch(`/api/user/${name}`, {
    method: 'POST',
    body: new FormData(form)
  })
}
复制代码
```

### POST JSON

```
fetch('/api/user/CaiCai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'CaiCai',
    age: '26',
  })
})

复制代码
```

## fetch注意事项

### 1. 错误处理

fetch只有在网络错误的情况，返回的promise会被reject。成功的 fetch() 检查不仅要包括 promise 被 resolve，还要包括 Response.ok 属性为 true。HTTP 404 状态并不被认为是网络错误，所以Promise的状态为resolve。

### 2. credentials 设置

fetch可以通过credentials自己控制发送请求时是否带上cookie。credentials可设置为include、same-origin、omit。include为了让浏览器发送包含凭据的请求（即使是跨域源）。如果你只想在请求URL与调用脚本位于同一起源处时发送凭据，请添加credentials: 'same-origin'。要改为确保浏览器不在请求中包含凭据，请使用credentials: 'omit'。

> credentials 默认是“same-origin”，但是以下版本的浏览器实现了一个更老版本的fetch规范，其中默认是“忽略”: Firefox 39-60 Chrome 42 - 67 Safari 10.1 11.1.2 如果您的目标是这些浏览器，建议始终对所有fetch请求显式指定凭据:'同源'，而不是依赖于默认

### 3. 中止

fetch 自身并没有提供 中止请求的方法。但是部分浏览器有实现AbortController，可以通过AbortController中止fetch请求

```
const controller = new AbortController();
const signal = controller.signal;
setTimeout(() => controller.abort(), 5000);


fetch('/api/user/CaiCai', {
  signal, // 在option中加入signal
  method: 'POST',
  // credentials:'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'CaiCai',
    age: '26',
  })
}).then((res) => {
  return res.json()
}).then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
})
```

# 三、为什么要用Fetch、而不用XHR

1、fetch返回的是promise对象，比XMLHttpRequest的实现更简洁，fetch 使用起来更简洁 ，完成工作所需的实际代码量也更少
 2、fetch 可自定义是否携带Cookie
 3、fetch在ServiceWorker中使用，至于ServiceWorker能有什么优势，会在未来写ServiceWorker的时候回写到

# 四、为什么放弃fetch


 1.fetch不支持jsonp，如果项目中使用到JSONP，需要单独实现一个JSONP。
 2.fetch自身并没有提供abort的方法，需要AbortController去处理中止，实现起来会繁琐一点。并且AbortController兼容性不是很好，不过@[周公来](https://juejin.im/user/1257497030835528)同学指出，我们可以使用“abortcontroller-polyfill”。
 3.在我们平常使用中，fetch相对XHR差别不大，并且就像@[jokerapi](https://juejin.im/user/2013961032317767)同学说的“实际业务上，api 请求都是用再次封装好的函数来处理的。底层是 Fetch 还是 XHR 影响不大。”。所以如果没有特别的需求，从XHR升级到fetch的意义不大。但是在ServiceWorker中fetch会大放异彩。目前淘宝首页就使用fetch+ServiceWorker来实现离线缓存。