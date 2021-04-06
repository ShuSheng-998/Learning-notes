```js
    //深浅拷贝
    function deepClone(obj) {
        let objClone = obj instance of Array ? []:{}
        if(obj && typeof obj === 'object') {
            for(let key in obj){
                if(obj.hasOwnPropertty(key)){
                    if(obj[key] && typeof obj[key] === 'object'){
                        objClone[key] = deepClone(obj[key])
                    }else {
                        objClone[key] = obj[key]
                    }
                }
            }
        } 
        return objClone
    }
```
```js
    //instanof 
    function instanceOf(A, B) {
        let p = A
        while(p) [
            if(p === B.prototype) {
                return true
            }
            p = p.__proto__
        ]
        return false
    }
```
```js
    //寄生组合式集成
    function Parent(name) {
        this.name = name
    }

    function Child(name, age) {
        Parent.call(this,name)
        this.age = age
    }
    let  fNOP = function () {}
    fNOP.prototype = Parent.prototype
    Child.prototype = new fNOP()
```
```js
    //bind实现
    function bindThis(context, ...outerArgs){
        let self = this
        let fNOP = function() {}

        let fBound = function (...innerArgs) {
            self.apply(this instanceof fBound ? this:context, outerArgs.concat(innerArgs))
        }
        fNOP.prototype = this.prototype
        fBound.prototype = new fNOP()

        return fBound
    }
```
```js
    //柯里化
    function curry(fn, ...outerArgs) {
        let len = fn.length
        outerArgs = outerArgs || []
        return function(...innerArgs) {
            let _args = outerArgs.concat(innerArgs)
            if(_args.length < len){
                return curry.call(this,fn,_args)
            }else{
                return curry.apply(this,_args)
            }
        }
    }
```
```js
    //数组扁平化
    function flatten(array) {
        let res = []
        for(let key in array){
            if(array[key] instance of Array){
                res = res.concat(flatten(array[key]))
            }else{
                res = res.concat(array[key])
            }
        }
        return res
    }
```
```js
    //new 实现
    function creatObj() {
        
    }
```
```js
    //防抖
    function debounce(func, wait, immediate){
        let timeout, result

        return function() {
            let context = this,
                args = arguments

            if(timeout) clearTimeout(timeout)

            if(immediate){
                let calNow = !timeout
                timeout = setTimeout(function(){
                    timeout = null
                },wait)
                if(calNow){
                    result = func.apply(context, args)
                }
            }else{
                timeout = setTimeout(function() {
                    func.apply(context, args)
                },wait)
            }
            return result
        }
    }
```

```js
    //节流
    function throttle(func, wait) {
        let timeout,result
        return function() {
            let context = this,
                args =arguments
            if(!timeout) {
                timeout = setTimeout(function(){
                    timeout = null
                    result = func.apply(context, args)
                },wait)
            }
            return result
        }
    }
```