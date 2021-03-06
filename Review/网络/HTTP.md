## HTTP概述

**HTTP超文本传输协议，是位于TCP/IP协议结构下的应用层协议，是万维网数据通信的基础**

当我们访问一个网站时，需要通过统一资源定位符（uniform resource locator，URL）来定位服务器并获取资源。

```
<协议>://<域名>:<端口>/<路径>
```

一个 URL 的一般形式通常如上所示（`http://test.com/index.html` ），现在最常用的协议就是 HTTP，HTTP 的默认端口是 80，通常可以省略。

### （1）HTTP1.0特点

* **「灵活可扩展」**。一个是语法上**只规定了基本格式**，空格分隔单词，换行分隔字段等。另外一个就是传输形式上不**仅可以传输文本，还可以传输图片，视频等任意数据**。

* **「请求-应答模式」**，通常而言，就是一方发送消息，另外一方要接受消息，或者是做出相应等。

* **「可靠传输」**，HTTP是基于TCP/IP，因此把这一特性继承了下来。

* **「无状态」**，这个分场景回答即可。

### （2）HTTP1.0 缺点

1. **「无状态」**，有时候，需要保存信息，比如像购物系统，需要保留下顾客信息等等，另外一方面，有时候，无状态也会减少网络开销，比如类似直播行业这样子等，这个还是分场景来说。
2. **「明文传输」**，即协议里的报文(主要指的是头部)不使用二进制数据，而是文本形式。这让HTTP的报文信息暴露给了外界，给攻击者带来了便利。
3. **「队头阻塞」**，当http开启长连接时，共用一个TCP连接，当某个请求时间过长时，其他的请求只能处于阻塞状态，这就是队头阻塞问题。

### （3）HTTP报文格式 

HTTP 报文由请求行、首部、实体主体组成，它们之间由 CRLF（回车换行符） 分隔开。

**注意：实体包括首部(也称为实体首部)和实体主体，sp 即是空格 space**。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eba22ffaf0d4184add5ce41979b554a~tplv-k3u1fbpfcp-zoom-1.image)

请求行和首部是由 ASCII 文本组成的，实体主体是可选的，可以为空也可以是任意二进制数据。

请求报文和响应报文的格式基本相同。

**请求报文格式**：

```
<method> <request-URL> <version>
<headers>
<entity-body>
复制代码
```

**响应报文格式**：

```
<version> <status> <reason-phrase>
<headers>
<entity-body>
复制代码
```

**一个请求或响应报文由以下字段组成**：

1. 请求方法，客户端希望服务器对资源执行的动作。
2. 请求 URL，命名了所请求的资源。
3. 协议版本，报文所使用的 HTTP 版本。
4. 状态码，这三位数字描述了请求过程中所发生的情况。
5. 原因短语，数字状态码的可读版本（例如上面的响应示例跟在 200 后面的 OK，一般按规范写最好）。
6. 首部，可以有零或多个首部。
7. 实体的主体部分，可以为空也可以包含任意二进制数据。

**一个 HTTP 请求示例**：

```
GET /2.app.js HTTP/1.1
Host: 118.190.217.8:3389
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36
Accept: */*
Referer: http://118.190.217.8:3389/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
复制代码
```

**一个 HTTP 响应示例**：

```
HTTP/1.1 200 OK
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Sat, 07 Mar 2020 03:52:30 GMT
ETag: W/"253e-170b31f7de7"
Content-Type: application/javascript; charset=UTF-8
Vary: Accept-Encoding
Content-Encoding: gzip
Date: Fri, 15 May 2020 05:38:05 GMT
Connection: keep-alive
Transfer-Encoding: chunked
复制代码
```

#### 方法

| 方法    | 描述                                               |
| ------- | -------------------------------------------------- |
| GET     | 从服务器获取一份文档                               |
| HEAD    | 只从服务器获取文档的头部                           |
| POST    | 向服务器发送需要处理的数据                         |
| PUT     | 将请求的数据部分存储在服务器上                     |
| TRACE   | 对可能经过代理服务器传送到服务器上去的报文进行追踪 |
| OPTIONS | 决定可以在服务器上执行哪些方法                     |
| DELETE  | 从服务器上删除一份文档                             |

