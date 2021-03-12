## 一、Flex 布局是什么？

Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

任何一个容器都可以指定为 Flex 布局。

> ```css
> .box{
>   display: flex;
> }
> ```

行内元素也可以使用 Flex 布局。

> ```css
> .box{
>   display: inline-flex;
> }
> ```

Webkit 内核的浏览器，必须加上`-webkit`前缀。

> ```css
> .box{
>   display: -webkit-flex; /* Safari */
>   display: flex;
> }
> ```

注意，设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。

## 二、基本概念

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png)

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。

项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。三、容器的属性

以下6个属性设置在容器上。

> - flex-direction：row | row-reverse | column | column-reverse			主轴方向
> - flex-wrap: wrap | nowrap | wrap-reverse                                               是否换行
> - flex-flow:                                                                                                      上两者的简写：一般为 row wrap
> - justify-content    主轴上的对齐方式：flex-start   flex-end  center  space-between  space-around
> - align-items  交叉轴上的对齐方式：flex-start   flex-end  center  baseline   stretch(每个都占满一整行)
> - align-content

### align-content属性

`align-content`属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

> ```css
> .box {
>   align-content: flex-start | flex-end | center | space-between | space-around | stretch;
> }
> ```

## 三、项目的属性

以下6个属性设置在项目上。

> - `order`				  定义项目的排列顺序。数值越小，排列越靠前，默认为0。
>
> - `flex-grow`           定义项目的放大比例，默认`0`，即如果存在剩余空间，也不放大。
>
>   ​								如果所有项目的`flex-grow`属性都为1，则它们将等分剩余空间（如果有的话）。如								果一个项目的`flex-grow`属性为2，其他项目都为1，则前者占据的剩余空间将比其他								项多一倍。
>
> - `flex-shrink`       定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
>
>   ​								如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。如果一								个项目的`flex-shrink`属性为0，其他项目都为
>
> - `flex-basis`         定义了在分配多余空间之前，项目占据的主轴空间（main size）。
>
>   ​									浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本									来大小。它可以设为跟`width`或`height`属性一样的值（比如350px），则项目将占据固定空间。
>
> - `flex`       `flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。
>
> - `align-self`

### align-self属性

`align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

### 四、实战

* 分组
* 左右如何，上下如何（justify-content，align-content）
* 是否占据一整行（flex-basis：100%）
* 分组后的项目左右如何，上下如何

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071316.png)

HTML代码如下。

> ```markup
> <div class="box">
>   <div class="column">
>     <span class="item"></span>
>     <span class="item"></span>
>   </div>
>   <div class="column">
>     <span class="item"></span>
>     <span class="item"></span>
>   </div>
> </div>
> ```

CSS代码如下。

> ```css
> .box {
>   display: flex;
>   flex-wrap: wrap;
>   align-content: space-between;
> }
> 
> .column {
>   flex-basis: 100%;此项目占主轴的100%
>   display: flex;
>   justify-content: space-between;
> }
> ```

### 网格布局

***

### 5.1 基本网格布局

### flex: 1   === flex : 1 1 0%项目自动等比缩放

###  flex: 0 0 100%;  项目固定大小，100%指宽度为多余空间的最大值

最简单的网格布局，就是平均分布。在容器里面平均分配空间，跟上面的骰子布局很像，但是需要设置项目的自动缩放。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071321.png)

HTML代码如下。

> ```markup
> <div class="Grid">
>   <div class="Grid-cell">...</div>
>   <div class="Grid-cell">...</div>
>   <div class="Grid-cell">...</div>
> </div>
> ```

CSS代码如下。

> ```css
> .Grid {
>   display: flex;
> }
> 
> .Grid-cell {
>   flex: 1;  flex-grow都为1等分，flex-grow 和flex-shringk都为1自动缩放
> }		=== flex : 1 1 0%  自动等比缩放
> ```

### 5.2 百分比布局

某个网格的宽度为固定的百分比，其余网格平均分配剩余的空间。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071322.png)

HTML代码如下。

> ```markup
> <div class="Grid">
>   <div class="Grid-cell u-1of4">...</div>
>   <div class="Grid-cell">...</div>
>   <div class="Grid-cell u-1of3">...</div>
> </div>
> ```

