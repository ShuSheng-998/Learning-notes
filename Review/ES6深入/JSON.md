## 二、JSON.stringify()

**功能**：把JavaScript对象序列化为JSON字符串

**语法**：JSON.stringify(value[, replacer [, space]])

- value：将要序列化为JSON字符串的值
- replacer：***可选***|过滤器参数。（参数可能为数组，函数或null）
- 数组：只有包含在这个数组中的属性名，才会显示；
- 函数：传入的函数接收两个参数，属性名和属性值；
- 没有提供/null：则不过滤，属性全部显示；
- space：***可选***|控制结果中的缩进和空白符。用于美化输出。（参数可能为数字、字符串、没有提供或为null）
- 数字：上线为10，大于10则转换为10，小于1则没有空格；
- 字符串：字符串长度最长不超过10个，大于10则取前10，替代空格显示；
- 没有提供/null：没有空格；

**例子****：**

### 使用JSON.stringify()

```
JSON.stringify({});                        // '{}'
JSON.stringify(true);                      // 'true'
JSON.stringify("foo");                     // '"foo"'
JSON.stringify([1, "false", false]);       // '[1,"false",false]'
JSON.stringify({ x: 5 });                  // '{"x":5}'
JSON.stringify({x: 5, y: 6});              // "{"x":5,"y":6}"
复制代码
```

### replacer参数为函数

```js
function replacer(key, value) {
  if (typeof value === "string") {
    return undefined;//类型为string，返回undefined
  }
  return value;
}

var foo = {foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7};
JSON.stringify(foo, replacer);
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad4e7ebadf5b455485e9e99fa21642c0~tplv-k3u1fbpfcp-zoom-1.image)

### replacer参数为数组

```
var obj = {"age": 19, "name": "千钧", "functionName": "test", "address": "china"};
JSON.stringify(obj, ['age', 'name']); // "{"age":19,"name":"千钧"}"
复制代码
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b90e83ee3f6d4d22b10dac779c37cf3f~tplv-k3u1fbpfcp-zoom-1.image)

### space参数

```
var obj = {"age": 19, "name": "千钧", "functionName": "test", "address": "china"};
JSON.stringify(obj, null, 2)
复制代码
```

执行结果如下所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b0aa12948a94cdb9cbcd130523df65f~tplv-k3u1fbpfcp-zoom-1.image)

## JSON.parse()

**功能**：把JSON字符串解析为原生JavaScript对象

**语法**：JSON.parse(text[, reviver])

- text：要被解析为JavaScript对象的字符串
- reviver：***可选***|函数，将在每个键值对上调用，用来修改解析生成的原始值，在parse返回之前调用。

**注意**：若传入的字符串不符合 JSON 规范，则会抛出 [`SyntaxError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) 异常。

**例子：**

### 使用JSON.parse()

```
JSON.parse('{}');              // {}
JSON.parse('true');            // true
JSON.parse('"foo"');           // "foo"
JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
JSON.parse('null');            // null
复制代码
```

### 使用reviver函数

```
JSON.parse('{"p": 5}', function (k, v) {
    if(k === '') return v;     // 如果到了最顶层，则直接返回属性值，
    return v * 2;              // 否则将属性值变为原来的 2 倍。
});   
复制代码
```

### JSON.parse()不允许对解析的原JavaScript对象出现以逗号结尾

```
JSON.parse('[1,3,4,]')
JSON.parse('{a:1,}')
复制代码
```

报错如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa4398b67de34e1fa46281b7f100c98f~tplv-k3u1fbpfcp-zoom-1.image)

## 使用链表指针获取JSON节点值

```
const json = {
	a:{ b:{ c: {} } },
	d:{e:{}}
}
const src = ['a', 'b', 'c']
let p = json
src.forEach(index => {
	p = p[index]
})
```

