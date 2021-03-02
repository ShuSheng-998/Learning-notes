#### 一个JavaScript编译器

* 把大部分浏览器还不支持的特性，编译成js代码使浏览器能够运行（很多新特性能编译成老代码来实现）

* `npm init`

* `npm install --save-dev babel-cli`

* 在`pacage.json`中的`scripts`字段添加`build: babel entry.js`

* 新建`entry.js`

* `npm run build`

* `npm i -D babel-preset-env`

* 新建`.babelrc`文件

* 写入

  ```json
  {
      "presets": [
         [
          "env",
          {
              "targets":{
                  "browsers":["last 1 version"]
              }
          }
         ]
      ]
  }
  ```

* 设置其他配置`https://github.com/browserslist/browserslist`

* 在`pacage.json`中的`scripts`字段`build: babel entry.js`改为`build: babel entry.js -o index.js`作为老代码的输出位置

* 在`pacage.json`中的`scripts`字段，添加`-w`字段，自动编译

* `npm i -D babel-plugin-transform-class-properties`使静态属性符合规则，再在`babelrc`上添加字段

  ```
  "plugins": ["transform-class-properties"]
  ```

  `npmjs.org`上搜索其他插件

