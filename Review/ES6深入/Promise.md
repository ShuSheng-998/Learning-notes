## Promise在前端开发中扮演的角色

promise是现代Web应用的异步开发的重要手段

## 概念

promise本质上是一个异步对象，其中包含了一些在未来结束的异步事件的结果。promise在代码表现上是一个构造函数，他有三个特点

1. promise有三个状态：**pending（进行中）、fulfilled（成功）和 reject（失败）**，并且状态不受外部影响。

2. 状态一旦改变就**无法修改，**并且状态只能从 pending 到 fulfilled 或者是 pending 到 reject。

3. Promise 一旦创建就会立即执行，不能中途取消。

#### 用法

在 Promise 诞生之前，Web 应用中的异步开发主要采用的是回调函数的模式，回调函数的一大缺点就是，**当我们的一个异步结果需要使用另外一个异步结果时，就会产生回调嵌套，一旦这样的嵌套多了，就会变成回调地狱**，十分影响代码观感且**不易维护**。而且不仅仅这样，设想一个场景层层嵌套的逻辑中，某天业务需要，我们要插入一个新的回调，那么这将是不可预料的维护深渊。

* **处理异步方法的回调问题**

  1. 回调配合着嵌套会产生回调地狱问题，思路很不清晰。

  2. 由于回调存在着依赖反转，在使用第三方提供的方法时，存在信任问题。

  3. 当我们不写发生错误时的回调函数时，会存在异常无法捕获

  4. 导致我们的性能更差，本来可以一起做的但是使用回调，导致多件事导致我们的性能更差，本来可以一起做的但是使用回调，导致多件事情顺序执行，用的时间更多

​			（1）调用回调过早（在它开始追踪之前）

​			（2）调用回调过晚(或不调)

​			（3）调用回调太少或太多次

**而 Promise 的诞生一定程度上解决了这个问题，因为 Promise 是采用链式调用的方式**，并且在 Promise 返回的 Promise 对象中的 then、catch 等一系列方法都会返回一个新的 Promise 对象。

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject，他们是两个函数，由JavaScript提供。

- resolve的作用是将pending变为resolved，在异步操作成功时调用，并将结果传递出去
- reject 函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

```
function loadScript (src) {
    // state = pending（挂起）, result = undefined
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.src = src
        script.onload = () => resolve(src)	// state = fulfilled, result = src
        script.onerror = (err) => reject(err)// state = rejected, result = error
        document.body.append(script)
    })
}
loadScript('./1.js')
    .then(() => {
        return loadScript('./2.js')
    }, (err) => {
        console.log(err)
    })
    .then(() => {
        loadScript('./3.js')
    }, (err) => {
        console.log(err)
    })
```

#### API



* **关注两个变量 state（状态）  和 result （结果）**，**状态不可逆**

  **说明：**

  ​	1.在函数中new一个Promise对象并返回

  ​	2.new的参数是一个函数（最好是箭头函数）

  ​	3.箭头函数的参数是 resolve 和reject

  ​	4.函数体内处理异步问题

  ​	5.在函数体体调用resolve和reject方法时，状态发生改变

  ``` javascript
  function loadScript (src) {
      // state = pending（挂起）, result = undefined
      return new Promise((resolve, reject) => {
          let script = document.createElement('script')
          script.src = src
          script.onload = () => resolve(src)	// state = fulfilled, result = src
          script.onerror = (err) => reject(err)// state = rejected, result = error
          document.body.append(script)
      })
  }
  loadScript('./1.js')
      .then(() => {
          return loadScript('./2.js')
      }, (err) => {
          console.log(err)
      })
      .then(() => {
          loadScript('./3.js')
      }, (err) => {
          console.log(err)
      })
  ```

* **.then方法**

  - then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 resolved 时调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 Promise 对象传出的值作为参数
  - then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）。因此可以采用**链式写法**，即 then 方法后面再调用另一个 then 方法。如果return的不是Promise对象，也会被封装成一个Promise对象（一般用于后一个请求依赖于前一个请求的结果时）

* **静态方法Promise.resoleve和Promise.reject**

  * 有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用。

  ````javascript
  function test (bool) {
      if (bool) {
          return new Promise()
      } else {
          return Promise.resolve(42)	//将某些类型转换为Promise对象
       // return Promise.reject(new Error('lbwnb'))
      }
  }
  test(0).then((value) => {
      console.log(value)
  }, (err) => {
      console.log(err)
  })
  ````

* **Promise对 异常额处理**

  `catch方法`

  - Promise.prototype.catch 方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。
  - Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 catch 语句捕获。

  ```` javascript
  loadScript('./1.js')
      .then(() => {
          return loadScript('./4.js')
      })
      .then(() => {
          return loadScript('./3.js')
      })
      .catch(err => {
          console.log(err)
      })						//在最后进行错误捕获
  ````

* **并行异步操作**

  **多个并行接口返回的数据（不关心先后顺序），组装成一个新的Promise对象**

  - 接受一个可迭代对象，返回一个新的Promise
  - 在前端的开发实践中，我们有时会遇到需要发送多个请求并根据请求返回数据的需求，比如，我们要发送a、b、c三个请求，这三个请求返回的数据分别为a1、a2、a3，而我们想要a1、a2、a3按照我们希望的顺序返回。
  - 当对象里的所有 Promise 都 resolve 时，返回的 Promise 也会 resolve。当有一个reject时，返回的Promise会立刻reject

  ````javascript
  const p1 = Promise.resolve(1)
  const p2 = Promise.resolve(2)
  const p3 = Promise.resolve(3)
  Promise.all([p1, p2, p3]).then((value) => {
      console.log(value)
  })
  ````

* **Promise的竞争概念**

  **加载图片可能会失败，添加多个线路（图片地址）以解决问题，先加载到的先显示，后面的舍弃**

  * Promise 接受一个可迭代对象，里面的 Promise 是竞争关系，谁先 resolve 或者 reject 立刻会被当做返回值返回到外部。其他会 settled 的 Promise 会继续执行但不会再影响结果。

  ```javascript
  const p1 = () => {
      return new Promise((resolve, reject) => {
          setTimeout(function () {
              resolve(1)
          }, 3000)
      })
  }
  const p2 = () => {
      return new Promise((resolve, reject) => {
          setTimeout(function () {
              resolve(2)
          }, 1000)
      })
  }
  Promise.race([p1(), p2()]).then((value) => {
      console.log(value)			//2
  })
  ```

* **练习**

  用Promise实现一个接口