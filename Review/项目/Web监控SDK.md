# 一款简易的前端Web监控SDK

提供给其他开发者二次开发，用户可以通过在网页上用script标签或者webpack开发的网站项目，用webpack引入的JS  SDK ,主要分为三个模块，

* 用户信息统计：PV、UV
* 异常与事件收集：JS错误统计、api接口错误统计
* 项目性能分析：TCP建立事时间、DNS解析时间、首次可交互时间

### 主要上报一些页面的性能信息

- url 上报页面地址
- preUrl 来访上一页面URL
- performance 页面性能数据详情，字段含义详情请参考后面内容
- errorList 页面错误信息详情，包含js,img,ajax,fetch等所有错误信息，字段含义详情请参考后面内容
- resoruceList 页面性能数据详情，当前页面所有资源性能详情信息，字段含义详情请参考后面内容
- markUv 统计uv标识
- markUser 从用户进入网站开始标识，直到用户离开销毁，可以用来做用户漏斗分析
- time 当前上报时间
- screenwidth 屏幕宽度
- screenheight 屏幕高度
- isFristIn 是否是某次会话的第一次进入
- type 上报类型 1:页面级性能上报 2:页面ajax性能上报 3：页面内错误信息上报

### 使用方式

### 浏览器页面直接引用资源方式：

> - 1、下载 dist/destinteam-web-monitor.min.js 到本地
> - 2、使用script标签引入到html的头部（备注：放到所有js资源之前）
> - 3、使用WebMonitor函数进行数据的监听上报

```html
<html>
<head>
  <meta charset="UTF-8">
  <title>test</title>
  <script src="../dist/destinteam-web-monitor.min.js"></script>
  <script>
    WebMonitor({
        domain:'http://some.com/api', //Your API address
    })
  </script>
</head>
```

### npm引入方式

```js
npm install destinteam-web-monitor --save
import { WebMonitor } from 'destinteam-web-monitor'

WebMonitor({ 
  domain:'http://some.com/api' 
})
```

### 上报参数type值说明（重要）

- type = 1: 页面级别性能数据上报，即页面加载|路由切换时页面性能数据的上报
- type = 2: 页面已加载完毕，当进行某些操作请求了ajax信息时，对ajax性能数据的上报（如果ajax报错则上报错误信息）
- type = 3: 页面已加载完毕，当进行某些操作报错时，对错误信息的上报

### 参数说明

> - 同时传入 domain和传入的function ，function优先级更高，也就是说function会执行
> - domain ：上报api接口
> - outtime ：上报延迟时间，保证异步数据的加载 （默认：300ms）
> - isPage ：是否上报页面性能数据 （默认：true）
> - isResource ：是否上报页面资源性能数据 （默认：true）
> - isError ：是否上报页面错误信息数据 （默认：true）
> - isAjax ：是否上报ajax信息 （默认：true）
> - add ：附带参数 （值为json object 例如：{APPID:'123456789'}）
> - filterUrl ：不需要上报的ajax请求
> - fn ：自定义上报函数

- 案例

```js
1、最简单最常用的上报
WebMonitor({
  domain:'http://some.com/api'  //你的api地址
})

2、加add参数上报
WebMonitor({
  domain:'http://some.com/api'  //你的api地址
  add:{
    appId:'123456789'
  }
})

3、自己写 fn上报
WebMonitor({},data=>{
  fetch('http://some.com/api',{
    type:'POST',
    report:'report-data',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify(data)
  }).then((data)=>{})
})


4、完整版本的上报案例
WebMonitor({
    domain:'http://some.com/api', 
    outtime:500,
    isPage:true,
    isAjax:true,
    isResource:true,
    isError:true,
    add:{
      appId:'123456789'
    },
    filterUrl:['http://localhost:8080/xxx/xxx']
})
```

### 监控SDK

用户信息统计：浏览量（pv），访客数（uv）

浏览量：利用sessionStorage每次建立会话都会创建，关闭页面会消失，在函数中利用getItem判断sessionStorage是否建立**访问过字段**，没有则是新的一次进入，然后用setItem建立这个字段，表明是一次新的访问

访客数：用localStorage，因为会存储到本地，关闭页面不会消失，下次访问时利用getItem判断localStorage中是否有这个字段，有则利用new Date（）判断是否过期（过了一定时间段的统计）

异常与事件整理：js错误统计，api接口错误统计，静态资源加载错误统计（img，video），

项目性能分析：DNS解析时间，TCP建立时间，首次可交互时间

#### 脚本错误或资源异常

监听JS的报错，通过判断是脚本异常还是资源异常(设置捕获类型)

````
window.addEventListener('error', () => {
    if(!(e instanceof ErrorEvent)){  //
        e.target.src || e.target.href
        e.target.tagName
    }
},true)
````

* `window.addEventListener('error',(e) => {})`，页面普通的JS错误
  1. 通过e拿到来自于哪个脚本
  2. 行列号
  3. 报错的对象
* `window.addEventListener('unhandledrejection',(e) => {})`：没有catch到的promise的rejection

#### 接口异常

监控页面内异步请求的耗时和异常，页面的使用者调用方法时，就可以知道页面什么时候调用了，什么时候请求开始，什么时候请求结束，请求的路参，请求的结果

* 重写`XMLHttpRequest`和`fetch`方法

### 对外暴露一个Webmonitor对象

