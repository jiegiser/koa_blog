/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-02-18 15:20:00
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-02-18 16:32:30
 */

function getFileContent(fileName) {
  const promise = new Promise((resolve, reject) => {
    // 读取文件的操作
  })
  return promise
}

// promise实现
getFileContent('a.json').then(aData => {
  console.log(aData)
  return getFileContent(aData.next)
}).then(bData => {
  console.log(bData)
  return getFileContent(bData.next)
}).then(cData => {
  console.log(cData)
})


// 同步的写法
async function readFileData() {
  // promise的resolve里面的内容直接赋值给了aData
  const aData = await getFileContent('a.json')
  console.log('a data', aData)
  const bData = await getFileContent(aData.next)
  console.log('b data', bData)
  const cData = await getFileContent(bData.next)
  console.log('c data', cData)
}
readFileData()


// 下面的这种方法也是可以的  async函数执行的时候返回的还是promise
async function readData() {
  const aData = await getFileContent('a.json')
  return aData
}

async function test() {
  const aData = await readData()
  console.log(aData)
}
test()

// async await 要点：
// 1. await 后面可以追加 promise 对象，获取 resolve 的值
// 2. await 必须包裹在 async 函数里面
// 3. async 函数执行返回的也是一个 promise 对象
// 4. try-catch 截获 promise 中 reject 的值