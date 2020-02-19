/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-02-19 14:37:28
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-02-19 15:42:40
 */
const http = require('http')
// 组合中间件
function compose(middlewareList) {
  return ctx => {
    // 中间件调用
    function dispath(i) {
      const fn = middlewareList[i]
      try {
        return Promise.resolve(
          // 第二个参数这样实现了next的机制
          fn(ctx, dispath.bind(null, i + 1))
        )
      } catch(err) {
        return Promise.reject(err)
      }
    }
    return dispath(0)
  }
}

class LikeKoa2 {
  constructor() {
    // 中间件存储的地方
    this.middlewareList = []
  }
  use(fn) {
    this.middlewareList.push(fn)
    // 可以一直.use()进行注册中间件
    return this
  }
  createContext(req, res) {
    const ctx = {
      req,
      res
    }
    ctx.query = req.query
    return ctx
  }
  handleRequest(ctx, fn) {
    return fn(ctx)
  }
  callback() {
    const fn = compose(this.middlewareList)
    return (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fn)
    }
  }
  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = LikeKoa2