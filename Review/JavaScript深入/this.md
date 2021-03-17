#### 调用场景

```js
var obj = {
    a: 1, 
	b: function(){
		console.log(this);
	}
}
```

**普通函数**：

1、作为对象调用时，指向该对象 obj.b(); // 指向obj
2、作为函数调用, var b = obj.b; b(); // 指向全局window
3、作为构造函数调用 var b = new Fun(); // this指向当前实例对象
4、作为call与apply调用 obj.b.apply(object, []); // this指向当前的object

**箭头函数中的**this:

- 箭头函数没有自己的this, 它的this是继承而来; 默认指向在定义它时所处的对象(宿主对象),
- 而不是执行时的对象, 定义它的时候,可能环境是window,也有可能是其他的。

#### Types

***

**ECMAScript 的类型分为语言类型和规范类型。**

ECMAScript **语言类型是开发者直接使用 ECMAScript 可以操作的**。其实就是我们常说的Undefined, Null, Boolean, String, Number, 和 Object。

而规范类型相当于 meta-values，是用来**用算法描述 ECMAScript 语言结构和 ECMAScript 语言类型的。**规范类型包括：Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, 和 Environment Record。**作用是用来描述语言底层行为逻辑。**

#### Reference

***

Reference 类型就是用来解释诸如 delete、typeof 以及赋值等操作行为的。

 **Reference 的构成，由三个组成部分**，分别是：

- base value（这个属性所属的对象或EnvironmentRecord）
- referenced name（这个属性的名字）
- strict reference

例子1：

```js
var foo = 1;

// 对应的Reference是：
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};
```

例子2：

```js
var foo = {
    bar: function () {
        return this;
    }
};
 
foo.bar(); // foo

// bar对应的Reference是：
var BarReference = {
    base: foo,
    propertyName: 'bar',
    strict: false
};
```

**Reference 组成部分的方法**	

1. GetBase:返回base value（这个属性所属的对象）
2. IsPropertyReference：如果base value是一个对象，就返回true

#### GetValue

***

```json
var foo = 1;

var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};

GetValue(fooReference) // 1;
```

GetValue 返回对象属性真正的值，但是要注意：

**调用 GetValue，返回的将是具体的值，而不再是一个 Reference**

#### 如何确定this的值

***

**1.计算 MemberExpression 的结果赋值给 ref**

**2.判断 ref 是不是一个 Reference 类型**

```
2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)//返回这个reference 的base value 的值

2.2 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)

2.3 如果 ref 不是 Reference，那么 this 的值为 undefined
```

#### 具体分析

****

1. 计算MemberExpression 的结果赋值给 ref

例子：

```js
function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}

foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}

foo.bar(); // MemberExpression 是 foo.bar
```

所以简单理解 MemberExpression 其实就是()左边的部分。

### foo.bar()

在示例 1 中，MemberExpression 计算的结果是 foo.bar，那么 foo.bar 是不是一个 Reference 呢？

查看规范 11.2.1 Property Accessors，这里展示了一个计算的过程，什么都不管了，就看最后一步：

> Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.

我们得知该表达式返回了一个 Reference 类型！

根据之前的内容，我们知道该值为：

```js
var Reference = {
  base: foo,
  name: 'bar',
  strict: false
};
```

接下来按照 2.1 的判断流程走：

> 2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)

该值是 Reference 类型，那么 IsPropertyReference(ref) 的结果是多少呢？

前面我们已经铺垫了 IsPropertyReference 方法，如果 base value 是一个对象，结果返回 true。

base value 为 foo，是一个对象，所以 IsPropertyReference(ref) 结果为 true。

这个时候我们就可以确定 this 的值了：

```
this = GetBase(ref)，
```

GetBase 也已经铺垫了，获得 base value 值，这个例子中就是foo，所以 this 的值就是 foo ，示例1的结果就是 2！