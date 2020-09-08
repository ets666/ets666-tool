import { exec } from 'child_process'
const fs = require('fs')
const path = require('path')
const readline = require('readline')

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
  const { setting, job } = info
  const gameSiiPath = path.join(dir, filedirname)
  const fRead = fs.createReadStream(gameSiiPath)
  const arrFile = []
  const skills = []
  const garage = []
  const exper = []
  let hqCity = ''
  const visitedCity = []
  const visitedIndex = {
    city: 0,
    count: 0,
    company: []
  }
  const cityName = new Set()

  fRead.on('end', () => {
    console.log('end')
  })
  const rl = readline.createInterface({
    input: fRead,
    terminal: true
  })

  let index = 0
  rl.on('line', (input) => {
    if (input.startsWith(' hq_city: ')) {
      hqCity = input.split(': ')[1]
    }
    if (setting.money && input.startsWith(' money_account')) {
      input = input.replace(/money_account: [^,\n]+/, 'money_account: 100000000')
    } else if (setting.level && input.startsWith(' experience_points')) {
      exper.push(index)
    } else if (setting.skills && input.startsWith(' adr:')) {
      skills.push(index)
    } else if (setting.damage && input.startsWith(' wear')) {
      input = input.replace(/wear: [^,\n]+/, 'wear: 0')
    } else if (setting.oil && input.startsWith(' fuel_relative')) {
      input = input.replace(/fuel_relative: [^,\n]+/, 'fuel_relative: 1')
    } else if (setting.city && input.startsWith(' companies[')) {
      cityName.add(input.split('.')[3])
    } else if (setting.city && input.startsWith(' visited_cities[')) {
      visitedCity.push(input.split(': ')[1])
    } else if (setting.city && input.startsWith(' visited_cities: ')) {
      visitedIndex.city = index
    } else if (setting.city && input.startsWith(' visited_cities_count: ')) {
      visitedIndex.count = index
    } else if (setting.city && input.startsWith(' reserved_trailer_slot: ')) {
      visitedIndex.company.push(index - 1)
    } else if (setting.garage && input.startsWith('garage : garage.')) {
      if (!input.startsWith('garage : garage.' + hqCity)) {
        garage.push(index)
      }
    } else if (job.moveToCargo && input.startsWith(' truck_placement: ')) {

    }
    arrFile.push(input)
    index++
  })

  rl.on('close', () => {
    if (exper.length > 0) {
      arrFile[exper[0]] = arrFile[exper[0]].replace(/experience_points: [^,\n]+/, 'experience_points: 582499')
    }
    if (skills.length > 0) {
      const flag = skills[0]
      arrFile[flag] = arrFile[flag].replace(/adr: [^,\n]+/, 'adr: 63')
      arrFile[flag + 1] = arrFile[flag + 1].replace(/long_dist: [^,\n]+/, 'long_dist: 6')
      arrFile[flag + 2] = arrFile[flag + 2].replace(/heavy: [^,\n]+/, 'heavy: 6')
      arrFile[flag + 3] = arrFile[flag + 3].replace(/fragile: [^,\n]+/, 'fragile: 6')
      arrFile[flag + 4] = arrFile[flag + 4].replace(/urgent: [^,\n]+/, 'urgent: 6')
      arrFile[flag + 5] = arrFile[flag + 5].replace(/mechanical: [^,\n]+/, 'mechanical: 6')
    }
    if (cityName.size > 0) {
      // console.log([...cityName])
      visitedCity.forEach(element => {
        cityName.delete(element)
      })
      const cityNum = Number(arrFile[visitedIndex.city].split(': ')[1])
      const num = cityNum + cityName.size
      const arrCityName = [...cityName]

      if (cityNum === 0) {
        let str = '\r\n'
        let strCount = '\r\n'
        for (let j = 0; j < arrCityName.length; j++) {
          if (j === arrCityName.length - 1) {
            str += ` visited_cities[${j}]: ${arrCityName[j]}`
            strCount += ` visited_cities_count[${j}]: 1`
          } else {
            str += ` visited_cities[${j}]: ${arrCityName[j]}\r\n`
            strCount += ` visited_cities_count[${j}]: 1\r\n`
          }
        }
        arrFile[visitedIndex.city] = ' visited_cities: ' + num + str
        arrFile[visitedIndex.count] = ' visited_cities_count: ' + num + strCount
      } else {
        let str = '\r\n'
        let strCount = '\r\n'
        for (let j = 0; j < arrCityName.length; j++) {
          const num = j + cityNum
          str += ` visited_cities[${num}]: ${arrCityName[j]}`
          strCount += ` visited_cities_count[${num}]: 1`
          if (j < arrCityName.length - 1) {
            str += '\r\n'
            strCount += '\r\n'
          }
        }
        arrFile[visitedIndex.city] = ' visited_cities: ' + num
        arrFile[visitedIndex.count] = ' visited_cities_count: ' + num

        arrFile[visitedIndex.city + cityNum] += str
        arrFile[visitedIndex.count + cityNum] += strCount
      }

      for (let i = 0; i < visitedIndex.company.length; i++) {
        arrFile[visitedIndex.company[i]] = arrFile[visitedIndex.company[i]].replace(/discovered: [^,\n]+/, 'discovered: true')
      }
    }

    if (garage.length > 0) {
      for (let i = 0; i < garage.length; i++) {
        const vehiclesNum = Number(arrFile[garage[i] + 1].split(': ')[1])
        if (vehiclesNum === 0) {
          let str = '\r\n'
          for (let j = 0; j < 5; j++) {
            if (j === 4) {
              str += ` vehicles[${j}]: null`
            } else {
              str += ` vehicles[${j}]: null\r\n`
            }
          }
          arrFile[garage[i] + 1] = ' vehicles: 5' + str
        } else if (vehiclesNum < 5) {
          let str = '\r\n'
          for (let j = vehiclesNum; j < 5; j++) {
            if (j === 4) {
              str += ` vehicles[${j}]: null`
            } else {
              str += ` vehicles[${j}]: null\r\n`
            }
          }
          arrFile[garage[i] + 1] = ' vehicles: 5'
          arrFile[garage[i] + 1 + vehiclesNum] += str
        }
        const driversNum = Number(arrFile[garage[i] + 2 + vehiclesNum].split(': ')[1])
        if (driversNum === 0) {
          let str = '\r\n'
          for (let j = 0; j < 5; j++) {
            if (j === 4) {
              str += ` drivers[${j}]: null`
            } else {
              str += ` drivers[${j}]: null\r\n`
            }
          }
          arrFile[garage[i] + 2 + vehiclesNum] = ' drivers: 5' + str
        } else if (driversNum < 5) {
          let str = '\r\n'
          for (let j = driversNum; j < 5; j++) {
            if (j === 4) {
              str += ` drivers[${j}]: null`
            } else {
              str += ` drivers[${j}]: null\r\n`
            }
          }
          arrFile[garage[i] + 2 + vehiclesNum] = ' drivers: 5'
          arrFile[garage[i] + 2 + vehiclesNum + driversNum] += str
        }
        arrFile[garage[i] + 4 + vehiclesNum + driversNum] = ' status: 3'
      }
    }

    const buf = Buffer.from(arrFile.join('\r\n'))

    fs.writeFile(gameSiiPath, buf.toString('utf8'), function (err) {
      if (err) {
        console.error('写入失败')
      }
      callback && callback()
    })
  })
}

