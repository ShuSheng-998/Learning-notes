## Object.keys

- 返回一个由一个给定对象的自身可枚举属性组成的数组，所有元素为字符串的数组
- 数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 。
- 如果对象的键-值都不可枚举，那么将返回由键组成的数组。

```
    var arr = ['a', 'b', 'c'];
    console.log(Object.keys(arr)); // console: ['0', '1', '2']
    
    var obj = { 0: 'a', 1: 'b', 2: 'c' };
    console.log(Object.keys(obj)); // console: ['0', '1', '2']
    
    var anObj = { 100: 'a', 2: 'b', 7: 'c' };
    console.log(Object.keys(anObj)); // console: ['2', '7', '100']
```

## Object.defineProperty()

```
Object.defineProperty(obj, prop, descriptor)：
```

- 直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

  ```
   obj：要在其上定义属性的对象。
   prop：要定义或修改的属性名称。
   descriptor：将被定义或修改的属性描述符
  复制代码
  ```

- 返回值：被传递给函数的对象。

- 通过赋值操作添加的普通属性是可枚举的，能够在属性枚举期间呈现出来（`for...in 或 Object.keys 方法`）， 这些属性的值可以被改变，也可以被删除。

- 默认情况下，使用 Object.defineProperty() 添加的属性值是不可修改的。

举例：首先定义一个对象

```
const obj = {
    firstName: 'A',
    lastName: 'B'
}
复制代码
```

给这个对象添加一个`fullName`属性，`fullName`的值为`obj.firstName-obj.lastName`

```
Object.defineProperty(obj, 'fullName', {
    // 访问描述符
    // 当读取对象此属性值时自动调用, 将函数返回的值作为属性值, this为obj
    get () {
        return this.firstName + '-' + this.lastName
    },
    // 当修改了对象的当前属性值时自动调用, 监视当前属性值的变化, 修改相关的属性, this为obj
    set (value) {
        const names = value.split('-')
        this.firstName = names[0]
        this.lastName = names[1]
    }
})
console.log(obj.fullName) // A-B
```

**属性描述符**

- 对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。
- 数据描述符：是一个具有值的属性，该值可能是可写的，也可能不是可写的。
- 存取描述符：是由getter-setter函数对描述的属性。
- 描述符必须是这两种形式之一；不能同时是两者。

**数据描述符和存取描述符均具有以下可选键值**

- `configurable`：当且仅当该属性的 `configurable` 为 `true` 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 `false`。
- `enumerable`：当且仅当该属性的 `enumerable` 为 `true` 时，该属性才能够出现在对象的枚举属性中。默认为 `false`。

**数据描述符同时具有以下可选键值：**

- `value`：该属性对应的值。可以是任何有效的 `JavaScript` 值（数值，对象，函数等）。默认为 `undefined`。
- `writable`：当且仅当该属性的 `writable` 为 `true` 时，`value` 才能被赋值运算符改变。默认为 `false`。

**存取描述符同时具有以下可选键值：**

- `get`：一个给属性提供 `getter` 的方法，如果没有 `getter` 则为 `undefined`。 当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入 `this` 对象 （由于继承关系，这里的 `this` 并不一定是定义该属性的对象）。默认为 `undefined`。
- `set`：一个给属性提供 `setter` 的方法，如果没有 `setter` 则为 `undefined`。 当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。默认为 `undefined`。

```js
var o = {}; // 创建一个新对象
     
    // 在对象中添加一个属性与数据描述符的示例
    Object.defineProperty(o, "a", {
      value : 37,
      writable : true,
      enumerable : true,
      configurable : true
    });
     
    // 对象o拥有了属性a，值为37
     
    // 在对象中添加一个属性与存取描述符的示例
    var bValue;
    Object.defineProperty(o, "b", {
      get : function(){
        return bValue;
      },
      set : function(newValue){
        bValue = newValue;
      },
      enumerable : true,
      configurable : true
    });
     
    o.b = 38;
    // 对象o拥有了属性b，值为38
     
    // o.b的值现在总是与bValue相同，除非重新定义o.b
     
    // 数据描述符和存取描述符不能混合使用
    Object.defineProperty(o, "conflict", {
      value: 0x9f91102, 
      get: function() { 
        return 0xdeadbeef; 
      } 
    });
    // throws a TypeError: value appears only in data descriptors, get appears only in accesso
```

**Enumerable 特性**

`enumerable`定义了对象的属性是否可以在 `for...in` 循环和 `Object.keys()` 中被枚举。

**configurable 特性：**

- `configurable` 特性表示对象的属性是否可以被删除，以及除`value`和`writable`特性外的其他特性是否可以被修改。
- 如果 `o.a` 的`configurable`属性为 `true`，则不会抛出任何错误，并且该属性将在最后被删除。

##### Setters和Getters

一般的 `Setters` 和 `Getters`：下面的例子展示了如何实现一个自存档对象。 当设置 `temperature` 属性时，`archive` 数组会获取日志条目。

```
function Archiver() {
  var temperature = null;
  var archive = [];
 
  Object.defineProperty(this, 'temperature', {
    get: function() {
      console.log('get!');
      return temperature;
    },
    set: function(value) {
      temperature = value;
      archive.push({ val: temperature });
    }
  });
 
  this.getArchive = function() { return archive; };
}
 
var arc = new Archiver();
arc.temperature; // 'get!'
arc.temperature = 11;
arc.temperature = 13;
arc.getArchive(); // [{ val: 11 }, { val: 13 }]
```

