### 一、什么决定了层叠顺序

1. 首先，`z-index`属性值并不是在任何元素上都有效果。它**仅在**定位元素（定义了`position`属性，且属性值为非`static`值的元素）上有效果。

2. 判断元素在`Z轴`上的堆叠顺序，不仅仅是直接比较两个元素的`z-index`值的大小，这个堆叠顺序实际由元素的**层叠上下文**、**层叠等级**共同决定。

### 二、什么是“层叠上下文”

层叠上下文(stacking context)，是HTML中一个三维的概念。在CSS2.1规范中，每个盒模型的位置是三维的，分别是平面画布上的`X轴`，`Y轴`以及表示层叠的`Z轴`。一般情况下，元素在页面上沿`X轴Y轴`平铺，我们察觉不到它们在`Z轴`上的层叠关系。而一旦元素发生堆叠，这时就能发现某个元素可能覆盖了另一个元素或者被另一个元素覆盖。

在CSS2.1的年代，在CSS3还没有出现的时候（注意这里的前提），层叠顺序规则遵循下面这张图：
![层叠顺序](https://image.zhangxinxu.com/image/blog/201601/2016-01-07_223349.png)



### 三、务必牢记的层叠准则

**再类比回“层叠上下文”和“层叠等级”，就得出一个结论：**

1. 普通元素的层叠等级优先由其所在的层叠上下文决定。

2. 层叠等级的比较只有在当前层叠上下文元素中才有意义。不同层叠上下文中比较层叠等级是没有意义的。

3. 层叠上下文也基本上是有一些特定的CSS属性创建的，一般有3种方法：

   1. `HTML`中的根元素`<html></html>`本身j就具有层叠上下文，称为“根层叠上下文”。
   2. 普通元素设置`position`属性为**非**`static`值并设置`z-index`属性为具体数值，产生层叠上下文。
   3. CSS3中的新属性也可以产生层叠上下文。

   

### 四、层叠上下文的特性

- 属于同一个层叠上下文，此时谁的`z-index`值大，谁在上面。

- 不通层叠上下文，谁的父级上下文z-index大，谁在上

- ### 你要的“套路”

  上面说了那么多，可能你还是有点懵。这么多概念规则，来点最实际的，有没有一个“套路”当遇到元素层叠时，能很清晰地判断出他们谁在上谁在下呢？答案是——肯定有啊！

  > 1、首先先看要比较的两个元素是否处于同一个层叠上下文中：    1.1如果是，谁的层叠等级大，谁在上面（怎么判断层叠等级大小呢？——看“层叠顺序”图）。    1.2如果两个元素不在统一层叠上下文中，请先比较他们所处的层叠上下文的层叠等级。 2、当两个元素层叠等级相同、层叠顺序相同时，在DOM结构中后面的元素层叠等级在前面元素之上。

### 五、层叠上下文的创建

哈哈。如同块状格式化上下文，层叠上下文也基本上是有一些特定的CSS属性创建的。我

1. **皇亲国戚**派：页面根元素天生具有层叠上下文，称之为“根层叠上下文”。
2. **科考入选**派：z-index值为数值的定位元素的传统层叠上下文。
3. **其他当官途径**：其他CSS3属性。

### 六、什么是“层叠顺序”

说完“层叠上下文”和“层叠等级”，我们再来说说“层叠顺序”。“层叠顺序”(stacking order)表示元素发生层叠时按照特定的顺序规则在`Z轴`上垂直显示。**由此可见，前面所说的“层叠上下文”和“层叠等级”是一种概念，而这里的“层叠顺序”是一种规则。**

![img](https://user-gold-cdn.xitu.io/2018/8/30/1658910c5cb364b6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

在不考虑CSS3的情况下，当元素发生层叠时，层叠顺讯遵循上面途中的规则。 **这里值得注意的是：**

### 七.父子比较，比层叠水平

注意，这里的规则有些~~负责~~复杂。要满足两个条件才能形成层叠上下文：

1. **display:flex（添加display:flex属性的元素的子元素会变成层叠上下文元素）**

   条件1是父级需要是`display:flex`或者`display:inline-flex`水平，

   条件2是子元素的z-index不是`auto`，必须是数值。

如下HTML和CSS代码：

```
<div class="box">
    <div>
    	<img src="mm1.jpg">
    </div>
</div>
.box {  }
.box > div { background-color: blue; z-index: 1; }    /* 此时该div是普通元素，z-index无效 */
.box > div > img { 
  position: relative; z-index: -1; right: -150px;     /* 注意这里是负值z-index */
}
```

结果如下：

![img](https://image.zhangxinxu.com/image/study/s/s256/mm1.jpg)

会发现，妹子跑到蓝色背景的下面了。为什么呢？层叠顺序图可以找到答案，如下：
![负值z-index的层叠顺序](https://image.zhangxinxu.com/image/blog/201601/2016-01-08_235511.png)

从上图可以看出负值z-index的层叠顺序在block水平元素的下面，而蓝色背景`div`元素是个普通元素，因此，妹子直接穿越过去，在蓝色背景后面的显示了。

现在，我们CSS微调下，增加`display:flex`, 如下：

```
.box { display: flex; }
.box > div { background-color: blue; z-index: 1; }    /* 此时该div是层叠上下文元素，同时z-index生效 */
.box > div > img { 
  position: relative; z-index: -1; right: -150px;     /* 注意这里是负值z-index */
}
```

结果：

![img](https://image.zhangxinxu.com/image/study/s/s256/mm1.jpg)

会发现，妹子在蓝色背景上面显示了，为什么呢？层叠顺序图可以找到答案，如下：
![img](https://image.zhangxinxu.com/image/blog/201601/2016-01-08_235217.png)

从上图可以看出负值`z-index`的层叠顺序在当前第一个父层叠上下文元素的上面，而此时，那个`z-index`值为`1`的蓝色背景`<div>`的父元素的`display`值是`flex`，一下子升官发财变成层叠上下文元素了，于是，图片在蓝色背景上面显示了。这个现象也证实了层叠上下文元素是`flex`子元素，而不是`flex`容器元素。

另外，另外，这个例子也颠覆了我们传统的对`z-index`的理解。在CSS2.1时代，`z-index`属性必须和定位元素一起使用才有作用，但是，在CSS3的世界里，

​	2.opacity

**添加opacity属性的元素的子元素会变成层叠上下文元素**

如下HTML和CSS代码：

```
<div class="box">
    <img src="mm1.jpg">
</div>
.box { background-color: blue;  }
.box > img { 
  position: relative; z-index: -1; right: -150px;
}
```

结果如下：

![img](https://image.zhangxinxu.com/image/study/s/s256/mm1.jpg)

然后价格透明度，例如50%透明：

```
.box { background-color: blue; opacity: 0.5;  }
.box > img { 
  position: relative; z-index: -1; right: -150px;
}
```

结果如下：

![img](https://image.zhangxinxu.com/image/study/s/s256/mm1.jpg)

原因就是半透明元素具有层叠上下文，妹子图片的`z-index:-1`无法穿透，于是，在蓝色背景上面乖乖显示了。