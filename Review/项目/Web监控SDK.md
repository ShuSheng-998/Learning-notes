# 一款简易的前端Web监控SDK

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

* 重写XMLHttpRequest和fetch方法

### 对外暴露一个Webmonitor对象

### 两个对外方法

一：addError ：此方法向插件中自定义上报错误信息，vue,react，try{}catch 的报错信息均可采用此方法上报 案例：用户可以自定义参数中对象的信息

二：addData ：上报时自定义的数据 

### 重写方法遇到的问题

平时使用的时候并不会关注底层具体的实现，通过重写，自己在测试的时候会发现很多的问题，虽然很多的问题解决不了，但是确实给了我思考的契机

### 为什么是这个结业项目

通过重写方法，提升自己的能力