> ```css
> .Grid {
>   display: flex;
> }
> 
> .Grid-cell {
>   flex: 1;
> }
> 
> .Grid-cell.u-full {
>   flex: 0 0 100%;
> }
> 
> .Grid-cell.u-1of2 {
>   flex: 0 0 50%;
> }
> 
> .Grid-cell.u-1of3 {
>   flex: 0 0 33.3333%;
> }
> 
> .Grid-cell.u-1of4 {
>   flex: 0 0 25%;
> }
> ```

## 5.3圣杯布局

圣杯布局（Holy Grail Layout）指的是一种最常见的网站布局。页面从上到下，分成三个部分：头部（header），躯干（body），尾部（footer）。其中躯干又水平分成三栏，从左到右为：导航、主栏、副栏。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071323.png)

HTML代码如下。

> ```markup
> <body class="HolyGrail">
>   <header>...</header>
>   <div class="HolyGrail-body">
>     <main class="HolyGrail-content">...</main>
>     <nav class="HolyGrail-nav">...</nav>
>     <aside class="HolyGrail-ads">...</aside>
>   </div>
>   <footer>...</footer>
> </body>
> ```

CSS代码如下。

> ```css
> .HolyGrail {
>   display: flex;
>   min-height: 100vh;
>   flex-direction: column;
> }
> 
> header,
> footer {
>   flex: 1;
> }
> 
> .HolyGrail-body {
>   display: flex;
>   flex: 1;
> }
> 
> .HolyGrail-content {
>   flex: 1;
> }
> 
> .HolyGrail-nav, .HolyGrail-ads {
>   /* 两个边栏的宽度设为12em */
>   flex: 0 0 12em;
> }
> 
> .HolyGrail-nav {
>   /* 导航放到最左边 */
>   order: -1;
> }
> ```

如果是小屏幕，躯干的三栏自动变为垂直叠加。

> ```css
> @media (max-width: 768px) {
>   .HolyGrail-body {
>     flex-direction: column;
>     flex: 1;
>   }
>   .HolyGrail-nav,
>   .HolyGrail-ads,
>   .HolyGrail-content {
>     flex: auto;
>   }
> }
> ```

## 5.4输入框的布局

我们常常需要在输入框的前方添加提示，后方添加按钮。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071324.png)

HTML代码如下。

> ```markup
> <div class="InputAddOn">
>   <span class="InputAddOn-item">...</span>
>   <input class="InputAddOn-field">
>   <button class="InputAddOn-item">...</button>
> </div>
> ```

CSS代码如下。

> ```css
> .InputAddOn {
>   display: flex;
> }
> 
> .InputAddOn-field {
>   flex: 1;
> }
> ```

## 悬挂式布局

有时，主栏的左侧或右侧，需要添加一个图片栏。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071325.png)

HTML代码如下。

> ```markup
> <div class="Media">
>   <img class="Media-figure" src="" alt="">
>   <p class="Media-body">...</p>
> </div>
> ```

CSS代码如下。

> ```css
> .Media {
>   display: flex;
>   align-items: flex-start;
> }
> 
> .Media-figure {
>   margin-right: 1em;
> }
> 
> .Media-body {
>   flex: 1;
> }
> ```

### 六、固定的底栏

有时，页面内容太少，无法占满一屏的高度，底栏就会抬高到页面的中间。这时可以采用Flex布局，让底栏总是出现在页面的底部。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071326.png)

HTML代码如下。

> ```markup
> <body class="Site">
>   <header>...</header>
>   <main class="Site-content">...</main>
>   <footer>...</footer>
> </body>
> ```

CSS代码如下。

> ```css
> .Site {
>   display: flex;
>   min-height: 100vh;
>   flex-direction: column;
> }
> 
> .Site-content {
>   flex: 1;
> }
> ```

### 七，流式布局

每行的项目数固定，会自动分行。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071330.png)

CSS的写法。

> ```css
> .parent {
>   width: 200px;
>   height: 150px;
>   background-color: black;
>   display: flex;
>   flex-flow: row wrap;
>   align-content: flex-start;
> }
> 
> .child {
>   box-sizing: border-box;
>   background-color: white;
>   flex: 0 0 25%;
>   height: 50px;
>   border: 1px solid red;
> }
> ```