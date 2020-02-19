/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-02-11 15:18:50
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-02-19 10:40:44
 */
const { ErrorModel } = require('../model/resModel')

// 写一个中间件
module.exports = async (ctx, next) => {
  if(ctx.session.username) {
    // 已经登录了
    await next()
    return
  }
  ctx.body = new ErrorModel('未登录')
}