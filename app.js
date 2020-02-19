/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-02-18 16:58:26
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-02-19 11:46:02
 */
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// pot data
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// 实现登录
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')
// 引入redis 配置
const { REDIS_CONF } = require('./config/db')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger  --中间件是一个异步函数

// 所谓洋葱圈模型，是一个中间件就是一层，中间件开始就是第一层的开始，
// 如果遇到next函数，就会跳转到第二层，等到依次执行下去之后，就开始从最后一层next函数后面继续执行，直到
// 第一层执行到next后面的代码，整个结束
// 碰到next() 方法就会跳转到下一个中间件去执行。
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  // 等待下一个中间件执行完之后再继续执行下面的代码
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 日志记录
const ENV = process.env.NODE_ENV
// https://github.com/expressjs/morgan 查看打印日志的格式
if(ENV != 'production') {
  // 对日志进行配置
  app.use(morgan('dev', {
    // 标准输出，直接输出到控制台
    stream: process.stdout
  }));
} else {
  // 线上环境使用，打印的日志比较详细--将日志写到access.log文件当中
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }))
}

// session 配置
app.keys = ['jiegiser_#812*']
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置 redis
  store: redisStore({
    // all: '127.0.0.1:6379', // 写死本地的 redis
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
// 注册blog路由
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