##### GET 和 HEAD

其中 GET 和 HEAD 被称为安全方法，因为它们是幂等的（如果一个请求不管执行多少次，其结果都是一样的，这个请求就是**幂等的**），类似于 POST 就不是幂等的。

HEAD 方法和 GET 方法很类似，但服务器在响应中只返回首部。这就允许客户端在未获取实际资源的情况下，对资源的首部进行检查。使用 HEAD，可以：

1. 在不获取资源的情况下了解资源的情况。
2. 通过查看响应状态码，看看某个对象是否存在。
3. 通过查看首部，了解测试资源是否被修改了。

服务器开发者必须确保返回的首部与 GET 请求所返回的首部完全相同。遵循 HTTP/1.1 规范，就必须实现 HEAD 方法。

##### PUT

与 GET 方法从服务器读取文档相反，PUT 方法会向服务器写入文档。PUT 方法的语义就是让服务器用请求的主体部分来创建一个由所请求的 URL 命名的新文档。 如果那个文档已存在，就覆盖它。

##### POST

POST 方法通常用来向服务器发送表单数据。

##### TRACE

客户端发起一个请求时，这个请求可能要穿过路由器、防火墙、代理、网关等。每个中间节点都可能会修改原始的 HTTP 请求，TRACE 方法允许客户端在最终发起请求时，看看它变成了什么样子。

TRACE 请求会在目的服务器端发起一个“环回”诊断。行程最后一站的服务器会弹回一条 TRACE 响应，并在响应主体中携带它收到的原始请求报文。 这样客户端就可以查看在所有中间 HTTP 应用程序组成的请求/响应链上，原始报文是否被毁坏或修改过。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02961ab885df4520bca840317ac102f8~tplv-k3u1fbpfcp-zoom-1.image)

TRACE 方法主要用于诊断，用于验证请求是否如愿穿过了请求/响应链。它也是一种工具，用来查看代理和其他应用程序对用户请求所产生的效果。 TRACE 请求中不能带有实体的主体部分。TRACE 响应的实体主体部分包含了响应服务器收到的请求的精确副本。

##### OPTIONS

OPTIONS 方法请求 Web 服务器告知其支持的各种功能。

##### DELETE

DELETE 方法就是让服务器删除请求 URL 所指定的资源。

#### 状态码

| 整体范围 | 已定义范围 | 分类       |
| -------- | ---------- | ---------- |
| 100~199  | 100~101    | 信息提示   |
| 200~299  | 200~206    | 成功       |
| 300~399  | 300~305    | 重定向     |
| 400~499  | 400~415    | 客户端错误 |
| 500~599  | 500~505    | 服务器错误 |

##### 300~399 重定向状态码

重定向状态码要么告诉客户端使用替代位置来访问他们感兴趣的资源，要么提供一个替代的响应而不是资源的内容。 如果资源已被移动，可以发送一个重定向状态码和一个可选的 Location 首部来告知客户端资源已被移走，以及现在在哪里可以找到它。这样，浏览器可以在不打扰使用者的情况下，透明地转入新的位置。

##### 400~499 客户端错误状态码

有时客户端会发送一些服务器无法处理的东西，例如格式错误的请求报文、一个不存在的 URL。

1. **400状态码**：请求无效

产生原因：

- 前端提交**数据的字段名称和字段类型与后台的实体没有保持一致**
- 前端提交到后台的数据应该是json字符串类型，但是**前端没有将对象JSON.stringify转化成字符串**。

解决方法：

- 对照字段的名称，保持一致性
- 将obj对象通过JSON.stringify实现序列化

2. **401状态码**：当前请求需要用户验证

3. **403状态码**：服务器已经得到请求，但是拒绝执行




##### 500~599 服务器错误状态码

有时客户端发送了一条有效请求，服务器自身却出错了。

#### 首部

首部和方法共同配合工作，决定了客户端和服务器能做什么事情。

**首部分类**：

