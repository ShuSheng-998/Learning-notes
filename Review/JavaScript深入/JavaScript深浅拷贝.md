#### 基本数据类型

***

undefined,null,Boolean,String,Number,Symbol，Object

- 基本类型：undefined,	null,	Boolean,	String,	Number,	Symbol
- 引用类型：Object, Array,    Date,   Function,  RegExp等

不同类型的存储方式：

- 基本类型：**基本类型值**在内存中占据固定大小，保存在**栈内存**中
- 引用类型：**引用类型的值**是对象，保存在**堆内存**中，而**栈内存**存储的是**对象的变量标识符**以及**对象在堆内存中的存储地址**

#### 深拷贝&浅拷贝

***

* 浅拷贝：仅仅是复制了引用，彼此之间的操作会互相影响

- 深拷贝：在堆中重新分配内存，不同的地址，相同的值，互不影响

总的来说，深浅拷贝的主要区别就是：*复制的是引用还是复制的是实例*

#### Object Spread和 Object.assign() 的区别

***

`Object.assign（）`函数基本上可以与 Object spread 操作符互换（本质上是浅拷贝）

* `Object.assign（）`函数却修改其第一个传入对象`obj`：

  ```js
  lass MyClass {
    set val(v) {
      console.log('Setter called', v);
      return v;
    }
  }
  const obj = new MyClass();
  
  Object.assign(obj, { val: 42 }); // Prints "Setter called 42"
  ```

  换句话说，`Object.assign（）`修改了一个对象，因此它可以触发 [ES6 setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)。如果你更喜欢使用[immutable](https://facebook.github.io/immutable-js/)技术，那么 Object spread 操作符就是你更好的选择。使用 `Object.assign()`，你必须确保始终将空对象`{}`作为第一个参数传递。

#### 浅拷贝

- Array.prototype.slice()

```
let a = [1, 2, 3, 4];
let b = a.slice();
console.log(a === b); // -> false

a[0] = 5;
console.log(a); // -> [5, 2, 3, 4]
console.log(b); // -> [1, 2, 3, 4]
复制代码
```

- Array.prototype.concat()

```
let a = [1, 2, 3, 4];
let b = a.concat();
console.log(a === b); // -> false

a[0] = 5;
console.log(a); // -> [5, 2, 3, 4]
console.log(b); // -> [1, 2, 3, 4]
复制代码
```

看起来Array的slice(),concat()似乎是深拷贝，再接着看就知道它们究竟是深拷贝还是浅拷贝：

```
let a = [[1, 2], 3, 4];
let b = a.slice();
console.log(a === b); // -> false

a[0][0] = 0;
console.log(a); // -> [[0, 2], 3, 4]
console.log(b); // -> [[0, 2], 3, 4]
```

**slice和concat的本质还是在对应位置拷贝并赋值，如果拷贝的项是个对象（这里是数组，也是对象），也就是引用类型，直接拷贝了指针**

#### Object.assign(object,cloneObject)Object方法，浅拷贝

#### {...cloneobject, name:'lbw'}扩展运算符

#### 深拷贝

- JSON.parse()和JSON.stringify()

1. JSON.stringify()：把一个js对象序列化为一个JSON字符串（**转化为字符串后与原对象再无瓜葛**）
2. JSON.parse()：把JSON字符串反序列化为一个js对象（**本质上是利用字符串新建了一个对象**）

```
let obj = {
  name: 'leeper',
  age: 20,
  friend: {
    name: 'lee',
    age: 19
  }
};
let copyObj = JSON.parse(JSON.stringify(obj));
obj.name = 'Sandman';
obj.friend.name = 'Jerry';
console.log(obj);
// -> {name: "Sandman", age: 20, friend: {age: 19,name: 'Jerry'}}
console.log(copyObj);
// -> {name: "leeper", age: 20, friend: {age: 19,name: 'lee'}}
```

* 使用递归手写深度遍历

  ```jsx
  function deepClone(obj) {
              //判断拷贝的是对象还是数组
             let objclone = obj instanceof Array ? []:{}
              //利用递归遍历源对象的属性，如果是对象则赋值递归
             if(obj && typeof obj === 'object') {
                 //注意不要遍历到非自己的属性
                 for(let key in obj){
                     if(obj.hasOwnProperty(key)){
                         if(obj[key] && typeof obj[key] === 'object'){
                             objclone[key] = deepClone(obj[key])
                         }else{
                             objclone[key] = obj[key]
                         }
                     }
                     
                 }
             }
  
             return objclone
          }
          var  person = {
              name:'lbw',
              id:2017,
              producer:{
                  salar:2000,
                  age:22
              }
          }
          var personL = deepClone(person)
          console.log(personL);
  ```

  