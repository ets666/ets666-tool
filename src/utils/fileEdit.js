import { exec } from 'child_process'
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
 * @description:查找文件夹名字
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

/**
 * @description: 文件路径是否存在
 * @param {String} dir 文件路径
 * @param {String} filedirname 需要查找的文件夹名
 * @param {function} callback 成功返回函数
 * @param {function} errorcallback 失败返回函数
 */
export function isExists (dir, filedirname, callback, errorcallback) {
  const dirurl = path.join(dir, filedirname)
  fs.access(dirurl, fs.F_OK, (err) => {
    if (err) {
      errorcallback && errorcallback('无效的路径')
      return
    }
    const flag = true
    callback && callback(flag)
  })
}

/**
 * @description: 解码game.sii
 * @param {String} dir 文件路径
 * @param {function} callback 成功返回函数
 * @param {function} errorcallback 失败返回函数
 */
export function SiiDecrypt (dir, callback, errorcallback) {
  const siiPath = path.join(process.cwd(), '/resources/SII_Decrypt.exe')
  const gameSiiPath = path.join(dir, '/game.sii')
  const backSiiPath = path.join(dir, '/game_bak.sii')
  fs.access(gameSiiPath, fs.F_OK, (err) => {
    if (err) {
      errorcallback && errorcallback('没有找存档')
      return
    }
    const statInfo = fs.statSync(gameSiiPath)
    // 判断是否解码
    if (statInfo.size > 517912) {
      const code = 1
      callback && callback(code)
    } else {
      // backup
      fs.copyFileSync(gameSiiPath, backSiiPath)
      // 解码
      const cmdStr = siiPath + ' "' + gameSiiPath + '"'
      // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
      const workerProcess = exec(cmdStr, {})

      // 打印错误的后台可执行程序输出
      workerProcess.stderr.on('data', function (data) {
        errorcallback && errorcallback('解码失败')
      })

      // 退出之后的输出
      workerProcess.on('close', function (code) {
        callback && callback(code)
      })
    }
  })
}

/**
 * @description: 修改存档信息
 * @param {String} dir 文件路径
 * @param {String} filedirname 需要查找的文件夹名
 * @param {function} callback 成功返回函数
 * @param {function} errorcallback 失败返回函数
 */
export function editGameSii (dir, filedirname, info, callback, errorcallback) {
  const {setting, jobInfo, job} = info
  console.log(setting)
  console.log(jobInfo)
  console.log(job)
  const gameSiiPath = path.join(dir, filedirname)
  fs.readFile(gameSiiPath, (err, data) => {
    if (err) {
      errorcallback && errorcallback('读取存档失败')
      return
    }
    let gameInfo = data.toString()
    if (setting.money) {
      const subStr = new RegExp(/money_account: [^,\n]+/)
      gameInfo = gameInfo.replace(subStr, 'money_account: 100000000')
    }
    if (setting.level) {
      const subStr = new RegExp(/experience_points: [^,\n]+/)
      gameInfo = gameInfo.replace(subStr, 'experience_points: 582499')
    }
    if (setting.skills) {
      const subAdr = new RegExp(/adr: [^,\n]+/)
      gameInfo = gameInfo.replace(subAdr, 'adr: 63')
      const subDist = new RegExp(/long_dist: [^,\n]+/)
      gameInfo = gameInfo.replace(subDist, 'long_dist: 6')
      const subHeavy = new RegExp(/heavy: [^,\n]+/)
      gameInfo = gameInfo.replace(subHeavy, 'heavy: 6')
      const subFragile = new RegExp(/fragile: [^,\n]+/)
      gameInfo = gameInfo.replace(subFragile, 'fragile: 6')
      const subUrgent = new RegExp(/urgent: [^,\n]+/)
      gameInfo = gameInfo.replace(subUrgent, 'urgent: 6')
      const subMechanical = new RegExp(/mechanical: [^,\n]+/)
      gameInfo = gameInfo.replace(subMechanical, 'mechanical: 6')
    }

    if (setting.city) {
      // const subStr = new RegExp(/money_account: [^,\n]+/)
      // gameInfo = gameInfo.replace(subStr, 'money_account: 100000000')
    }

    if (setting.garage) {
      // const subStr = new RegExp(/money_account: [^,\n]+/)
      // gameInfo = gameInfo.replace(subStr, 'money_account: 100000000')
    }
    if (setting.damage) {
      const subStr = new RegExp(/wear: [^,\n]+/g)
      gameInfo = gameInfo.replace(subStr, 'wear: 0')
    }
    if (setting.oil) {
      const subStr = new RegExp(/fuel_relative: [^,\n]+/g)
      gameInfo = gameInfo.replace(subStr, 'fuel_relative: 1')
    }
    const buf = Buffer.from(gameInfo)
    buf.toString('utf8')
    fs.writeFile(gameSiiPath, gameInfo, function (err) {
      if (err) {
        console.error('写入失败')
      }
      callback && callback()
    })
  })
}
