### 一、没有Iterator之前

* 使用`Object.entries`转换成可便利对象

````javascript
let authors = {
    allAuthors: {
        fiction: ['Agla', 'grafs', 'ka-zk', 'kamirer'],
        scienceFicton: ['Noxax', 'setti', 'Jinx', 'Lax'],
        fantasy: ['Gulajas', 'jax', 'sein', 'Arelia', 'Lilia']
    },
    Addres: []
}
let r = []
for (let [, v] of Object.entries(authors.allAuthors)) {
    r = r.concat(v)
}
console.log(r)			//["Agla", "grafs", "ka-zk", "kamirer", "Noxax", "setti", "Jinx", "Lax", "Gulajas", "jax", "sein", "Arelia", "Lilia"]
````

### 二、Iterator（数据结构和业务逻辑的解耦）

* 最简单的`Iterator`遍历

* 将`Symbol.iterator`挂在author上，这个键的值是一个函数

  **1.部署`Symbol.iterator`方法后，就增加了可迭代协议**

  **2.迭代器协议：在`Sympol.iterator`方法下必须返回一个包含`next` 方法的对象，此方法还必须返回包含`done`和`value`的键**

* 函数内部`this`是输入，`return`是输出

* 输出：

  ​     	   1.返回一个对象，这个对象里有一个`next`方法，

  ​			2.`next`方法内再返回一个对象，对象内有两个字段，

  ​			3.一个是`done`：反映遍历是否完成，一个是`value`反映当前遍历的值

  ```` javascript
  authors[Symbol.iterator] = function () {
      // this
      return {
          next () {
              return {
                  done: false,
                  value: 1
              }
          }
      }
  }
  ````

* 返回的对象就是遍历时每次要执行的函数体
* 在`function`的最外层通过`this`获取到当前所需要的键，这里是`allAuthors`

* 在`next`中写如何获得当前所需遍历的值，利用`key`和`value`

* 在`next`方法中返回的两个值需控制，done通常是完成一个阶段的遍历所需要的次数，value必须是当前的遍历的值

  ```` javascript
  authors[Symbol.iterator] = function () {
      // this
      let allAuthors = this.allAuthors
      let keys = Reflect.ownKeys(allAuthors)
      let value = []
      return {
          next () {
              if (!value.length) {
                  if (keys.length) {
                      value = allAuthors[keys[0]]
                      keys.shift()
                  }
              }
              return {
                  done: !value.length,
                  value: value.shift()
              }
          }
      }
  }
  let r = []
  for (let v of authors) {
      r.push(v)
  }
  console.log(r)	//["Agla", "grafs", "ka-zk", "kamirer", "Noxax", "setti", "Jinx", "Lax", "Gulajas", "jax", "sein", "Arelia", "Lilia"]
  ````

* `next`方法其实是一个指针，指向当前遍历的值，执行一次后需指向下一个，所以需要在`next`方法中使用shift来控制其指向

### 使用Generator和Iterator结合

* **`Generator`中实现了`next`方法，不需要我们控制done的信息**

``` javascript
authors[Symbol.iterator] = function * () {
    // this
    let allAuthors = this.allAuthors
    let keys = Reflect.ownKeys(allAuthors)
    let values = []
    while (1) {
        if (!values.length) {//当value为空时（一组值完成），添加下一组值进入value
            if (keys.length) {
                values = allAuthors[keys[0]]
                keys.shift()
                yield values.shift()	//返回值为当前 遍历的值
            } else {
                return false	//keys长度为0，遍历完成，返回false
            }
        } else {
            yield values.shift()
        }
    }
}
let r = []
for (let v of authors) {
    r.push(v)
}
console.log(r)
```

