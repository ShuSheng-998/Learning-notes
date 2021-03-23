## 一. 什么是Tree-shaking

具体来说，**在 webpack 项目中，有一个入口文件**，相当于一棵树的主干，**入口文件有很多依赖的模块**，相当于树枝。实际情况中，**虽然依赖了某个模块，但其实只使用其中的某些功能**。通过 tree-shaking，**将没有使用的模块摇掉，这样来达到删除无用代码的目的。**

## 二. tree-shaking的原理

![img](https://user-gold-cdn.xitu.io/2018/1/4/160bfd6b8cae9900?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**Tree-shaking的本质是消除无用的js代码。**无用代码消除在广泛存在于传统的编程语言编译器中，编译器可以判断出某些代码根本不影响输出，然后消除这些代码，这个称之为DCE（dead code elimination）。

Tree-shaking 是 DCE 的一种新的实现，Javascript同传统的编程语言不同的是，javascript绝大多数情况需要通过网络进行加载，然后执行，加载的文件大小越小，整体执行时间更短，**所以去除无用代码以减少文件体积，对javascript来说更有意义。**

Tree-shaking 和传统的 DCE的方法又不太一样，传统的DCE 消灭不可能执行的代码，而Tree-shaking 更关注宇消除没有用到的代码。下面详细介绍一下DCE和Tree-shaking。

### **Tree-shaking消除大法**

前面提到了tree-shaking更关注于无用模块的消除，消除那些引用了但并没有被使用的模块。

![img](https://user-gold-cdn.xitu.io/2018/1/4/160bfd6bb8832182?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

ES6 module 特点：

- 只能作为模块顶层的语句出现
- import 的模块名只能是字符串常量
- import binding 是 immutable的（模块的输出是接口）

**ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。**

```
ES6模块暴露的是一个个接口，入口文件在编译的时候对于所依赖的模块就确定了其结果，而不是在模块运行时确定的
```

所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6之前的模块化，比如我们可以动态require一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。

这是 ES6 modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS，正是基于这个基础上，才使得 tree-shaking 成为可能，这也是为什么 rollup 和 webpack 2 都要用 ES6 module syntax 才能 tree-shaking。

### 注意事项

* **rollup只处理函数和顶层的import/export变量，不能把没用到的类的方法消除掉**

* **javascript动态语言的特性使得静态分析比较困难（删除的类中可能包含某些其他方法的扩展，比如对数组方法的扩展）**




