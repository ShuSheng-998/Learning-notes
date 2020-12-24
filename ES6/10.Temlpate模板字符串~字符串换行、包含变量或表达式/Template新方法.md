### 一、ES5中对string中有表达式和变量的通常做法

* 字符串拼接

  ``` javascript
  const a = 18
  const b = 2
  const c = 'javascript'
  
  const str = 'my age is ' + (a + b) + ' i love ' + c
  console.log(str)		//my age is 20 i love javascript
  ```

### 二、ES6中的做法

*   **``**	和	**${}**  的结合

  ```javascript
  const a = 18
  const b = 2
  const c = 'javascript'
  
  const str = `my age is ${a + b} , i love ${c}`
  console.log(str)		//my age is 20 i love javascript
  ```

* 包含逻辑运算
  ```javascript
  function Price (strings, type) {
      let s1 = strings[0]
      const retailPrice = 20
      const wholePrice = 16
      let showText
      if (type === 'retail') {
          showText = '购买单价是：' + retailPrice
      } else {
          showText = '购买的批发价是：' + wholePrice
      }
      return `${s1}${showText}`
  }
  let showText = Price`您此次的${'retail'}`
  							//``内的字符串是Price中的stings，${}中的是type
  console.log(showText)		//您此次的购买单价是：20
  ```

* 使用 **``**  处理字符串换行问题

  ```` javascript
  let s1 = '我是第一行
  我是第二行'			//报错
  
  let str = `我是第一行
  我是第二行`
  console.log(str)	//我是第一行
  					  我是第二行
  ````

*   读物：

    ​	1.模板字符串

    ​	2.Getting Literal With ES6 Template Strings

    ​	3.A guide to JavaScipt Template Literals

