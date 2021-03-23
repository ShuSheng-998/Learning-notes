我们可以使用`getComputedStyle`来获取当前元素（也就是百度一下按钮）的最终css属性值，也就是你最终看到的样式，究竟由哪些css属性值组成。

### 如何使用`getComputedStyle`？

getComputedStyle的语法如下：

```javascript
window.getComputedStyle(元素, [伪类])
复制代码
```

`getComputedStyle`的参数中，元素为必传参数，伪类可以不传 `getComputedStyle`返回的值是一个具有样式属性的对象，这个对象是一个只读对象。可以通过`getPropertyValue`方法读取对象的属性值来获取对应的css样式。

你打开百度后，可以在控制台内输入下面的代码尝试：

```javascript
// 获取百度一下按钮样式
const baiduButton = document.querySelector('input[type="submit"]');
const baiduButtonStyle = window.getComputedStyle(baiduButton);
console.log(baiduButtonStyle);
console.log(baiduButtonStyle.getPropertyValue('background-color'));
baiduButtonStyle['background-color'] = "rgb(0, 0, 0)";
```