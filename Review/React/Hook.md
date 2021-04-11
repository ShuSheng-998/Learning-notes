# Hook简介

### 什么是hook

*Hook* 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性（类似生命周期函数的useEffect）。

```jsx
import React, { useState } from 'react';

function Example() {
  // 声明一个新的叫做 “count” 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

#### 在组件之间复用状态逻辑困难

你可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。**Hook 使你在无需修改组件结构的情况下复用状态逻辑。** 这使得在组件间或社区内共享 Hook 变得更便捷。

#### 复杂组件难以理解

**每个生命周期常常包含一些不相关的逻辑。**例如，组件常常在 `componentDidMount` 和 `componentDidUpdate` 中**获取数据**。但是，同一个 `componentDidMount` 中**可能也包含很多其它的逻辑，如设置事件监听**，**而之后需在 `componentWillUnmount` 中清除。**相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。

在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。这也给测试带来了一定挑战。同时，这也是很多人将 React 与状态管理库结合使用的原因之一。但是，这往往会引入了很多抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难。

为了解决这个问题，**Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**，而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。

# State Hook

#### 使用State Hook

```js
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

* 在这里，`useState` 就是一个 *Hook* （**钩子**）
* 通过在**函数组件里调用它来给组件添加一些内部 state**。React 会在重复渲染时保留这个 state。
* **参数：**初始 state

* **返回值：当前**状态和一个让用于更新它的函数，类似 class 组件的 `this.setState`，类似 class 组件的 `this.setState`
* 使用：直接使用，不再调用`this.state.count`，而是`count`

#### 声明多个 state 变量

你可以在一个组件中多次使用 State Hook:

```
function ExampleWithManyStates() {
  // 声明多个 state 变量！
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
```

# Effect Hook

#### 使用Effect Hook

`useEffect` 就是一个 Effect Hook，给函数组件增加了操作副作用（数据获取，订阅）的能力。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。（我们会在[使用 Effect Hook](https://react.docschina.org/docs/hooks-effect.html) 里展示对比 `useEffect` 和这些方法的例子。）

例如，下面这个组件在 React 更新 DOM 后会设置一个页面标题：

```js
import React, { useState, useEffect } from 'react';
function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:  useEffect(() => {    // 使用浏览器的 API 更新页面标题    document.title = `You clicked ${count} times`;  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

#### 参数不同，具体表现不同

* 当不传递第二个参数时，每次render都会执行一遍callback函数，相当于包含第一遍render（ComponentDidMount）的`componentDidUpdate`

* 当传递第二个参数且是空数组时，只有第一次render才会执行callback，类似于`componentDidMount`

* 不管是否传递第二个参数，只要在`callback`中return 一个函数，就相当于告诉react此组件挂掉之前执行什么操作，类似于`componentWillUnMount`

# Context  Hook

[`useContext`](https://react.docschina.org/docs/hooks-reference.html#usecontext) 让你不使用组件嵌套就可以订阅 React 的 Context。

另外 [`useReducer`](https://react.docschina.org/docs/hooks-reference.html#usereducer) 可以让你通过 reducer 来管理组件本地的复杂 state。

```
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);  // ...
```

# 使用规则

Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：

- 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 **React 的函数组件**中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中。）

# 自定义Hook

我们介绍了一个叫 `FriendStatus` 的组件，它通过调用 `useState` 和 `useEffect` 的 Hook 来订阅一个好友的在线状态。假设我们想在另一个组件里重用这个订阅逻辑。

首先，我们把这个逻辑抽取到一个叫做 `useFriendStatus` 的自定义 Hook 里：

```js
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

它将 `friendID` 作为参数，并返回该好友是否在线：

现在我们可以在两个组件中使用它：

```jsx
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);
  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}

function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);
  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**这两个组件的 state 是完全独立的。Hook 是一种复用*状态逻辑*的方式，它不复用 state 本身。**事实上 Hook 的**每次*调用*都有一个完全独立的 state** —— 因此你可以在单个组件中多次调用同一个自定义 Hook。

**自定义 Hook 更像是一种约定而不是功能**。如果函数的名字以 “`use`” 开头并调用其他 Hook，我们就说这是一个自定义 Hook。 `useSomething` 的命名约定可以让我们的 linter 插件在使用 Hook 的代码中找到 bug。

你可以创建涵盖各种场景的自定义 Hook，如表单处理、动画、订阅声明、计时器，甚至可能还有更多我们没想到的场景。我们很期待看到 React 社区会出现什么样的自定义 Hook。