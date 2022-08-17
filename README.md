# vue-music

# Vue 3 + TypeScript + Vite

## 项目初始化和配置

1. 引入`eslint`

使用`pnpm create @eslint/config`进行`eslint`配置。配置可执行命令`"lint": "eslint \"src/**/*.{vue,ts,tsx,js,jsx}\" --fix"`

2. 引入`husky 和 lint-staged`在提交过程中进行校验和`fix`

安装`pnpm add husky lint-staged -D`。
配置`prepare": "husky install"`并执行`npm run prepare`
执行`npx husky add .husky/pre-commit "npx lint-staged"`生成钩子函数文件
配置`lint-staged`

```json
"lint-staged": {
 "src/**/*.{vue,ts}": [
   "eslint --fix"
 ]
},
```

3. 配置`commitlint`

安装`pnpm add @commitlint/cli @commitlint/config-conventional -D`

创建`.commitlintrc.cjs`文件，添加默认规范`@commitlint/config-conventional`

可能记不住命令，添加信息的命令行展示`pnpm add -D commitizen @commitlint/cz-commitlint`，然后配置
`"commit": "git add . && git-cz",`，并且配置`config`。每次要提交就运行`npm run commit`

```js
"config": {
 "commitizen": {
   "path": "@commitlint/cz-commitlint"
 }
},
```

上面我们应用的是`commitlint`插件的`cz`

## git-cz

其实有更好的方式使用自定义配置的`git-cz`, 安装`commitizen git-cz`。然后将上面的配置`path`
引入到`git-cz`的地址`"./node_modules/git-cz"`，创建`changelog.config.cjs`，配置自定义的`git`提交提示

## 项目初始化

1. 解决点击穿透，这是因为 web 页面在点击的时候会判断是否是放大，所以有一个 300ms 的延迟，通过 viewpoint 解决
2. 多个指令的覆盖问题
