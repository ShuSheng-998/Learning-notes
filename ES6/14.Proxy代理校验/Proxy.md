* **对类的修改进行校验拦截**

  ``` javascript
  let student = {
      name: 'LBW',
      price: 190
  }
  let d = new Proxy(student, {
      get (target, key) {
          return target[key] || ''
      },
      set (target, key, value) {
          if (Reflect.has(target, key)) {		//对类的修改做校验
              if (key === 'price') {
                  if (value > 300) {
                      return false
                  } else {
                      target[key] = value
                  }
              } else {
                  target[key] = value
              }
          } else {
              return false
          }
      }
  })
  d.price = 301	//大于300不生效
  d.age = 400		//不生效，因为不具有这个属性
  student.name = 'PDD'
  console.log(student)
  ```

* **解耦合（将方法内容写在其他函数模块中）**

  ``` javascript
  let validator = (target, key, value) => {
      if (Reflect.has(target, key)) {
          if (key === 'price') {
              if (value > 300) {
                  return false
              } else {
                  target[key] = value
              }
          } else {
              target[key] = value
          }
      } else {
          return false
      }
  }
  let d = new Proxy(student, {
      get (target, key) {
          return target[key] || ''
      },
      set: validator
  })
  ```

* **监听错误并报告**

  ``` javascript
  window.addEventListener('error', (e) => {
      console.log(e.message)
      // report
  }, true)// 事件捕获
  let student = {
      name: 'LBW',
      price: 190
  }
  let validator = (target, key, value) => {
      if (Reflect.has(target, key)) {
          if (key === 'price') {
              if (value > 300) {
                  throw new TypeError('price exceed 300')//抛出异常，直接在外面处理所有报告
              } else {
                  target[key] = value
              }
          } else {
              target[key] = value
          }
      } else {
          return false
      }
  }
  let d = new Proxy(student, {
      get (target, key) {
          return target[key] || ''
      },
      set: validator
  })
  d.price = 301
  d.age = 400
  student.name = 'PDD'
  console.log(student)
  ```

  #### 使用Proxy实现新建对象时每个对象有不同的id值，且只可读，每次读的值一致

  ``` javascript
  class Component {
      constructor () {
          this.proxy = new Proxy({
              id: Math.random().toString(36).slice(-8)
          }, {})
          //其他的不需要代理的属性
          //this.name = 'lbw'
      }
      get id () {
          return this.proxy.id
      }
  }
  let com = new Component()
  let com2 = new Component()
  for (let i = 0; i < 10; i++) {
      console.log(com.id, com2.id)
  }
  com.id = 'asd'
  console.log(com.id)
  ```


* **使用可销毁的Proxy对象**

  在调用revoke方法前可以使用Proxy对象中的方法，调用revoke后，失去操作权限（读后不可用）

  ```` javascript
  let student = {
      name: 'LBW',
      price: 190
  }
  
  let d = Proxy.revocable(student, {
      get (target, key) {
          if (key === 'price') {
              return target[key] + 20
          } else {
              return target[key]
          }
      }
  })
  console.log(d.proxy.price)
  setTimeout(function () {
      d.revoke()		//销毁
      setTimeout(function () {
          console.log(d.proxy.price)		//报错
      })
  }, 100)
  ````

  