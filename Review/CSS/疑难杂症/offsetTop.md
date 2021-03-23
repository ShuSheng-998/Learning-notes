### 1.offsetLeft和offsetTop

网上查到的一些花里胡哨的说法真的是看得我蒙圈，这里我们来说的通俗一些。

这两个都是**只读属性**。offsetLeft从字面意思上理解，就是以**父元素**作为参照点（父元素的定位不能是static），当前元素相对于父元素左边的偏移量。那么offsetTop就是以父元素为参照物，当前元素相对于父元素上边的偏移量。如果没有父元素那么参照点就是body。

![img](https://user-gold-cdn.xitu.io/2018/4/1/162804163d195550?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

这里要注意一点，如果当前定位元素本身是固定定位(position:fixed;)，那么就别费心找爹了，返回的是当前元素与可视窗口的距离。

**offsetLeft/offsetTop和style.left/style.top的区别**

style.left/style.top和offsetLeft/offsetTop的功能一样，那么它们有什么区别呢？

1.返回值不一样：style.left/style.top返回的是字符串，带了单位（px）的，而offsetLeft/offsetTop只返回数字（小数会四舍五入）。

2.可读写性不同：offsetLeft/offsetTop只读，而style.left/style.top 可读写。

3.若是没有给 HTML 元素指定过 top 样式，则 style.top 返回的是空字符串（而且必须要定义在html里，如果定义在css里，style.left的值仍然为空，这也是个坑啊，大家谨慎）。

### 2.offsetWidth和offsetHeight

这两个也是**只读属性**，先上公式：**offsetHeight || offsetWidth = boder + padding + content（不包括margin）**

![img](https://user-gold-cdn.xitu.io/2018/4/1/16280300d2cbc0ad?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

相信大家看了图和公式都很明白了，这里就不再赘述了。

**offsetHeight/offsetWidth和style.height/style.width的区别**

1.返回值不一样：offsetHeight/offsetWidth返回纯数字（小数会四舍五入），style.height/style.width返回字符串，带单位（px）。

2.可读写性不一样：offsetHeight/offsetWidth只读，style.height/style.width可读写。

3.style.height/style.width是不包含边框的哦。还是用和公式表示一下：offsetWidth = style.width + style.padding + style.border

4.如果没有为元素设置高度，offsetHeight会根据内容获取高度值，style.height会返回undefind

5.style.width仅仅能返回在HTML中定义的内部样式表的width属性值，如果定义在CSS中就获取不到。

### 3.clientWidth和clientHeight

**只读属性**，返回当前节点的**可视宽度**和**可视高度**（不包括边框、外边距）（包括内边距）clientHeight = topPadding + bottomPadding+ height - scrollbar.height。

### 4.scrollTop、scrollLeft、scrollWidth、scrollHeight

scrollTop和scrollLeft是**可读写属性** 。scrollTop：返回网页滚动条垂直方向滚去的距离； scrollLeft：返回网页滚动条水平方向滚去的距离；

scrollWidth和scrolltHeight是**只读属性**，返回当前节点的实际宽度和实际高度（不包括边框）,没有滚动条时和clientWidth和clientHeight一样

![img](https://user-gold-cdn.xitu.io/2018/4/1/1628055d0479d7c5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 5.event.clientX、event.clientY、event.pageX、event.pageY

event.clientX /event.clientY是目标点距离浏览器可视范围的X轴/Y轴坐标

event.pageX /event.pageY 是目标点距离document最左上角的X轴/Y轴坐标

![img](https://user-gold-cdn.xitu.io/2018/4/1/1628064e83bb382a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 6.innerHeight/innerWidth和outerHeight/outerWidth

innerHeight/innerWidth为**只读属性**，返回窗口文档显示区的高度和宽度，不包括菜单栏、工具栏和滚动条的宽高。（ 注：IE不支持这些属性，它用document.documentElement 或document.body 的 clientWidth和 clientHeight属性作为替代。）

outerHeight/outerWidth为**可读写属性**，设置或返回一个窗口的高度和宽度，包括所有界面元素（如工具栏/滚动条）。


作者：太阳当空照我对花儿笑v
链接：https://juejin.cn/post/6844904133921619982
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。