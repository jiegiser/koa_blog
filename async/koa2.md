<!--
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-02-18 16:39:01
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-02-19 11:14:55
 -->

# 实现登录

和 `express` 一样，基于 `koa-generic-session` 和 `koa-redis`

# 连接数据库以及防止 xss 攻击

安装两个插件`npm i mysql xss --save`

# 日志
`access log` 记录，使用 `morgan  npm i koa-morgan --save`
自定义日志使用`console.log` 和 `console.error`