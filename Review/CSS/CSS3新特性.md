## 一.过渡transition

**让一些交互效果（主要是hover动画），变得生动一些，不会显得那么生硬！**

CSS3 过渡是元素从一种样式逐渐改变为另一种的效果。必须规定两项内容：指定要添加效果的CSS属性指定效果的持续时间。

### 1-1语法

```
transition： CSS属性，花费时间，效果曲线(默认ease)，延迟时间(默认0)
```

栗子1

```
/*宽度从原始值到制定值的一个过渡，运动曲线ease,运动时间0.5秒，0.2秒后执行过渡*/
transition：width,.5s,ease,.2s
```

栗子2

```
/*所有属性从原始值到制定值的一个过渡，运动曲线ease,运动时间0.5秒*/
transition：all,.5s
```

上面栗子是简写模式，也可以分开写各个属性（这个在下面就不再重复了）

```
transition-property: width;
transition-duration: 1s;
transition-timing-function: linear;
transition-delay: 2s;
```

### 1-2transition的局限

transition的优点在于简单易用，但是它有几个很大的局限。

（1）transition需要事件触发，所以没法在网页加载时自动发生。

（2）transition是一次性的，不能重复发生，除非一再触发。

（3）transition只能定义开始状态和结束状态，不能定义中间状态，也就是说只有两个状态。

（4）一条transition规则，只能定义一个属性的变化，不能涉及多个属性。

## 二、动画animation

动画这个平常用的也很多，主要是做一个预设的动画。和一些页面交互的动画效果，结果和过渡应该一样，让页面不会那么生硬！

### 2-1.语法

```
animation：动画名称，一个周期花费时间，运动曲线（默认ease），动画延迟（默认0），播放次数（默认1），是否反向播放动画（默认normal），是否暂停动画（默认running）
```

栗子1

```
/*执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear;
```

栗子2

```
/*2秒后开始执行一次logo2-line动画，运动时间2秒，运动曲线为 linear*/
animation: logo2-line 2s linear 2s;
```

栗子3

```
/*无限执行logo2-line动画，每次运动时间2秒，运动曲线为 linear，并且执行反向动画*/
animation: logo2-line 2s linear alternate infinite;
```

还有一个重要属性

```
animation-fill-mode : none | forwards | backwards | both;
/*none：不改变默认行为。    
forwards ：当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。    
backwards：在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。 
both：向前和向后填充模式都被应用。  */      
```

### 2-2基本用法

首先，CSS Animation需要指定动画一个周期持续的时间，以及动画效果的名称。

> ```css
> div:hover {
>   animation: 1s rainbow;
> }
> ```

上面代码表示，当鼠标悬停在div元素上时，会产生名为rainbow的动画效果，持续时间为1秒。为此，我们还需要用keyframes关键字，定义rainbow效果。

> ```css
> @keyframes rainbow {
>   0% { background: #c00; }
>   50% { background: orange; }
>   100% { background: yellowgreen; }
> }
> ```

上面代码表示，rainbow效果一共有三个状态，分别为起始（0%）、中点（50%）和结束（100%）

## 三、形状转换transform

这一部分，分2d转换和3d转换。有什么好玩的，下面列举几个！

### 3-1.语法

transform:适用于2D或3D转换的元素
transform-origin：转换元素的位置（围绕那个点进行转换）。默认(x,y,z)：(50%,50%,0)

### 3-2.实例

transform:rotate(30deg);

