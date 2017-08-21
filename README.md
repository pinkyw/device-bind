# device-bind

学了两天React后，用一周时间写的，简单的页面，表单的填写、验证和数据回显，成功／失败跳转相应页面。

由于兼容到IE8，数据请求选择的fetch。
没有用第三方组件库，自己抽象了两个组件（select和input）；用router来跳转页面。

## install && run
'''
npm i
npm run start
'''
如果本地9093端口被占用，请在webpack.config.js中改一下。
