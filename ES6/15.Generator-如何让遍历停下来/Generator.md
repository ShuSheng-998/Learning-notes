### Generator（可终止的遍历）

* 一步一步地控制循环

* 在函数名前有个  *  号

* 函数内部有yield关键字

* 可嵌套--在yield关键词后加  *  ，* 后再加函数体

  添加了*的，会变成可终止的遍历（`Generator`）

  ``` javascript
  function * loop () {
      for (let i = 0; i < 5; i++) {
          yield console.log(i)
      }
  }
  const l = loop()
  l.next()	//0
  l.next()	//1
  l.next()	//2
  l.next()	//3
  l.next()	//4
  l.next()	//无
  ```

* `yield`

  语法：在某个位置前加上yield

  功能：执行yield后面的表达式，并暂停当前函数，在调用下个next语法后，寻找下一个yield（或是函数结尾），寻找到时暂停（或者结束）

  返回值：无返回值（调用next后传参后除外）

  ```javascript
  function * gen () {
      let val
      val = yield 1
      console.log(val)
  }
  const l = gen()
  l.next()	//无输出，因为寻找到yield后，执行yield后面地表达式，但是只是1，无输出
  l.next()	//undefined，调用后，从1后开始执行，返回undefined给val，输出undefined
  ```

* `next`

  语法：generator.next

  功能：找到下个`yield`，并停止函数在此处

  返回值：返回`yield`关键字后表达式的返回值和当前的状态（未到函数体结束为false，到了为true）
  
  ```` javascript
  function * gen () {
      let val
      val = yield * [1, 2, 3]
      console.log(val)
  }
  const l = gen()
  console.log(l.next())	//{value: 1, done: false}
  console.log(l.next())	//{value: 2, done: false}
  console.log(l.next())	//{value: 3, done: false}
  console.log(l.next())	//undefined
						//{value: undefined, done: true}
  ````
  
  参数：任意值，作为上一个yield的返回值
  
  ``` javascript
  function * gen () {
      let val
      val = yield [1, 2, 3]	//yield返回值为第二次调用时传的参数
      console.log(val)//20
  }
  const l = gen()
  console.log(l.next(10))		//{value: Array(3), done: false}
  console.log(l.next(20))		//{value: undefined, done: true}
  ```
  
* `.return方法`

  功能：直接退出当前函数体

  返回值：`{value: undefined, done: true}`

  参数：传参时，将参数作为返回值内value的值

  ```javascript
  function * gen () {
      let val
      val = yield [1, 2, 3]
      console.log(val)
  }
  const l = gen()
  console.log(l.next(10))		//{value: Array(3), done: false}
  //console.log(l.return(100))		{value: 100, done: true}
  console.log(l.return())		//{value: undefined, done: true}
  console.log(l.next(20))		//{value: undefined, done: true}
  ```

* 使用`try catch`语句来中断一次循环

  ``` javascript
  function * gen () {
      while (true) {
          try {
              yield 1
          } catch (e) {
              console.log(e.message)
          }
      }
  }
  const l = gen()
  console.log(l.next())		//{value: 1, done: false}
  console.log(l.next())		//{value: 1, done: false}
  l.throw(new Error('ss'))	//ss
  console.log(l.next())		//{value: 1, done: false}
  ```

### 使用Gnerator来实现一个抽奖模块

```` javascript
function * draw (first = 1, second = 3, third = 5) {
	//奖池
    let firstPrize = ['1A', '1B', '1C', '1D', '1E']
    let secondPrize = ['2A', '2B', '2C', '2D', '2E', '2F', '2G', '2H', '2I', '2J']
    let thirdPrize = ['3A', '3B', '3C', '3D', '3E', '3F', '3G', '3H', '3I', '3J', '3K', '3M', '3N', 'O']
    //计数器，计已抽到奖的人数
    let count = 0
    //随机数，记录此次随机到数在奖池数组中的位置
    let random

    while (true) {
        //抽一等将
        if (count < first) {
            random = Math.floor(Math.random() * firstPrize.length)
            count++
            yield firstPrize[random]
            firstPrize.splice(random, 1)
        } else if (count < first + second) {
        //抽二等将
            random = Math.floor(Math.random() * secondPrize.length)
            count++
            yield secondPrize[random]
            secondPrize.splice(random, 1)
        } else if (count < first + second + third) {
        //抽三等将
            random = Math.floor(Math.random() * thirdPrize.length)
            count++
            yield thirdPrize[random]
            thirdPrize.splice(random, 1)
        }
    }
}
let d = draw()
console.log(d.next().value)
console.log(d.next().value)
console.log(d.next().value)
console.log(d.next().value)
console.log(d.next().value)
console.log(d.next().value)
console.log(d.next().value)
````

### 练习

* 用Generator实现一个斐波那契数列
* 用Generator给自定义数据结构写一个遍历器

