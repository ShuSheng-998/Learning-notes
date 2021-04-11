## VDOM

* 概念：模拟真实DOM的JS对象树（Vnode包含节点的基本属性），他会计算出用户操作前后最小的变更，然后操作DOM
* 为什么需要
  * 提高开发效率：开发者可以**不必自己真正的去操作DOM**，事件处理，**而更去注重业务逻辑的改变**
  * 提升性能：**频繁地操作DOM本身是一个非常损耗性能操作。**VDOM也无法避免这个问题，但是**他的优势在于diff算法和批处理策略**。**React在更新页面前会提前计算最小更新范围和如何更新DOM**，虽然我们也能做，但是会耗费很多心力，而且往往我们做得比他差。如何更高效地更新，而不是如何操作DOM更快。
  * 事件机制：React基于VDOM自己实现了一套事件机制，自己模拟了事件冒泡捕获地过程，采用了事件代理，批量更新等方法，抹平了浏览器地兼容问题。
* React Fiber中
  * **diff在具体的对比操作，发生在对fiber的对比（key值、属性值、标签类型的对比）**
  * react diff的过程是**对fiber树的链表化的遍历**，**因为fiber中存储了对兄弟节点和父节点的引用**

## Diff算法

为了降低算法地复杂度，diff采用了三个准则（diff在具体的对比操作上，发生在对fiber的对比）

* 只对同级元素做diff，如果一个DOM节点在更新前后跨越了一个层级，那么react不会尝试复用他
* 对于不同类型地元素，比如从div变成了p标签。那么react会销毁div及其子节点，然后创建p及其子节点
* 开发者可通过key来暗示哪些元素能够在不同地渲染下保持稳定

步骤

1. 用JS对象模拟DOM对象（虚拟DOM）
2. 把虚拟DOM转成真实DOM并挂载到页面上
3. 在用户操作后，需要改变页面，react会修改对应的虚拟DOM，比较两颗DOM树的差异，得到差异对象
4. 然后把差异对象应用到真实的DOM树上

#### 单节点Diff

对于单个节点，会进入以下流程

[![diff](https://camo.githubusercontent.com/b029d3a3404ae29ee31a17ad8975eb8e842c50fa6a5cdd40a49584cf81971543/68747470733a2f2f72656163742e69616d6b61736f6e672e636f6d2f696d672f646966662e706e67)](https://camo.githubusercontent.com/b029d3a3404ae29ee31a17ad8975eb8e842c50fa6a5cdd40a49584cf81971543/68747470733a2f2f72656163742e69616d6b61736f6e672e636f6d2f696d672f646966662e706e67)

第二步**判断 DOM 点是否可以复用**的实现方式

对于单个节点的diff，React会先判断key是否相同

- 若key相同，则判断type是否相同，只有都相同，该节点可复用
- 若key相同，type不相同代表我们已经找到本次更新的`p`对应的上次的`fiber`，但是`p`与`li` `type`不同，不能复用。既然唯一的可能性已经不能复用，则剩下的`fiber`都没有机会了，所以都需要标记删除。（**删除其兄弟fiber**）
- 当`key不同`时只代表遍历到的该`fiber`不能被`p`复用，后面还有兄弟`fiber`还没有遍历到。仅删除当前child

```
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement
): Fiber {
  const key = element.key
  let child = currentFirstChild

  // 首先判断是否存在对应DOM节点
  while (child !== null) {
    // 上一次更新存在DOM节点，接下来判断是否可复用

    // 首先比较key是否相同
    if (child.key === key) {
      // key相同，接下来比较type是否相同

      switch (child.tag) {
        // ...省略case

        default: {
          if (child.elementType === element.type) {
            // type相同则表示可以复用
            // 返回复用的fiber
            return existing
          }

          // type不同则跳出循环
          break
        }
      }
      // 代码执行到这里代表：key相同但是type不同
      // 将该fiber及其兄弟fiber标记为删除
      deleteRemainingChildren(returnFiber, child)
      break
    } else {
      // key不同，将该fiber标记为删除
      deleteChild(returnFiber, child)
    }
    child = child.sibling
  }

  // 创建新Fiber，并返回 ...省略
}
```

React 通过先判断 key 是否相同，如果 key 相同则判断 type 是否相同，只有都相同时一个 DOM 节点才能复用

#### 多节点Diff

一般而言，节点更新的所有情况为，**节点更新，节点新增或减少，节点位置变化。**

同级多个节点的 Diff，一定属于以上三种情况中的一种或多种。 React 团队发现，在日常开发中，相较于新增和删除，**更新组件发生的频率更高**。所以 Diff 会**优先判断当前节点是否属于更新**。

##### 情况 1：节点更新

```
// 之前
<ul>
  <li key="0" className="before">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况1 —— 节点属性变化
<ul>
  <li key="0" className="after">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况2 —— 节点类型更新
<ul>
  <div key="0">0<li>
  <li key="1">1<li>
</ul>
```

##### 情况 2：节点新增或减少

```
// 之前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 之后 情况1 —— 新增节点
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
  <li key="2">2<li>
</ul>

// 之后 情况2 —— 删除节点
<ul>
  <li key="1">1<li>
</ul>
```

##### 情况 3：节点位置变化（乱序）

```
// 之前
<ul>
  <li key="0">0<li>
  <li key="1">1<li>
</ul>

// 之后
<ul>
  <li key="1">1<li>
  <li key="0">0<li>
</ul>
```

## 总结

#### React组件的渲染流程

* 组件在用`JSX`语法编写完成后，最终编译时会被当成`React.createElement()`语法创建的节点，只是Babelb帮我们完成了编译。