* 使用什么判断是浏览器环境或webpack：判断`exports`和`module`是否是object，`require`是否是`function`

* 怎么上报：使用`WebMonitor`，传入一个对象，对象有很多字段的值，必须设置`domin`，第二个参数是用户自定义的上报函数

* 使用的三个子函数：`_Ajax`  `_fetch`  `error`

  1. `_Ajax`:重写`XMLHttpRequest`对象，重写他的`onreadystatechange`、`onerror`、`onload`、`onopen`来抓取数据。

     * 调用`ajaxResponse`若在`XMLHttpRequest`请求中报错，则在作物处理后加入`errorList`

  2. `_fetch`：重写`window.fetch`来捕获错误信息

     * 调用`getFetchTime`获取使用`XMLHttpRequest`方法的耗时和`fetch`方法的耗时

  3. `error`：监听`error`事件，重写`window.onerror`，监听`unhandledrejection`事件，重写`console.error`

* `getFetchTime`和`error`事件最终都调用了`reportData`方法，将上面收集到的发生错误时信息，根据具体的错误类型进行处理，然后调用fetch方法将信息投送到配置的`domin`，或者以参数形式传递给自定义的上报函数`fn`
* `reportData`方法，将上面收集到的发生错误时信息m,分类调用
  1. `perforPage`:利用`window.performance`计算并统计页面性能
  2. `perforResourse`：利用`performance.getEntriesByType('resource')`获取网页请求的资源、返回资源、及请求时间
  3. `markUser`：使用`sessionStorage`存区用户标识
  4. `markUv`：通过`localStorage`存取计算`Uv`信息
  5. `filterResource`：根据`filterUrl`对资源进行过滤，去除不需要上报的信息
  6. `clear`：清空收集的数据，以便下次执行

### 两个对外方法

一：`addError `：此方法向插件中自定义上报错误信息，`vue`,react，try{}catch 的报错信息均可采用此方法上报 案例：用户可以自定义参数中对象的信息

二：`addData` ：上报时自定义的数据 

### 重写方法遇到的问题

平时使用的时候并不会关注底层具体的实现，通过重写，自己在测试的时候会发现很多的问题，虽然很多的问题解决不了，但是确实给了我思考的契机

* ajax和fetch怎么获取时间：建立请求时`new Date().getTime()`，请求成功时`new Date().getTime() - beginTime`

* 拦截JS错误要重写error事件，并监听`onerror`，在发生错误时，向建立的`errorList`中`push`,`error信息`

* 监听JS的报错，通过判断是脚本异常还是资源异常(设置捕获类型)

  ````
  window.addEventListener('error', () => {
      if(!(e instanceof ErrorEvent)){  //
          e.target.src || e.target.href
          e.target.tagName
      }
  },true)
  ````


*  // 统计页面性能

   ```js
   function perforPage() {
  
     if (!window.performance) return;
  
     let timing = performance.timing
  
     conf.performance = {
  
     // DNS解析时间
  
     dnst: timing.domainLookupEnd - timing.domainLookupStart || 0,
  
     //TCP建立时间
  
      tcpt: timing.connectEnd - timing.connectStart || 0,
  
     // 白屏时间
  
     wit: timing.responseStart - timing.navigationStart || 0,
  
     //dom渲染完成时间
  
     domt: timing.domContentLoadedEventEnd - timing.navigationStart || 0,
  
     //页面onload时间
  
     lodt: timing.loadEventEnd - timing.navigationStart || 0,
  
     // 准备新页面时间耗时
  
     radt: timing.fetchStart - timing.navigationStart || 0,
  
     // 页面重定向时间
  
     rdit: timing.redirectEnd - timing.redirectStart || 0,
  
     // unload时间
  
     uodt: timing.unloadEventEnd - timing.unloadEventStart || 0,
  
     //HTTP响应时间 通过浏览器发出HTTP请求，到浏览器接受完HTTP响应的时间
  
      reqt: timing.responseEnd - timing.requestStart || 0,
  
     //页面解析dom耗时
      andt: timing.domComplete - timing.domInteractive || 0,
  
     }
  
    }
   ```

### 亮点和难点

* 在写`uv`的时候，因为常用的手段就是后端通过给设置`cookies`给每一个主机发放一个唯一ID，但是这么做是有问题的，就是`cookies`很容易被清楚的，有些人就可能恶意清楚cookies来刷UV，而且当时我们做项目的时候没有后端，所以就只有在前端做，我就想到了用`localStorage`来模拟后端设置`cookies`的方法,就是判断用户进入后，`localStorage`是否有`uv`这个字段，如果没有那么就是第一次访问，就在`localStorage`中新建立一个`key`来保存用户UV,下一次访问时，通过我自己编写的一个小工具类来计算过期时间，以判断是否时一次新的UV。

  但是当时结业汇报的时候，阿里的那个老师说这个方法可以，但是还是有漏洞，就是一台主机可能会有多个用户，会导致不同的结果。

  第二个就是，`localStorage`和`sessionStorage`存在一定的兼容性问题，比如

  在隐私浏览模式下,Safari和iOS Safari包括版本10。x以及Android浏览器(不包括铬为Android)不支持设置`sessionStorage`或`localStorage`。

  本来应该用Class的方法去编写，但是编了一些，去用babel编译的时候发现会出问题。所以采用了函数的方法来整合架构