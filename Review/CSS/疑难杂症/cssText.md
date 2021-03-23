### 样式集中改变

**不要频繁的操作样式，对于一个静态页面来说，**明智且可维护的做法是更改类名而不是修改样式，对于动态改变的样式来说，相较每次微小修改都直接触及元素，**更好的办法是统一在 `cssText` 变量中编辑**。虽然现在大部分现代浏览器都会有 `Flush` 队列进行渲染队列优化，但是有些老版本的浏览器比如IE6的效率依然低下。

```
// bad
var left = 10;
var top = 10;
el.style.left = left + "px";
el.style.top = top + "px";

// 当top和left的值是动态计算而成时...
// better 
el.style.cssText += "; left: " + left + "px; top: " + top + "px;";

// better
el.className += " className";
```

### cssText

***

更改元素样式

```
<div style="width:100px;height:100px;text-align:center;line-height:100px;">        This is div</div>
```

一般更改的样式比较少的话，我们直接给style属性赋值

```
div.style.width = "200px";div.style.height = "200px";div.style.lineHeight = "200px";
```

但是一旦需要更改的样式很多的话，可以使用cssText来设置

```
div.style.cssText = "width:200px;height:200px;line-height:200px";
```

但是cssText会覆盖行内样式，不会覆盖<style>标签内的样式，不会覆盖外部样式，所以为了解决这个问题，采用样式叠加的方式。

```
div.style.cssText += "width:200px;height:200px;line-height:200px";
```

但是IE9以下的浏览器div.style.cssText会省略cssText中的最后一个分号

```
console.log(div.style.cssText);结果为:HEIGHT: 100px; WIDTH: 100px; TEXT-ALIGN: center; LINE-HEIGHT: 100px; BACKGROUND-COLOR: red
```

所以为了解决IE中的这个小问题

```
div.style.cssText += ";width:200px;height:200px;line-height:200px";
```