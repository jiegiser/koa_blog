/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2019-12-31 08:45:44
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-02-19 10:33:33
 */
// 引入xss
const xss = require('xss')
const { exec } = require('../db/mysql')
const getList = async (auth, keyword) => {
  let sql = `select * from blogs where 1 = 1 `
  if(auth) {
    sql += `and author = '${auth}' `
  }
  if(keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`
  // 返回promise对象
  return await exec(sql)
}

const getDetail = async (id) => {
  const sql = `select * from blogs where id = '${id}'`
  // return await exec(sql).then(rows => {
  //   return rows[0]
  // })
  const rows = await exec(sql)
  return rows[0]
}
const newBlog = async (blogData = {}) => {
  // 防止xss攻击
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = blogData.author
  const createTime = Date.now()

  const sql = `
    insert into blogs (title, content, createtime, author)
    values ('${title}', '${content}', '${createTime}', '${author}');
  `
  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
  // return exec(sql).then(insertData => {
  //   return {
  //     id: insertData.insertId
  //   }
  // })
}

const updateBlog = async (id, blogData = {}) => {
  // id为要更新博客的id
  const title = blogData.title
  const content = blogData.content
  const sql = `
    update blogs set title = '${title}', content = '${content}' where id = ${id}
  `
  const updateData = await exec(sql)
  if(updateData.affectedRows > 0) {
    return true
  }
  return false
  // return exec(sql).then(updateData => {
  //   if(updateData.affectedRows > 0) {
  //     return true
  //   }
  //   return false
  // })
}
const delBlog = async (id, author) => {
  const sql = `delete from blogs where id = '${id}' and author='${author}'`
  const delData = await exec(sql)
  if(delData.affectedRows > 0) {
    return true
  }
  return false
  // return exec(sql).then(delData => {
  //   if(delData.affectedRows > 0) {
  //     return true
  //   }
  //   return false
  // })
}
module.exports = { 
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}