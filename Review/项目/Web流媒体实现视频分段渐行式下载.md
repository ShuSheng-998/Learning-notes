## `viedeo`标签？

> 普通的`viedo`标签，提供的API作用很小，比如播放、暂停或更改视频播放的速度（`pause（）`和`currentTime（）`方法）。但在现代Web应用中视频播放时，用户渴望得到施展得行为实际上要复杂得多。例如，在视频质量和直播流之间切换将会非常麻烦。
>
> 所有这些网站实际上仍然使用video标签。但是，它们不只是在src属性中设置视频文件，而是使用功能更强大的Web API（[Media Source Extensions](https://link.zhihu.com/?target=https%3A//www.w3.org/TR/media-source/)）。

## Media Source Extensions

“Media Source Extensions”（通常简称为“ MSE”）是 W3C 的一种规范，当今大多数浏览器都在实现。它的创建是为了直接使用 HTML 和 JavaScript 允许那些复杂的媒体使用案例。

* Blob对象表示一个只读原始数据的类文件对象

* 这些“扩展Extension”将 `MediaSource` 对象添加到 JavaScript。**顾名思义，这将是视频的源，或更简单地说，这是代表我们视频数据的对象。**

* 对于HTML5 视频标签。我们仍然使用它的 `src` 属性。但这次，我们不直接添加视频链接，我们添加另一种url对象

* 使用W3C定义的`URL.createObjectURL()`静态方法，传入我们`new MediaSource()`建立的`MediaSource`对象，来建立一个`JavaScript`对象形式的URL

  ```js
  const videoTag = document.getElementById("my-video");
  
  // 利用new   建立MediaSource对象
  const myMediaSource = new MediaSource();
  //建立一个`JavaScript`对象形式的URL
  const url = URL.createObjectURL(myMediaSource);
  
  // 将JS形式的URL链接到video的script属性上
  videoTag.src = url;
  ```

## Source Buffers

到此，我们并没有拿到视频的真实数据。

而且，视频实际上并没有直接“推送”到 `MediaSource` 中进行播放，而是使用 `SourceBuffers`。

`MediaSource` 中包含一个或多个`SourceBuffer`的实例。每个都与一种内容类型相关联。

为了简单起见，我们只说三种可能的类型：

- 音讯
- 视频
- 音频和视频

**将视频和音频分离，还可以在服务器端分别对其进行管理。这样做会带来一些优势，我们将在后面看到。**它是这样工作的：

```js
const videoTag = document.getElementById("my-video");
const myMediaSource = new MediaSource();
const url = URL.createObjectURL(myMediaSource);
videoTag.src = url;

// 1. 在MediaSource中分别增加一个视频数据流和一个音频数据流

const audioSourceBuffer = myMediaSource
  .addSourceBuffer('audio/mp4; codecs="mp4a.40.2"');
const videoSourceBuffer = myMediaSource
  .addSourceBuffer('video/mp4; codecs="avc1.64001e"');

// 2.利用fetch方法，异步请求数据，拿到数据后，用appendBuffer(data)方法推送到视频流或音频流中

// for the audio SourceBuffer
fetch("http://server.com/audio.mp4").then(function(response) {
  // The data has to be a JavaScript ArrayBuffer
  return response.arrayBuffer();
}).then(function(audioData) {
  audioSourceBuffer.appendBuffer(audioData);
});

// the same for the video SourceBuffer
fetch("http://server.com/video.mp4").then(function(response) {
  // The data has to be a JavaScript ArrayBuffer
  return response.arrayBuffer();
}).then(function(videoData) {
  videoSourceBuffer.appendBuffer(videoData);
});
```

## 切片

video标签存在下载问题

* 我们不需要等待所有内容都下载完成后，才将其推送到`SourceBuffer`
* 我们如何在多种品质或语言之间切换
* 由于媒体制作尚未完成，如何播放直播内容

**在更高级的视频播放器中实际发生的是将视频和音频数据分为多个“片段”。这些片段的大小可以不同，但通常代表2到10秒的内容。**

在上一章的示例中，我们有一个文件代表整个音频，一个文件代表整个视频。这对于真正简单的用例就足够了，但是如果您想了解大多数流媒体网站提供的复杂性（切换语言，质量，播放实时内容等），则还不够。

**在更高级的视频播放器中实际发生的是将视频和音频数据分为多个“片段”。这些片段的大小可以不同，但通常代表2到10秒的内容。**

![img](https://pic3.zhimg.com/80/v2-1f85ef04356bbb4408909b41ae8a100a_720w.png)

然后，所有这些视频/音频片段将形成完整的视频/音频内容。这些数据的“切片”为我们之前的示例增加了全新的灵活性：我们不必一次推送全部内容，而是可以逐步推送多个分片。

> *注意：音频或视频文件可能不会在服务器端真正进行切片，客户端可能会使用Range HTTP标头代替来获取切片的文件（或者，实际上，服务器可能会根据您的请求进行任何操作您返回具体内容）。*
> *但是，这些情况是实现细节。

所有这些意味着, 我们不必等待整个音频或视频内容下载就可以开始播放。我们通常只需要第一部分。

当然，大多数播放器并不像我们在此处那样为每个视频和音频段手动执行此逻辑，但是他们遵循相同的想法：依次下载段并将其推入源缓冲区。

看到这种逻辑在现实生活中发生的一种有趣方式是，可以在Firefox / Chrome / Edge上打开网络监视器（在Linux或Windows上，键入“ Ctrl + Shift + i”，然后转到“网络”标签，在Mac上应依次为Cmd + Alt + i和“网络”），然后在您喜欢的流媒体网站中启动视频。

您应该可以看到各种视频和音频片段正在快速下载：

![img](https://pic1.zhimg.com/80/v2-f49f613f6859fbc598bcf2898ce51790_720w.jpg)

顺便说一句，您可能已经注意到，我们的段只是\被推送到源缓冲区中，而没有指示 WHERE, 参考时间正确的位置的地方进行添加。

实际上，片段的容器确实定义了应将它们放入整个媒体的时间。这样，我们不必在JavaScript中立即进行同步。

## 具体实现的问题

* 实现一个可预览的视频

实现原理：

1. 通过请求头`Range`拉取数据
2. 将数据喂给`sourceBuffer`，`MediaSource`对数据进行解码处理
3. 通过`video`进行播放

#### 怎么从图片切换到视频播放

* 原flex布局下的元素是一个容器，在容器中可以分一个更小的组件
* 在组件内设置一个标志位，当组件被`hover`的时候改变他的值，根据不同的值返回不同的组件（`img`组件或是视频小组件）

#### 数据格式

* 普通的MP4格式文件是无法通过`MediaSource`进行加载的，所以我们要后端的同学进行配合，使用转码工具`MO4Box`，将MP4格式的文件转换成`fmp4`格式，然后存储在后端

#### 组件的数据结构

```js
    this.baseUrl = './demo_dashinit.mp4';
    this.mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    this.mediaSource = null;
    this.sourceBuffer = null;


    this.cacheSeconds = 2; // 提前2s下载
    this.totalLength = 0; // 视频总共大小
    this.segmentStart = 0; // rangeStart
    this.segmentSize = 1024 * 1024 * 1; // 分段大小
```

* 数据需要原地址
* `SourceBuffer`需要确定存储的文件格式（`mimeCode`）
* 需要确定提前几秒开始下载
* 在最开始需要拿到视频的总大小

#### 需要做浏览器兼容

* 判断是否兼容`MediaSource`

  ```js
  if ('MediaSource' in window && MediaSource.isTypeSupported(this.mimeCodec)
  ```

#### 建立数据缓冲区

* ```js
  const sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeCodec); 
  // 返回sourceBuffer
  this.sourceBuffer = sourceBuffer;
  ```

#### 监听`mediasource`的`sourceopen`事件

* ```js
  mediaSource.addEventListener('sourceopen', this.sourceOpen); // 监听sourceopen事件
  ```

#### 如何判断是否需要请求分段数据了

* 使用`for`循环，以`video.buffered.length`拿到缓冲区的总长度，然后遍历到缓冲区的最后位置，用`end`函数拿到当前**缓冲区的结束偏移量，**即最终时间。

* 当  播放器到达的时间`video.currentTime`小于最终时间，且最终时间减去`video.currentTime`小于2秒时，`return true`开始请求数据，不然`return false`

* ```js
  isNeedFetch = () => {
        // 当前是否需求请求分段数据了
        for (let i = 0; i < this.video.buffered.length; i++) {
          const bufferend = this.video.buffered.end(i);//返回指定时间范围(这里是数据流缓冲区范围)的结束偏移量。
          if (this.video.currentTime < bufferend && bufferend - this.video.currentTime >= this.cacheSeconds)
            return false
        }
        return true;
      }
  ```

* 

#### 如何计算出当前分段的`range`

* 初始化时，拿到的`totalLength`

* `state`中的设置的`segmentSize`默认值

* 根据`segmentSize`和`segmentStart`（上一次的结束）两个数据相加，计算出`maxRange`

* 拿到`maxRange`和`totalLength`中的较小值（因为最后一次的`maxRange`可能会大于`totalLength`）

* ```
  return `${rangeStart}-${rangeEnd}`;
  ```

  ```js
  calculateRange = () => {
        // 计算出当前分段的range
        // return '0-1386';
        const rangeStart = this.segmentStart;
        const maxRange = this.segmentStart + this.segmentSize - 1;
        const rangeEnd = Math.min(maxRange, this.totalLength - 1);
    
        return `${rangeStart}-${rangeEnd}`;//用于设置http头的Range字段的bytes属性
      }
  ```


## 文章列表

* [为什么视频网站的视频链接地址是blob](https://juejin.cn/post/6844903880774385671)

* [web视频基础教程](https://juejin.cn/post/6913692400636395534#heading-7)

* [流媒体协议的认识](https://www.xiaotaotao.vip/2019/11/28/%E6%B5%81%E5%AA%92%E4%BD%93%E5%8D%8F%E8%AE%AE%E7%9A%84%E8%AE%A4%E8%AF%86/)

* [让html5视频支持分段渐进式下载的播放](https://blog.csdn.net/charleslei/article/details/50964176)

* [Web 视频播放前前后后](https://zhuanlan.zhihu.com/p/97678513)