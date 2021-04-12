/* instanceof */
function myInstanceOf(A, B) {
    if(typeof A == null || typeof A !== 'object') return false
    let p = A
    while(A){
        if(A.__proto__ === B.prototype){
            return true
        }
        p = A.__proto__
    }
    return false
}

/* 数组扁平化 */
function flatten(arr){
    let res = [],
        len = arr.length
    for(let i =0;i<len;i++){
        if(arr[i] instanceof Array){
            res.concat(flatten(arr[i]))
        }else{
            res.concat(arr[i])
        }
    }
    return res
}

/* 浅拷贝 */
function shallowCopy(obj) {
    let newObj = {}
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            newObj[key] = obj[key]
        }
    }
    return newObj
}
/* 深拷贝 */
function deepClone(obj) {
    let res = obj instanceof Array ? []:{}
    if(obj && typeof obj == 'object'){
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                if(obj[key] && typeof obj[key] == 'object'){
                    res[key] = deepClone(obj[key])
                }else{
                    res[key] = obj[key]
                }
            }
        }
    }
    return res
}

/* bind */
function myBind(context, ...outerArgs){
    let self = this
    let fNop = function(){}

    let fBound = function(...innerArgs){
        return self.apply(this instanceof fBound? this:context, outerArgs.concat(innerArgs))
    }
    fNop.prototype = self.prototype
    fBound.prototype = new fNop()
    return fBound
}

/* 防抖 */
function debounce(func, wait, immediate){
    let timeout, res

    return function(){
        let context = this,
            args = arguments
        if(timeout) clearTimeout(timeout)

        if(immediate){
            let calNow = !timeout

            timeout = setTimeout(function(){
                timeout = null
            },wait)
            if(calNow){
                res = func.apply(context, args)
            }
        }else{
            setTimeout(function(){
                func.apply(context, args)
            }, wait)
        }
        return res
    }
}
/* 节流 */
function throttle(func, wait){
    let timeout,res

    return function(){
        let context = this,
            args = arguments
        if(!timeout){
            timeout = setTimeout(function(){
                timeout = null
                res = func.apply(context, args)
            },wait)
        }
        return res
    }
}
/* 函数柯里化 */
function curry(func, ...outerArgs){
    let len = func.length,
    outerArgs = outerArgs || []

    return function(...innerArgs){
        let args = outerArgs.concat(innerArgs)

        if(args.length < len) {
            return curry.call(context, fn, args)
        }else{
            return func.apply(context, args)
        }
    }
}

/* XHR */
var xhr = new XMLHttpRequest()
xhr.open('get', 'example', true)
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
            alert(xhr.responseText)
        }else{
            alert(xhr.status)
        }
    }
}

/* fetch */
fetch('http://127.0.0.1',{
    method:'POST',
    headers:{
        name:'key'
    },
    body:'name=key&password=root'
})

/* 乱序 */
arr.sort(() => Math.random() - 0.5)

/* 实现map */
Array.prototype.map2 = function(func, context){
    let arr = Object(this)
    let res = []
    for(let i = 0;i<arr.length;i++){
        if(i in arr){
            res.push(func.call(context, arrp[i], i, arr))
        }
    }
    return res
}

/* 实现filter */
Array.prototype.filter2 = function(func,context){
    let arr = Object(this)
    let res = []
    for(let i = 0;i<arr.length;i++){
        if(i in arr){
            if(fn.call(context, arr[i], i,arr)){
                res.push(arr[i])
            }
        }
    }
    return res
}

/* 实现Promise.all */
Promise.all = function(promises){
    return new Promise((resolve, reject) => {
        //创建结果和拿到数组长度
        let res = [],
            len = promises.length
        //如果没有长度，直接resolve返回
        if(len == 0){
            resolve(res)
            return
        }
        //遍历promise数组，直到所有项得结果都拿到
        let index = 0
        for(let i = 0;i<len;i++){
            Promise.resolve(promises[i]).then((data) => {
                res[index++] = data
                if(index === len) return 
            }).catch(e => {
                reject(e)
            })
        }
    })
}

/* 实现Promise.race */
Promise.prototype.race = function(promises){
    return new Promise((resolve, reject) => {
        let res = [],
            len = promises.length
        
        if(len === 0){
            resolve(res)
            return
        }

        let index = 0
        //遍历promise数组，只要其中一个拿到结果就返回
        for(let i =0;i<len;i++){
            Promise.resolve(promises[i]).then((data) => {
                res[index++] = data
                return
            }).catch(e => {
                reject(e)
                return
            })
        }
    })
}

/* call实现 */
Function.prototype.call = function(obj = window){
    obj.fn = this//拿到方法名
    let args = [...arguments].splice(1)//拿到参数
    let res = obj.fn(...args)//以方法名和参数获得结果
    delete obj.fn
    return res
}

/* apply实现 */
Function.prototype.apply = function(obj = window){
    obj.fn = this
    let args = this.arguments[1]
    let res = args? obj.fn(...args):boj.fn()
    delete obj.fn
    return res
}