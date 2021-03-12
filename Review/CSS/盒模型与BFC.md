### CSS盒模型

***

#### 1. W3C 标准盒模型：

#### *属性width,height只包含内容content，不包含border和padding。*

在当前W3C标准中盒模型是可以通过box-sizing自由的进行切换的。

box-sizing :	content-box | border-box ， 分别设置盒模型为标准模型（`content-box`）和IE模型（`border-box`）。

#### 所以说，盒子的大小为content+padding+border即内容的(width)+内边距的再加上边框，而不加上margin。很多时候，我们会错误地把margin算入，若那样的话，上面这种情形盒子的大小应该是260x270，但实际情况并不是这样的。

#### 2. IE 盒模型：

#### *属性width,height包含border和padding，指的是content+padding+border。*

在ie8+浏览器中使用哪个盒模型可以由**box-sizing**(CSS新增的属性)控制，默认值为content-box，即标准盒模型；如果将box-sizing设为border-box则用的是IE盒模型。如果在ie6,7,8中DOCTYPE缺失会触发IE模式。


##### 我们在编写页面代码时应尽量使用标准的W3C模型(需在页面中声明DOCTYPE类型)，这样可以避免多个浏览器对同一页面的不兼容。

##### 因为若不声明DOCTYPE类型，IE浏览器会将盒子模型解释为IE盒子模型，FireFox等会将其解释为W3C盒子模型；**若在页面中声明了DOCTYPE类型，所有的浏览器都会把盒模型解释为W3C盒模型。**

### JS中如何获取盒模型的宽高

***

1. `dom.style.width/height` 只能取到行内样式的宽和高，style标签中和link外链的样式取不到。
2. `dom.currentStyle.width/height` 取到的是最终渲染后的宽和高，只有IE支持此属性。
3. `window.getComputedStyle(dom).width/height` 同（2）但是多浏览器支持，IE9以上支持。
4. `dom.getBoundingClientRect().width/height` 也是得到渲染后的宽和高，大多浏览器支持。IE9以上支持，除此外还可以取到相对于视窗的上下左右的距离

### 外边距重叠

***

当两个垂直外边距相遇时，他们将形成一个外边距，合并后的外边距高度等于两个发生合并的外边距的高度中的较大者。**注意**：只有普通文档流中块框的垂直外边距才会发生外边距合并，行内框、浮动框或绝对定位之间的外边距不会合并。

**BFC(Block Formatting Context)**：块级格式化上下文。
BFC决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。当设计到可视化布局的时候，BFC提供了一个环境，HTML元素在这个环境中按照一定的规则进行布局。一个环境中的元素不会影响到其他环境中的布局。

**BFC的原理（渲染规则）**

1. BFC里元素垂直方向的边距会发生重叠。属于不同BFC外边距不会发生重叠
2. BFC元素是一个独立的容器，外面的元素不会影响里面的元素。里面的元素也不会影响外面的元素。
3. BFC的区域不会与浮动元素的布局重叠。
4. 计算BFC高度的时候，浮动元素也会参与计算(清除浮动)

**如何创建BFC**

1. overflow不为visible;
2. float的值不为none；
3. position的值不为static或relative；
4. display属性为inline-blocks,table,table-cell,table-caption,flex,inline-flex;

说了这么多规则，放几个实类出来看看。

```
    <section id="margin">
        <style>
            * {
                padding: 0;
                margin: 0;
            }
            #margin {
                background: pink;
                overflow: hidden;
            }
            p {
                margin: 15px auto 25px;
                background: red;
            }
        </style>
        <p>1</p>
        <div style="overflow: hidden">
            <p>2</p>
        </div>
        <p>3</p>
        <p>4</p>
    </section>
```

请看这里的第二个p元素<p>2</p>他被一个父元素包裹，并且父元素有 `overflow:hidden` 样式，前面的如何创建BFC的第一条就说了 `overflow:hidden` 可以创建一个BFC。结果如下图所示。

![图7.BFC外边距不会重叠](https://segmentfault.com/img/remote/1460000013069525)

我们看这里的2，它的上下外边距都没有与1和3发生重叠，但3与4外边距发生了重叠。这就解释了BFC创建了一个独立的环境，**这个环境中的元素不会影响到其他环境中的布局，所以BFC内的外边距不与外部的外边距发生重叠。**

------

再看看下面的列子：

```
    <section id="layout">
        <style media="screen">
            #layout {
                background: red;
            }
            #layout .left {
                float: left;
                width: 100px;
                height: 100px;
                background: pink;
            }
            #layout .right {
                height: 110px;
                background: #ccc;
            }
        </style>
        <div class="left"></div>
        <div class="right"></div>
    </section>
```

效果如下：
![图8.BFC区域不与浮动元素布局重叠](https://segmentfault.com/img/remote/1460000013069526)

写过前端页面的我们肯定遇到过这种情况，这里其实是浮动元素叠在 `.right` 元素的上面，如果我们想让.right元素不会延伸到 float元素怎么办,其实我们在.right元素上加 `overflow:hidden` （用其他的方式创建BFC也可以）创建BFC就可以解决。**因为BFC不会与浮动元素发生重叠。**

![图9.增加BFC不与浮动元素重叠](https://segmentfault.com/img/remote/1460000013069527)

------

还有一种情况很常见，就是由于子元素浮动，导致父元素的高度不会把浮动元素算在内，**那么我们在父元素创建BFC就可以让可以让浮动元素也参与高度计算**撑开容器的高度，清楚浮动