承属性：如果访问者的属性是被继承的，它的 get 和set 方法会在子对象的属性被访问或者修改时被调用。如果这些方法用一个变量存值，该值会被所有对象共享

**这可以通过将值存储在另一个属性中解决。在 get 和 set 方法中，this 指向某个被访问和修改属性的对象。**

```
function myclass() {
}
 
Object.defineProperty(myclass.prototype, "x", {
  get() {
    return this.stored_x;
  },
  set(x) {
    this.stored_x = x;
  }
});
 
var a = new myclass();
var b = new myclass();
a.x = 1;
console.log(b.x); // undefined
```

## Object.create

- 创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。

- 语法：`Object.create(proto, propertiesObject)`

  ```
    proto：新创建对象的原型对象。
    propertiesObject：可选。如果没有指定为 undefined，则是要添加到新创建对象的可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）
    对象的属性描述符以及相应的属性名称。这些属性对应Object.defineProperties()的第二个参数。
    如果propertiesObject参数是 null 或非原始包装对象，则抛出一个 TypeError 异常。
  复制代码
  ```

- 返回值：一个新对象，带着指定的原型对象和属性。

- 1.方法内部定义一个新的空对象 `obj`

- 2.将 `obj._proto__`的对象指向传入的参数 `proto`

- 3.返回一个新的对象

**Object.create() 和 new Object() 的不同**

**new Object()** 创建的对象，修改新对象，老对象同时修改（浅拷贝）

```js
var newObj = {
    name: 'fx',
    why: {
        day: 1
    }
}
var b = new Object(newObj)
b.name = 'bfx'
b.why = {
    bday: 'b'
}
console.log('b:', b)
console.log('newObj：', newObj)
```

**Object.create()方式创建**(只是__proto__属性一致，继承原型，本体上的值是深拷贝)

```
var newObj = {
    name: 'fx',
    why: {
        day: 1
    }
}
var b = Object.create(newObj)
console.log(b)
b.name = 'bfx'
b.why = {
    bday: 'b'
}
console.log('b:', b)
console.log('newObj：', newObj)
```

## propertyIsEnumerable （属性是否可枚举）

- 返回一个布尔值，表示指定的属性是否可枚举。
- 语法 `obj.propertyIsEnumerable(prop)`
- 每个对象都有一个 `propertyIsEnumerable` 方法。此方法可以确定对象中指定的属性是否可以被 `for...in` 循环枚举，但是通过原型链继承的属性除外。如果对象没有指定的属性，则此方法返回 `false`。

```
    var o = {};
    var a = [];
    o.prop = 'is enumerable';
    a[0] = 'is enumerable';
    
    o.propertyIsEnumerable('prop'); // 返回 true
    a.propertyIsEnumerable(0);      // 返回 true
    ===
    var a = ['is enumerable'];
    
    a.propertyIsEnumerable(0);        // 返回 true
    a.propertyIsEnumerable('length'); // 返回 false
    
    Math.propertyIsEnumerable('random'); // 返回 false
    this.propertyIsEnumerable('Math');   // 返回 false
```

## hasOwnProperty

- 返回一个布尔值，表示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。
- `obj.hasOwnProperty(prop)`
- `prop` 要检测的属性的 `String` 字符串形式表示的名称，或者 `Symbol`。
- 所有继承了 `Object` 的对象都会继承到 `hasOwnProperty` 方法。这个方法可以用来检测一个对象是否含有特定的自身属性；和 `in` 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。

## in

- 如果指定的属性在指定的对象或其原型链中，则`in` 运算符返回`true`。
- prop in object

```
    var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
    0 in trees        // 返回true
    3 in trees        // 返回true
    6 in trees        // 返回false
    "bay" in trees    // 返回false (必须使用索引号,而不是数组元素的值)
    "length" in trees // 返回true (length是一个数组属性)
    "PI" in Math          // 返回true
    "toString" in {}; // 返回true
复制代码
```

`in`右操作数必须是一个对象值。例如，你可以指定使用`String`构造函数创建的字符串，但不能指定字符串文字。

```
var color1 = new String("green");
"length" in color1 // 返回true
var color2 = "coral";
"length" in color2 // 报错(color2不是对象)
```

## Object.prototype.toString()

- 语法：`obj.toString()`
- 返回值：一个表示该对象的字符串。
- 每个对象都有一个 `toString()` 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用
- 默认情况下，`toString()` 方法被每个 `Object` 对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 `"[object type]"`，其中 type 是对象的类型。
- `toString()` 调用 null 返回 `[object Null]`，`undefined` 返回 `[object Undefined]`

```
    var o = new Object();
    o.toString(); // returns [object Object]
复制代码
```

使用 toString() 检测对象类型

```
var toString = Object.prototype.toString;

toString.call(new Date); // [object Date]
toString.call(new String); // [object String]
toString.call(Math); // [object Math]
//Since JavaScript 1.8.5
toString.call(undefined); // [object Undefined]
toString.call(null); // [object Null]
```