// export function addJob (dir, filedirname, info, callback, errorcallback) {
//   const { jobInfo } = info
//   const gameSiiPath = path.join(dir, filedirname)
//   const fRead = fs.createReadStream(gameSiiPath)
//   const arrFile = []
//   const companyJobData = []
//   let company = 0
//   companyJobData.push(' target: "' + jobInfo.destination_company + '.' + jobInfo.destination_city + '"')
//   companyJobData.push('expiration_time: 4927')
//   companyJobData.push('urgency: 0')
//   companyJobData.push('shortest_distance_km: ' + jobInfo.trailer_place)
//   companyJobData.push('ferry_time: 0')
//   companyJobData.push('ferry_price: 0')
//   companyJobData.push('cargo: cargo.' + jobInfo.cargo)
//   companyJobData.push('company_truck: volvo_2012_6x4_c')
//   companyJobData.push('trailer_variant: ' + jobInfo.trailer_variant)
//   companyJobData.push('trailer_definition: ' + jobInfo.trailer_definition)
//   companyJobData.push('units_count: ' + jobInfo.units_count)
//   companyJobData.push('fill_ratio: 1')
//   companyJobData.push('trailer_place: 0')

//   fRead.on('end', () => {
//     console.log('end')
//   })
//   const rl = readline.createInterface({
//     input: fRead,
//     terminal: true
//   })

//   let index = 0
//   rl.on('line', (input) => {
//     if (input.startsWith('company : company.volatile.' + jobInfo.departure_company + '.' + jobInfo.departure_city)) {
//       company = index
//     }
//     arrFile.push(input)
//     index++
//   })

//   rl.on('close', () => {
//     let index = company
//     while (!arrFile[index].startsWith('job_offer[')) {
//       index++
//     }
//     const nameless = arrFile[index].split(' ')[2]
//     while (!arrFile[index].startsWith('job_offer_data : ' + nameless)) {
//       index++
//     }
//     arrFile[index + 1] = companyJobData[0]
//     companyJobData.forEach((val, index) => {
//       arrFile[index + 1 + index] = val
//     })
//     const buf = Buffer.from(arrFile.join('\r\n'))
//     fs.writeFile(gameSiiPath, buf.toString('utf8'), function (err) {
//       if (err) {
//         console.error('写入失败')
//       }
//       callback && callback()
//     })
//   })
// }
