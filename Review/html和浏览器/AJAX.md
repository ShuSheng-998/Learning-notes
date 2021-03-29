## 一、什么是AJAX？

AJAX是“Asynchronous JavaScript And **XML**”的缩写(即：异步的JavaScript和XML)，是一种**实现无页面刷新获取服务器数据的混合技术。**

让我们停下来好好思考一下这个定义，注意那些醒目的蓝色文字，它们出现在那里不是没有理由的。

好的，相信你已经对这个定义有些印象，现在让我对那些蓝色的文字做些说明：

### （一）XML是什么？

XML是“Extensible Markup Language”的缩写（即：可拓展标记语言），是一种特征类似HTML，用来描述数据是什么，并承载数据的标记语言，你可以在中文的[维基百科](https://zh.wikipedia.org/wiki/XML)中看到更完整的解释，但我们现在只要知道它是一种用来承载数据的语言就足够了。

而JSON仅仅是一种数据格式，在JSON发明之前，人们大量使用XML作为数据传输的载体，也正因如此，AJAX技术的最后一个字母为“X”。而如今情况则发生了些变化，JSON这种类似于字符串对象的轻量级的数据格式越来越受到开发者青睐

## 一、获取数据

我们知道AJAX用来在项目中以阻止页面刷新的方式获取数据，那么数据从哪里来呢？我们又怎么知道如何获取这些数据？答案是我们通常使用**API**与各式各样的数据库交互。

“API”是“Application Programming Interface”(即：应用程序接口)的缩写，你可以想象一些数据是开放的并且在等待被使用，而我们获取这些数据的方式便是使用API。API通常的形式是一个URL，并提供指定的参数名和参数值用来帮助你定位所要获取的数据。

还记得我们提过AJAX需要服务器端的相应设置吗？我们之后会再来谈这一点。

------

## 二、AJAX技术的核心 - XMLHttpRequest对象

让我们先把服务器端的设置抛在一边，聚焦AJAX技术的核心环节：`XMLHttpRequest`对象。

`XMLHttpRequest`对象是浏览器提供的一个API，用来顺畅地向服务器发送请求并解析服务器响应，当然整个过程中，浏览器页面不会被刷新。它将是本文接下来的主角，让我们先站在较高的层次，对该对象有一个全局的概览：

1. `XMLHttpRequest`只是一个JavaScript对象，确切的说，是一个**构造函数**。换句话说，它一点也不神秘，它的特殊之处只在于它是由客户端(即浏览器)提供的（而不是JavaScript原生的），除此之外，它有属性，有方法，需要通过`new`关键字进行实例化，我们只需掌握它们就好；
2. `XMLHttpRequest`对象是不断被扩展的。随着XML对象被广泛的接收，W3C也开始着手制定相应的标准来规范其行为。目前，`XMLHttpRequest`有两个级别：1级提供了XML对象的实现细节，2级进一步发展了XML对象，额外添加了一些方法，属性和数据类型。但是，并不是所有浏览器都实现了XML对象2级的内容（并不意外，对吧？）；

让我们先从剖析`XMLHttpRequest`实例的属性和方法开始，先创建一个XML对象的实例：

```
const xhr = new XMLHttpRequest()
复制代码
```

该实例的属性，方法有：

### 方法

- `.open()`：准备启动一个AJAX请求；
- `.setRequestHeader()`：设置请求头部信息；
- `.send()`：发送AJAX请求；
- `.getResponseHeader()`: 获得响应头部信息；
- `.getAllResponseHeader()`：获得一个包含所有头部信息的长字符串；
- `.abort()`：取消异步请求；

### 属性

- `.responseText`：包含响应主体返回文本；
- `.responseXML`：如果响应的内容类型时`text/xml`或`application/xml`，该属性将保存包含着相应数据的XML DOM文档；
- `.status`：响应的HTTP状态；
- `.statusText`：HTTP状态的说明；
- `.readyState`：表示“请求”/“响应”过程的当前活动阶段

另外，浏览器还为该对象提供了一个`onreadystatechange`监听事件，每当XML实例的`readyState`属性变化时，就会触发该事件的发生。

至此，关于XMLHttpRequest实例对象的属性方法就全部罗列完毕了，接下来，我们将更进一步的探究如何使用这些方法，属性完成发送AJAX请求的流程。

------

## 三、准备AJAX请求

要想与服务器交互，我们首先需要回答以下问题：

- 我们是要获取数据还是存储数据？  --表现为请求方式的不同：`GET`或`POST`；
- 向哪里发出请求？  --即相应API地址；
- 以何种方式等待响应？  --有“**同步**”和“**异步**”两种选择；（网络传输是一个过程，请求和响应不是同时发生的。）

而XMLHttpRequest实例的`.open()`方法的作用就是用来回答以上三个问题。`.open()`方法接收三个参数：**请求方式**，**请求URL地址**和**是否为异步请求的布尔值**。

下面是一个`.open()`方法调用的例子：

```
// 该段代码会启动一个针对“example.php”的GET同步请求。
xhr.open("get", "example.php", false)
复制代码
```

相当于开始做饭前，将工具准备齐备，将菜洗好，`.open()`方法也同样出色地完成了发送AJAX请求的准备工作。

现在，让我们再深入聊聊一些准备工作的细节：

### （一）GET请求 与 POST请求

- GET请求

GET请求用于**获取数据**，有时候我们需要获取的数据需要通过“查询参数”进行定位，在这种情况下，我们会将查询参数追加到URL的末尾，令服务器解析。

查询参数是指一个由`?`号起始，由`&`符号分割的包含相应键值对的字符串。用来告知浏览器所要查询的特定资源。

```
const query = "example.php?name=tom&age=24" // "?name=tom&age=24"即是一个查询参数
复制代码
```

需要注意的是，查询字符串中每个参数的名和值都必须使用encodeURIComponent()进行编码（这是因为URL中有些字符会引起歧义，例如“&”）。

- POST请求

POST请求用于**向服务器发送应该被保存的数据**，因此POST请求天然比GET请求多需要一份**需要被保存的数据**。那么这些数据应该放在何处呢？毕竟，我们的`.open()`方法接收的三个参数都没有合适的位置。

答案是需要发送的数据会作为`.send()`方法的参数最终被发往服务器，该数据可以是任意大小，任意类型。

这里需要注意以下两点：

1. `.send()`方法的参数是不可为空的，也就是说，对于不需要发送任何数据的GET请求，也需要在调用`.send()`方法时，向其传入`null`值；
2. 目前为止，我们知道了两种向服务器发送数据的方式：**表单提交**以及**发送POST请求**，要注意服务器对待这两种方式并不一视同仁，这意味着服务器需要有相应的代码专门处理POST请求发送来的原始数据。

但好在我们可以通过POST请求模拟表单提交，只需要简单两步：

1. 设置请求头参数：`Content-Type: application/x-www-form-urlencoded`（表单提交时的内容类型）；
2. 将表单数据序列化为查询字符串形式，传入`.send()`方法；

### （二）请求URL地址

这里需要注意若使用相对路径，请求URL是**相对于执行代码的当前页面**。

### （三）同步请求与异步请求

人们通常认为AJAX是异步的，实际上并非如此，AJAX是避免页面在获取数据后刷新的一种技术，至于等待服务器响应的方式是同步还是异步，需要开发人员结合业务需求进行配置（虽然通常是异步的）。

你可能会好奇，什么时候我们需要使用同步的AJAX？就我个人经验而言，似乎很难找到相应的场景。Stack Overflow上有一个类似的问题，有兴趣的不妨点击[查看](https://stackoverflow.com/questions/4316488/when-is-it-appropriate-to-use-synchronous-ajax)。

最后我们再简单解释一下“同步”等待响应与“异步”等待响应的区别：“同步”意味着一旦请求发出，任何后续的JavaScript代码不会再执行，“异步”则是当请求发出后，后续的JavaScript代码会继续执行，当请求成功后，会调用相应的回调函数。

------

## 四、设置请求头

每个HTTP请求和响应都会带有相应的头部信息，包含一些与数据，收发者网络环境与状态等相关信息。XMLHttpRequest对象提供的`.setRequestHeader()`方法为开发者提供了一个操作这两种头部信息的方法，并允许开发者自定义请求头的头部信息。

默认情况下，当发送AJAX请求时，会附带以下头部信息：

- `Accept`：浏览器能够处理的内容类型；
- `Accept-Charset`: 浏览器能够显示的字符集；
- `Accept-Encoding`：浏览器能够处理的压缩编码；
- `Accept-Language`：浏览器当前设置的语言；
- `Connection`：浏览器与服务器之间连接的类型；
- `Cookie`：当前页面设置的任何Cookie；
- `Host`：发出请求的页面所在的域；
- `Referer`：发出请求的页面URI；
- `User-Agent`：浏览器的用户代理字符串；

**注意**，部分浏览器不允许使用`.setRequestHeader()`方法重写默认请求头信息，因此自定义请求头信息是更加安全的方法：

```
// 自定义请求头
xhr.setRequestHeader("myHeader", "MyValue")
复制代码
```

------

## 五、发送请求

到此为止，我们已经完全做好了发送请求的所有准备：利用`.open()`方法确定了请求方式，等待响应的方式和请求地址，甚至还通过`.setRequestHeader()`自定义了响应头，接下来就到了最激动人心的时刻：使用`.send()`方法，发送AJAX请求！

```
// 发送AJAX请求！
const xhr = new XMLHttpRequest()
xhr.open("get", "example.php", false)
xhr.setRequestHeader("myHeader", "goodHeader")
xhr.send(null)
复制代码
```

呃，简单的有些令人尴尬不是吗？换个POST请求试试看：

```
// 发送AJAX请求！
const xhr = new XMLHttpRequest()
xhr.open("post", "example.php", false)
xhr.setRequestHeader("myHeader", "bestHeader")
xhr.send(some_data)
复制代码
```

额..，总觉得还是差点什么？放轻松伙计，因为我们只是发出了请求，还没有**处理响应**，我们这就来看看它。

------

## 六、处理响应

让我们直接看看如何处理一个同步的GET请求响应：

```
const xhr = new XMLHttpRequest()
xhr.open("get", "example.php", false)
xhr.setRequestHeader("myHeader", "goodHeader")
xhr.send(null)
// 由于是同步的AJAX请求，因此只有当服务器响应后才会继续执行下面的代码
// 因此xhr.status的值一定不为默认值
if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    alert(xhr.responseText)
} else {
    alert("Request was unsuccessful: " + xhr.status)
}
复制代码
```

上面的代码不难理解，我们通过之前提到的xhr`.status`属性（如果你忘记了，它存储着响应的HTTP状态）判断请求是否成功，如果成功的话，我们将读取xhr`.responseText`属性中存储的返回值。但是，当我们的请求为异步时，问题就稍微变得复杂了，由于是异步的请求，在`xhr.send(null)`语句被执行后，JavaScript引擎会紧接着执行下面的判断语句，而这时由于尚未来得及响应，我们注定会得到一个默认的xhr.status值，因此，我们永远都不可能获取请求的资源了。

如何解决这个问题？答案是通过为XMLHTTPRequest实例添加`onreadystatechange`事件处理程序（当然你也可以直接使用DOM2级规范规定的`.addEventListener()`方法，但是注意，IE8是不支持该方法的）。

xhr实例的`readystatechange`事件会监听xhr`.readyState`属性的变化，你可以将这个属性想象为一个计数器，随着AJAX流程的推进而不断累加，其可取的值如下：

- **0**：未初始化 -- 尚未调用`.open()`方法；
- **1**：启动 -- 已经调用`.open()`方法，但尚未调用`.send()`方法；
- **2**：发送 -- 已经调用`.send()`方法，但尚未接收到响应；
- **3**：接收 -- 已经接收到部分响应数据；
- **4**：完成 -- 已经接收到全部响应数据，而且已经可以在客户端使用了；

有了这个时间处理程序对AJAX进程做监听，剩下的事就简单多了，一个异步的GET请求代码如下：

```
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = () => {
    if (xhr.readystate == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            alert(xhr.responseText)
        } else {
            alert("Request was unsuccessful: " + xhr.status)
        }
    }
}
xhr.open("get", "example.php", true)
xhr.send(null)
复制代码
```

**注意**：为了确保跨浏览器的兼容性，必须要在调用`.open()`方法之前指定事件处理程序，仔细想想也有道理，毕竟`.open()`方法的执行也包含在该事件处理程序的监听范围之内对吧？

------

## 七、取消异步请求

有时候，你可能需要在接收到响应之前取消异步请求，这时候，你需要调用`.abort()`方法。

该方法会令XHR对象实例停止触发事件，并且不再允许访问任何和响应有关的对象属性。没了监控器，我们再也没法判断响应了不是吗？

但是需要注意的是，当终止AJAX请求后，你需要手动对XHR对象实例进行解绑以释放内存空间。

------

🎉🎉 恭喜你！到这里你已经学会了所有的AJAX基础知识，你知道了AJAX是什么，存在的意义以及如何真正发起一个AJAX请求并接收响应，你已经是一个AJAX大师！祝贺你！太棒了！🎉🎉

------







🤜 真棒，尊敬的AJAX大师，你居然还没有离开，那么我将传授你最后一部分AJAX秘籍，帮助你成为一个真正的AJAX忍者，这是你的坚持赢得的！

## 八、秘籍：XMLHttpRequest 2级

还记得我们一开始有提到，W3C提出了XMLHttpRequest 2级规范吗？虽然并非所有的浏览器都实现了该规范所规定的内容，但还是有一些内容被全部或大多数浏览器所实现。想成为AJAX忍者？往下看吧。

提示：在这一部分，你将会看到很多有关浏览器兼容性的文字，希望你不要觉得枯燥，毕竟这可是忍者的修行，对吧？

### （一）FormData 类型

FormData是XMLHttpRequest 2级为我们提供的新的数据类型（构造函数），还记的我们之前是如何伪装一个POST请求为一个表单提交吗？FormData令这一过程变得更加轻松，因为XHR对象能够识别传入的数据类型是FormData的实例，并自动配置适当的头部信息。

FormData的使用方式如下：

```
// 添加数据
let data1 = new FormData()
data1.append("name", "Tom")
xhr.send(data1)

// 提取表单数据
let data2 = new FormData(document.forms[0])
xhr.send(data2)
复制代码
```

除此之外，FormData的另一个好处是相较于传统的AJAX请求，它允许我们上传二进制数据（图片，视频，音频等），具体详情可查看该[链接](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects)。

FormData的浏览器兼容性：

- 桌面端
  - IE 10+ 与其他浏览器均支持
- 移动端
  - Android，Firefox Mobile，OperaMobile均支持，其余浏览器未知

### （二）超时设定

当我们发送一个AJAX请求，却迟迟得不到服务器响应，这种感觉是很糟糕的。为了缓解这种糟糕的感觉，XMLHttpRequest 2级规范为我们提供了一个额外的属性和事件监听事件：

- `timeout`属性：设置超时时间，单位为毫秒；
- `timeout`事件：当响应时间超出实例对象timeout属性时被触发；

使用方式如下：

```
// 当响应时间超过1秒时，请求中止，弹出提示框
xhr.timeout = 1000
xhr.ontimeout = () => { alert("Request did not return in a second.") }
复制代码
```

注意，当请求终止时，会调用`ontimeout`事件处理程序，此时xhr的`readyState`属性的值可能已变为4，这意味着会继续调用`onreadystatechange`事件处理程序，但是当超时中止请求后再访问xhr的`status`属性会使浏览器抛出一个错误，因此需要将检查`status`属性的语句放入`try-catch`语句中。

虽然带来了一些麻烦，但是我们却对XMLHttpRequest对象有了更多的控制。

浏览器兼容性：

- 桌面端
  - IE 10+ 与其他浏览器均支持
- 移动端
  - IE Mobile 10+ 与其他浏览器均支持