1. 通用首部，可以出现在请求或响应报文中。
2. 请求首部，提供更多有关请求的信息。
3. 响应首部，提供更多有关响应的信息。
4. 实体首部，描述主体的长度和内容，或者资源自身。
5. 扩展首部，规范中没有定义的新首部。

##### 通用首部

有些首部提供了与报文相关的最基本信息，它们被称为通用首部。以下是一些常见的通用首部：

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faa44626f25b4010a2462748d698ac37~tplv-k3u1fbpfcp-zoom-1.image)

##### 请求首部

请求首部是只在请求报文中有意义的首部，用于说明请求的详情。以下是一些常见的请求首部：

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55684591b4284e59a11c757b7a9cebb9~tplv-k3u1fbpfcp-zoom-1.image)

##### 响应首部

响应首部让服务器为客户端提供了一些额外的信息。

##### 实体首部

实体首部提供了有关实体及其内容的大量信息，从有关对象类型的信息，到能够对资源使用的各种有效的请求方法。

例如**内容首部**，提供了与实体内容有关的特定信息，说明了其类型、尺寸以及处理它所需的其他有用信息。 另外，通用的缓存首部说明了如何或什么时候进行缓存。**实体的缓存首部**提供了与被缓存实体有关的信息。

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e542ea7c66fd4fe9af786aa2040110a8~tplv-k3u1fbpfcp-zoom-1.image)

##### cookie的作用：

- #### 保存用户登录状态。例如将用户id存储于一个cookie内，这样当用户下次访问该页面时就不需要重新登录了，现在很多论坛和社区都提供这样的功能。 cookie还可以设置过期时间，当超过时间期限后，cookie就会自动消失。因此，系统往往可以提示用户保持登录状态的时间：常见选项有一个月、三个 月、一年等。

- 跟踪用户行为。例如一个天气预报网站，能够根据用户选择的地区显示当地的天气情况。如果每次都需要选择所在地是烦琐的，当利用了 cookie后就会显得很人性化了，系统能够记住上一次访问的地区，当下次再打开该页面时，它就会自动显示上次用户所在地区的天气情况。因为一切都是在后 台完成，所以这样的页面就像为某个用户所定制的一样，使用起来非常方便

- 定制页面。如果网站提供了换肤或更换布局的功能，那么可以使用cookie来记录用户的选项，例如：背景色、分辨率等。当用户下次访问时，仍然可以保存上一次访问的界面风格。

##### Cookie如何防范XSS攻击

- XSS（跨站脚本攻击）是指攻击者在返回的HTML中嵌入javascript脚本，为了减轻这些攻击，需要在HTTP头部配上，set-cookie：

  - httponly-这个属性可以防止XSS,它会禁止javascript脚本来访问cookie。
  - secure - 这个属性告诉浏览器仅在请求为https的时候发送cookie。

  结果应该是这样的：Set-Cookie=.....

##### Doctype作用? 严格模式与混杂模式如何区分？它们有何意义?

Doctype声明于文档最前面，告诉浏览器以何种方式来渲染页面，这里有两种模式，严格模式和混杂模式。

- 严格模式的排版和 JS 运作模式是  以该浏览器支持的最高标准运行。
- 混杂模式，向后兼容，模拟老式浏览器，防止浏览器无法兼容页面。

### （3）各个版本HTTP的区别

#### HTTP 0.9

- 1991年,原型版本，功能简陋，只有一个命令GET,只支持纯文本内容，该版本已过时。

#### HTTP 1.0

- **任何格式的内容都可以发送**，这使得互联网不仅可以传输文字，还能传输图像、视频、二进制等文件。
- 除了GET命令，还引入了POST命令和HEAD**命令**。
- http请求和回应的格式改变，除了数据部分，每次通信都必须包括**头部信息**（HTTP header），用来描述一些元数据。
- 只使用 header 中的 If-Modified-Since 和 **Expires 作为缓存失效**的标准。
- **不支持断点续传，也就是说，每次都会传送全部的页面和数据**。
- **通常每台计算机只能绑定一个 IP，所以请求消息中的 URL 并没有传递主机名（hostname）**

#### HTTP 1.1

http1.1是目前最为主流的http协议版本，从1999年发布至今，仍是主流的http协议版本。

