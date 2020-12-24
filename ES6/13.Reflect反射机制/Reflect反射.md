* 之前运用apply的方法

  ``` javascript
  let price = 101.5
  if (price > 100) {
      price = Math.floor.apply(null, [price])
  } else {
      price = Math.ceil.apply(null, [price])
  }
  ```

### Reflect

* **apply**

  ```javascript
  console.log(Reflect.apply(price > 100 ? Math.floor : Math.ceil, null, [price]))
  ```

* **动态地实例化一个对象**

  语法：Reflect.construct（Date， [ ]）

  参数：1.要实例化的类

  ​			2.要实例化的类构建时所需的参数（没有时传递一个空数组）

  ```` javascript
  let day = Reflect.construct(Date, [])
  console.log(day)
  ````

* **defineProperty、deleteProperty**

  ``` javascript
  const student = {}
  const r = Reflect.defineProperty(student, 'name', { value: 'lbw' })
  //const e = Object.defineProperty(student, 'name', { value: 'lbw' })	
  console.log(r)		//true
  //console.log(e)		//{name: "lbw"}
  ```

  

