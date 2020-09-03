const fs = require('fs')
const path = require('path')

/**
 * @description: 遍历文件夹及文件内容
 * @param {String} dir 路径
 * @param {function} callback 读取文件后的函数
 * @param {function} finish 遍历完成后的函数
 * ex:
 * mapDir(
 *  basePath,
 *  function(file) {
 *   console.log('TCL: file', file.toString())
 *   // 读取文件后的处理
 * },
 * function() {
 *   console.log('xxx文件目录遍历完了')
 * }
 */

export function mapDir (dir, callback, finish) {
  fs.readdir(dir, function (err, files) {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((filename, index) => {
      let pathname = path.join(dir, filename)
      fs.stat(pathname, (err, stats) => { // 读取文件信息
        if (err) {
          console.log('获取文件stats失败')
          return
        }
        if (stats.isDirectory()) {
          mapDir(pathname, callback, finish)
        } else if (stats.isFile()) {
          if (['.json', '.less'].includes(path.extname(pathname))) { // 排除 目录下的 json less 文件
            return
          }
          fs.readFile(pathname, (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            callback && callback(data)
          })
        }
      })
      if (index === files.length - 1) {
        finish && finish()
      }
    })
  })
}

/**
 * @description:
 * @param {String} dir 文件路径
 * @param {String} filedirname 需要查找的文件夹名
 * @param {function} callback 成功返回函数
 * @param {function} errorcallback 失败返回函数
 */
export function mapDirName (dir, filedirname, callback, errorcallback) {
  const dirurl = path.join(dir, filedirname)
  fs.access(dirurl, fs.F_OK, (err) => {
    if (err) {
      errorcallback && errorcallback('无效的路径')
      return
    }
    fs.readdir(dirurl, function (err, files) {
      if (err) {
        errorcallback && errorcallback('文件不存在')
        return
      }
      // 只读取文件夹
      const filedir = []
      files.forEach((filename) => {
        const pathname = path.join(dirurl, filename)
        const statInfo = fs.statSync(pathname)
        if (statInfo.isDirectory()) {
          filedir.push(filename)
        }
      })
      callback && callback(filedir)
    })
  })
}
