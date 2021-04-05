# fiber

## 老架构

**React15架构分为两层：**

- **Reconciler**（协调器）——复制找出变化的组件
- **Render**（渲染器）——负责将变化的组件渲染到页面上

**React快速响应的两个关键问题**

- **CPU瓶颈**：在浏览器每一帧时间中，留一部分给JS线程，用于React更新组件，如果时间不够，则将控制权交给浏览器使其渲染UI，React等待下一帧的时间来继续刚中断的工作。（时间切片）
- **IO瓶颈**：将人机交互研究的结果整合到真实的 UI 中

为了解决这两个问题，react团队经过两年的工作，重写了react中核心算法——[reconciliation](https://reactjs.org/docs/reconciliation.html)。并在v16版本中发布了这个新的特性。为了区别之前和之后的reconciler，通常将之前的reconciler称为stack reconciler，重写后的称为fiber reconciler，简称为Fiber。

1. 作为**架构**，**构成Fiber树**

2. 作为**静态数据结构**，保存**组件相关信息**

3. 作为**工作单元**保存**更新信息**

* 单个组件来看，Reconciler更新工作从递归变成了**可以中断的循环过程**。每次循环都会调用shouldYield判断是否有剩余时间。
* 整个页面的组件来看，同样解决了更新时**DOM渲染不完全的问题**，Reconciler与Renderer不再是交替工作，整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。

## 卡顿原因

Stack reconciler的**工作流程很像函数的调用过程。**父组件里调子组件，可以类比为函数的递归（这也是为什么被称为stack reconciler的原因）。在setState后，react会立即开始reconciliation过程，从父节点（Virtual DOM）开始遍历，以找出不同。将所有的Virtual DOM遍历完成后，reconciler才能给出当前需要修改真实DOM的信息，并传递给renderer，进行渲染，然后屏幕上才会显示此次更新内容。对于特别庞大的vDOM树来说，reconciliation过程会很长(x00ms)，在这期间，主线程是被js占用的，因此任何交互、布局、渲染都会停止，给用户的感觉就是页面被卡住了。



![img](https://user-gold-cdn.xitu.io/2018/3/25/1625d95c71288586?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## Scheduler

* 新增调度器

scheduling(调度)是fiber reconciliation的一个过程，主要决定应该在何时做什么。👆的过程表明在stack reconciler中，**reconciliation是“一气呵成”**，对于函数来说，这没什么问题，因为我们只想要函数的运行结果，但对于UI来说还需要考虑以下问题：

- 并不是所有的state更新都需要立即显示出来，比如屏幕之外的部分的更新
- 并不是所有的更新优先级都是一样的，比如用户输入的响应优先级要比通过请求填充内容的响应优先级更高
- 理想情况下，对于某些高优先级的操作，应该是可以打断低优先级的操作执行的，比如用户输入时，页面的某个评论还在reconciliation，应该优先响应用户输入

所以理想状况下reconciliation的过程应该是像下图所示一样，每次只做一个很小的任务，做完后能够“喘口气儿”，回到主线程看下有没有什么更高优先级的任务需要处理，如果又则先处理更高优先级的任务，没有则继续执行([cooperative scheduling 合作式调度](https://www.w3.org/TR/requestidlecallback/))。



![img](https://user-gold-cdn.xitu.io/2018/3/25/1625d95c5e30223b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## 任务拆分 fiber-tree & fiber

先看一下stack-reconciler下的react是怎么工作的。代码中创建（或更新）一些元素，react会根据这些元素创建（或更新）Virtual DOM，然后react根据更新前后virtual DOM的区别，去修改真正的DOM。注意，**在stack reconciler下，DOM的更新是同步的，也就是说，在virtual DOM的比对过程中，发现一个instance有更新，会立即执行DOM操作**。



![img](https://user-gold-cdn.xitu.io/2018/3/25/1625d95bc368e5f5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



而**fiber-conciler下，reconciler操作是可以分成很多小部分，并且可以被中断的**，**所以同步操作DOM可能会导致fiber-tree与实际DOM的不同步。**对于每个节点来说，其不光存储了对应元素的基本信息，还要保存一些用于任务调度的信息。因此，**fiber仅仅是一个对象**，表征reconciliation阶段所能拆分的最小工作单元，和上图中的react instance一一对应。通过`stateNode`属性管理Instance自身的特性。通过**child和sibling表征当前工作单元的下一个工作单元**，return表示处理完成后**返回结果所要合并的目标**，通常指向父节点。整个结构是一个链表树。**每个工作单元（fiber）执行完成后，都会查看是否还继续拥有主线程时间片，如果有继续下一个，如果没有则先处理其他高优先级事务，等主线程空闲下来继续执行。**



![img](https://user-gold-cdn.xitu.io/2018/3/25/1625d95bc781908d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



```
fiber {
  	stateNode: {},
    child: {},
    return: {},
    sibling: {},
}
```

# 优先级



![img](https://user-gold-cdn.xitu.io/2018/3/25/1625d95cf4113203?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



```
module.exports = {
  NoWork: 0, // No work is pending.
  SynchronousPriority: 1, // For controlled text inputs. Synchronous side-effects.
  AnimationPriority: 2, // Needs to complete before the next frame.
  HighPriority: 3, // Interaction that needs to complete pretty soon to feel responsive.
  LowPriority: 4, // Data fetching, or result from updating stores.
  OffscreenPriority: 5, // Won't be visible but do the work in case it becomes visible.
};
复制代码
```

优先级策略的核心是，在reconciliation阶段，低优先级的操作可以被高优先级的操作打断，并让主线程执行高优先级的更新，以时用户可感知的响应更快。**值得注意的一点是，当主线程重新分配给低优先级的操作时，并不会从上次工作的状态开始，而是从新开始。**

这就可能会产生两个问题：

- 饿死：正在实验中的方案是重用，也就是说高优先级的操作如果没有修改低优先级操作已经完成的节点，那么这部分工作是可以重用的。
- 一次渲染可能会调用多次声明周期函数

# 生命周期函数



![img](https://user-gold-cdn.xitu.io/2018/3/25/1625d95d14c4415e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



对于某些情况来说，phase1阶段的生命周期函数可能会不止执行一次。比如说，当一个低优先级的componentWillUpdate执行之后，被高优先级的打断，高优先级执行完之后，再回到低优先级的操作中来，componentWillUpdate可能会再执行一次。对于某些只期望执行一次，或者需要在两个生命周期函数的操作中执行对称操作的情况而言，要考虑这种case，确保不会让整个App crash掉。



![img](https://user-gold-cdn.xitu.io/2018/3/25/1625d95d1383a2b0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

# fiber工作原理

#### 双缓存技术

直接在**内存中构建**并且**替换**的技术叫做双缓存技术。

React使用“双缓存”来完成**Fiber树的构建与替换**——**对应着DOM树的创建与更新。**

#### 双缓存Fiber树

react最多会同时存在两棵树：

- 屏幕上显示对应的Fiber树`current Fiber`树
- 正在内存构建的Fiber树`workInProgress Fiber`树
- 两棵树的节点通过`alternate`连接
- 每次更新都会产生新的`workInProgress Fiber`树，react通过`current`指针的指向来确定当前的`current Fiber`
- `workInProgress fiber`的创建可以**复用**`current Fiber树`对应的节点数据。是否复用取决于`diff`算法