- **引入了持久连接**（ persistent connection），即TCP连接默认不关闭，可以被多个请求复用，不用声明Connection: keep-alive。长连接的连接时长可以通过请求头中的 `keep-alive` 来设置
- **引入了管道机制**（ pipelining），即在同一个TCP连接里，客户端可以连续发送多个 请求，不用等待上一个请求收到回应，进一步改进了HTTP协议的效率。
- HTTP 1.1 中新增加了 E-tag，If-Unmodified-Since, If-Match, If-None-Match 等**缓存控制标头来控制缓存失效**。
- 支持**断点续传**，通过使用请求头中的 `Range` 来实现。
- 使用了虚拟网络，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。
- 新增方法：PUT、 PATCH、 OPTIONS、 DELETE。

### （4）性能优化

#### 1. 减少 HTTP 请求

**每发起一个 HTTP 请求，都得经历三次握手建立 TCP 连接**，如果连接只用来交换少量数据，这个过程就会严重降低 HTTP 性能。所以我们可以将多个小文件合成一个大文件，从而减少 HTTP 请求次数。

其实由于持久连接（重用 TCP 连接，以消除连接及关闭时延；HTTP/1.1 默认开启持久连接）的存在，每个新请求不一定都需要建立一个新的 TCP 连接。但是，浏览器处理完一个 HTTP 请求才能发起下一个，所以在 TCP 连接数没达到浏览器规定的上限时，还是会建立新的 TCP 连接。从这点来看，减少 HTTP 请求仍然是有必要的。

#### 2. 静态资源使用 CDN

**让用户可以向更近的服务器发送请求**

内容分发网络（CDN）是一组分布在多个不同地理位置的 Web 服务器。我们都知道，当服务器离用户越远时，延迟越高。CDN 就是为了解决这一问题，在多个位置部署服务器，**让用户离服务器更近**，从而缩短请求时间。

#### 3. 善用缓存

为了避免用户每次访问网站都得请求文件，**我们可以通过添加 Expires 头来控制这一行为**。Expires 设置了一个时间，只要在这个时间之前，浏览器都不会请求文件，而是直接使用缓存。

不过这样会产生一个问题，当文件更新了怎么办？怎么通知浏览器重新请求文件？

可以通过更新页面中引用的资源链接地址，让浏览器主动放弃缓存，加载新资源。

具体做法是把资源地址 URL 的修改与文件内容关联起来，也就是说，只有文件内容变化，才会导致相应 URL 的变更，从而实现文件级别的精确缓存控制。

#### 4. 压缩文件

压缩文件可以减少文件下载时间，让用户体验性更好。

**gzip 是目前最流行和最有效的压缩方法**。**可以通过向 HTTP 请求头中的 Accept-Encoding 头添加 gzip 标识**来开启这一功能。当然，服务器也得支持这一功能。

若用 Vue 开发的项目构建后生成的 app.js 文件大小为 1.4MB，使用 gzip 压缩后只有 573KB，体积减少了将近 60%。

#### 5. 通过 max-age 和 no-cache 实现文件精确缓存

通用消息头部 `Cache-Control` 其中有两个选项：

1. `max-age`: 设置缓存存储的最大周期，超过这个时间缓存被认为过期(单位秒)。在这个时间前，浏览器读取文件不会发出新请求，而是直接使用缓存。
2. `no-cache`: 指定 no-cache 表示客户端可以缓存资源，每次使用缓存资源前都必须重新验证其有效性。

我们可以将那些长期不变的静态资源设置一个非常长的缓存时间，例如设置成缓存一年。

然后将 `index.html` 文件设置成 `no-cache`。这样每次访问网站时，浏览器都会询问 `index.html` 是否有更新，如果没有，就使用旧的 `index.html` 文件。如果有更新，就读取新的 `index.html` 文件。当加载新的 `index.html` 时，也会去加载里面新的  URL 资源。

例如 `index.html` 原来引用了 `a.js` 和 `b.js`，现在更新了变成 `a.js` 和 `c.js`。那就只会加载 `c.js` 文件。


setRequestHeader('Content-Type','application/x-www-form-urlencoded')