![clipboard.png](https://segmentfault.com/img/bVTdyC?w=284&h=218)

transform:translate(30px,30px);

![clipboard.png](https://segmentfault.com/img/bVTdAC?w=501&h=450)

transform:scale(.8);

![clipboard.png](https://segmentfault.com/img/bVTdAT?w=404&h=373)

transform: skew(10deg,10deg);

![clipboard.png](https://segmentfault.com/img/bVTdBj?w=280&h=160)

transform:rotateX(180deg);

![clipboard.png](https://segmentfault.com/img/bVTdHv?w=142&h=97)

transform:rotateY(180deg);

![clipboard.png](https://segmentfault.com/img/bVTdHA?w=142&h=97)

transform:rotate3d(10,10,10,90deg);

![clipboard.png](https://segmentfault.com/img/bVTdHU?w=182&h=114)

## 四.阴影

以前没有css3的时候，或者需要兼容低版本浏览器的时候，阴影只能用图片实现，但是现在不需要，css3就提供了！

### 4-1.语法

```
box-shadow: 水平阴影的位置 垂直阴影的位置 模糊距离 阴影的大小 阴影的颜色 阴影开始方向（默认是从里往外，设置inset就是从外往里）;
```

### 4-2.栗子

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title></title> 
<style> 
div
{
    width:300px;
    height:100px;
    background:#09f;
    box-shadow: 10px 10px 5px #888888;
}
</style>
</head>
<body>

<div></div>

</body>
</html>
```

运行效果

![clipboard.png](https://segmentfault.com/img/bVTd9F?w=364&h=151)

## 五、边框

### 5-1.边框图片

#### 5-1-1.语法

border-image: 图片url 图像边界向内偏移 图像边界的宽度(默认为边框的宽度) 用于指定在边框外部绘制偏移的量（默认0） 铺满方式--重复（repeat）、拉伸（stretch）或铺满（round）（默认：拉伸（stretch））;

#### 5-1-2.栗子

边框图片（来自菜鸟教程）

![clipboard.png](https://segmentfault.com/img/bVTefk?w=81&h=81)

代码

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<style>
.demo {
    border: 15px solid transparent;
    padding: 15px;   
    border-image: url(border.png);
    border-image-slice: 30;
    border-image-repeat: round;
    border-image-outset: 0;
}
</style>
</head>
<body>
    <div class="demo"></div>
</body>
</html>
```

### 5-2.边框圆角

#### 5-2-1.语法

```
border-radius: n1,n2,n3,n4;
border-radius: n1,n2,n3,n4/n1,n2,n3,n4;
/*n1-n4四个值的顺序是：左上角，右上角，右下角，左下角。*/
```

#### 5-2-2.栗子

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title></title> 
<style> 
div
{
    border:2px solid #a1a1a1;
    padding:10px 40px; 
    background:#dddddd;
    text-align:center;
    width:300px;
    border-radius:25px 0 25px 0;
}
</style>
</head>
<body>
<div>border-radius</div>
</body>
</html>
```

运行结果

![clipboard.png](https://segmentfault.com/img/bVTegF?w=486&h=82)

## 六、背景

这一块主要讲css3提供背景的三个属性

### background-clip

默认情况（从边框开始绘制）:border-box

从padding开始绘制（显示），不算border,，相当于把border那里的背景给裁剪掉！（background-clip: padding-box;）

只在内容区绘制（显示），不算padding和border，相当于把padding和border那里的背景给裁剪掉！（background-clip: content-box;）

### background-origin

引用菜鸟教程的说法：background-Origin属性指定background-position属性应该是相对位置

![图片描述](https://segmentfault.com/img/bVZGAM?w=800&h=506)

### background-size

这个相信很好理解，就是制定背景的大小

### 多张背景图

就是在一张图片，使用多张背景图片，代码如下！
html

```
<p>两张图片的背景</p>
<div>
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
</div>
```

css

```
div
{
    border:1px dashed black;
    padding:35px;
    background-size: contain;
    background:url('test.jpg') no-repeat left,url(logo.png) no-repeat right;
}
```

![clipboard.png](https://segmentfault.com/img/bVTglS?w=999&h=199)

## 七、反射

这个也可以说是倒影，用起来也挺有趣的。

### 7-1.语法

```
-webkit-box-reflect:方向[ above-上 | below-下 | right-右 | left-左 ]，偏移量，遮罩图片
```

### 7-2.下倒影

html

```
<p>下倒影</p>
<p class="reflect-bottom-p"><img src="test.jpg" class="reflect-bottom"></p>
```

css

```
.reflect-bottom-p {
    padding-bottom: 300px;
}
        
.reflect-bottom {
    -webkit-box-reflect: below;
}   
```

![clipboard.png](https://segmentfault.com/img/bVTeoE?w=518&h=669)

### 7-2.右倒影（有偏移）

![clipboard.png](https://segmentfault.com/img/bVTeoU?w=994&h=351)

html

```
<p>右倒影同时有偏移</p>
<p><img src="test.jpg" class="reflect-right-translate"></p>
```

css

```
.reflect-right-translate {
    -webkit-box-reflect: right 10px;
}
```

### 7-3.下倒影（渐变）

![clipboard.png](https://segmentfault.com/img/bVTepo?w=507&h=668)

html

```
<p>下倒影（渐变）</p>
<p class="reflect-bottom-p"><img src="test.jpg" class="reflect-bottom-mask"></p>
```

css

```
reflect-bottom-mask {
    -webkit-box-reflect: below 0 linear-gradient(transparent, white);
}
```

### 超出省略号

这个其实有三行代码，禁止换行，超出隐藏，超出省略号
html

```
<div>This is some long text that will not fit in the box</div>
```

css

```css
div
{
    width:200px; 
    border:1px solid #000000;
    overflow:hidden;		//1
    white-space:nowrap; 	//2
    text-overflow:ellipsis;	//3
}
```

运行结果

![clipboard.png](https://segmentfault.com/img/bVTgqd?w=292&h=42)

## 八、渐变

## 九、栅格布局grid

## 十、多列布局

这一块，我也是了解过，我觉得多列应该还是挺有用的。虽然我没在项目中用过，下面我简单说下！举个例子！这个属性，建议加私有前缀，兼容性有待提高！
html

```
<div class="newspaper">
当我年轻的时候，我梦想改变这个世界；当我成熟以后，我发现我不能够改变这个世界，我将目光缩短了些，决定只改变我的国家；当我进入暮年以后，我发现我不能够改变我们的国家，我的最后愿望仅仅是改变一下我的家庭，但是，这也不可能。当我现在躺在床上，行将就木时，我突然意识到：如果一开始我仅仅去改变我自己，然后，我可能改变我的家庭；在家人的帮助和鼓励下，我可能为国家做一些事情；然后，谁知道呢?我甚至可能改变这个世界。
</div>
```

css

```
.newspaper
{
    column-count: 3;
    -webkit-column-count: 3;
    -moz-column-count: 3;
    column-rule:2px solid #000;
    -webkit-column-rule:2px solid #000;
    -mox-column-rule:2px solid #000;
}    
```

![clipboard.png](https://segmentfault.com/img/bVTgRx?w=587&h=163)

## 十一、媒体查询

媒体查询，就在监听屏幕尺寸的变化，在不同尺寸的时候显示不同的样式！在做响应式的网站里面，是必不可少的一环！不过由于我最近的项目都是使用rem布局。所以媒体查询就没怎么用了！但是，媒体查询，还是很值得一看的！说不定哪一天就需要用上了！

栗子代码如下

```css
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title></title> 
<style>
body {
    background-color: pink;
}
@media screen and (max-width: 960px) {	//大于960px不起作用
    body {
        background-color: darkgoldenrod;
    }
}
@media screen and (max-width: 480px) {//大于480px不起作用
    body {
        background-color: lightgreen;
    }
}
</style>
</head>
<body>

<h1>重置浏览器窗口查看效果！</h1>
<p>如果媒体类型屏幕的可视窗口宽度小于 960 px ，背景颜色将改变。</p>
<p>如果媒体类型屏幕的可视窗口宽度小于 480 px ，背景颜色将改变。</p>

</body>
</html>
```

运行效果

![clipboard.png](https://segmentfault.com/img/bVTgPW?w=1022&h=157)