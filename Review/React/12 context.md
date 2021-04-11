### Context（上下文）

* 公共信息：如语言，切换主题（黑夜到白天），如何传递给每个子组件？
* 使公共信息能较为轻松地在组件之间传递并使用
* 用props太繁琐
* 用redux小题大做

步骤

* 父组件在class外使用`React.createContext`创建`myContext`
* 父组件使用`myContext.Provider  value = {}`向下传递value值付赋给`context`
* 子组件在class用`myChild.contextType = myContext`（`myChild`是子组件名）读取到父组件地context，
* 子组件使用theme = this.context拿到context传过来地value地值

### 生产数据

* 在文件中定义`Context`的默认值

  ```jsx
  // 创建 Context 填入默认值（任何一个 js 变量）
  const ThemeContext = React.createContext('light')
  ```

* 在父组件定义生产者，将子组件包裹，并在`state`中定义控制符

  ```jsx
  class App extends React.Component {
      constructor(props) {
          super(props)
          this.state = {
              theme: 'light'//控制符
          }
      }
      render() {
          return <ThemeContext.Provider value={this.state.theme}>//生产者
             <Toolbar />
             <hr/>
             <button onClick={this.changeTheme}>change theme</button>//控制handler
          </ThemeContext.Provider>
      }
      changeTheme = () => {
          this.setState({
              theme: this.state.theme === 'light' ? 'dark' : 'light'
          })
      }
  }
  ```

### 消费数据

* 给子组件添加`contextType`属性，值为父组件利用`React.createContext()`创建的`context`

* 然后使用`this.contex`来消费数据

  ```jsx
  class ThemedButton extends React.Component {
      // 指定 contextType 读取当前的 theme context。
      // static contextType = ThemeContext // 也可以用 ThemedButton.contextType = ThemeContext
      render() {
          const theme = this.context // React 会往上找到最近的 theme Provider，然后使用它的值。
          return <div>
              <p>button's theme is {theme}</p>
          </div>
      }
  }
  ThemedButton.contextType = ThemeContext // 指定 contextType 读取当前的 theme context。
  ```

* 如果是函数组件

  ```jsx
  // 底层组件 - 函数是组件
  function ThemeLink (props) {
      // const theme = this.context // 会报错。函数式组件没有实例，即没有 this
  
      // 函数式组件可以使用 Consumer
      return <ThemeContext.Consumer>
          { value => <p>link's theme is {value}</p> }
      </ThemeContext.Consumer>
  }
  ```

  

