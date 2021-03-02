#### 一、`difineProperty`

* `Object.defineProperty(1,2,3)`
* 1：待修改的对象
* 2：待修改的属性名
* 3：`{value： ， writeble： false}`

#### 二、`Object.freeze(待冻结的引用变量)`

* 所冻结的对象不能再被修改

#### 三、`Object.seal(待处理的对象)`

* 所处理的对象不能再被扩展
* `seal`和`defineProperty`一起使用，可以实现`freeze`（不可需改，不可扩展）

#### 四、`Object.is(待比较的变量1,待比较的变量2)`

* `Object.is(+0，-0)` 	false
* `Object.is(NaN, NaN)`     true

#### 五、Object.assign(最终对象，待合并的对象，...)

* 浅拷贝

#### 六、`Object.key`   `Object.value`   `Object.entries`

* 对象的所有键
* 对象的所有值
* 将对象的每个属性转换成键值对数组