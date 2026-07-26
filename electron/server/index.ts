import { promisify } from 'util'
import { exec } from 'child_process'
import { app, dialog, ipcMain, shell } from 'electron'
import Store from 'electron-store'
import { readFileSync, copyFileSync, writeFile, readdir, access, constants, statSync } from 'fs'
import path from 'path'
import { platform } from 'os'
// @ts-ignore
import showdown from 'showdown'
import info from '../../package.json'
import { SIIDecryptor } from "@trucky/sii-decrypt-ts";
import axios from 'axios'
import https from 'https'


const execAsync = promisify(exec)
const store = new Store()
const isMac = platform() === 'darwin'

let AMERICAN_PATH = ''
let EURO_PATH = ''
if (isMac) {
  EURO_PATH = path.join(app.getPath('appData'), '/Euro Truck Simulator 2')
  AMERICAN_PATH = path.join(app.getPath('appData'), '/American Truck Simulator')
} else {
  EURO_PATH = path.join(app.getPath('documents'), '/Euro Truck Simulator 2')
  AMERICAN_PATH = path.join(app.getPath('documents'), '/American Truck Simulator')
}

if (!store.get('pathType') || !store.get('path')) {
  store.set('pathType', 'documents')
  store.set('path', EURO_PATH)
} else if (store.get('pathType') === 'documents' && store.get('path') !== EURO_PATH) {
  store.set('path', EURO_PATH)
} else if (store.get('pathType') !== 'documents' && store.get('path') === EURO_PATH) {
  store.set('pathType', 'documents')
}

if (!store.get('aPathType') || !store.get('aPath')) {
  store.set('aPathType', 'documents')
  store.set('aPath', AMERICAN_PATH)
} else if (store.get('aPathType') === 'documents' && store.get('aPath') !== AMERICAN_PATH) {
  store.set('aPath', AMERICAN_PATH)
} else if (store.get('aPathType') !== 'documents' && store.get('aPath') === AMERICAN_PATH) {
  store.set('aPathType', 'documents')
}
// read file data
const fileWrite = (path: string, buf: Buffer) => {
  return new Promise((resolve, reject) => {
    writeFile(path, buf.toString('utf8'), (err: any) => {
      if (err) {
        reject(err)
      }
      resolve(1)
    })
  })
}

// read file name
const fileDir = (dir: string) => {
  return new Promise((resolve, reject) => {
    readdir(dir, (err: any, files: string[]) => {
      if (err) {
        reject(err)
      }
      resolve(files)
    })
  })
}

// Check the file
const fileAccess = (path: string, constants: number) => {
  return new Promise((resolve, reject) => {
    access(path, constants, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        reject(err)
      }
      resolve(1)
    })
  })
}

// read info.sii 'name' vale
const readInfoName = (path: string, data: string) => {
  // const data = readFileSync(path, 'utf8')
  const reg = / name: (.*)/
  const match = reg.exec(data)
  if (!match) return ''
  let name = match[1].trim()
  if (name.startsWith('"')) {
    name = escape(name.substring(1, name.length - 1))
    name = name.replace(/%5Cx/gm, '%')
    name = name.replace(/%5C/gm, '')
    return decodeURIComponent(name)
  } else {
    return name || ''
  }
}

const readReadme = () => {
  try {
    const readmePath = path.join(process.cwd(), '/resources/README.md')
    const data = readFileSync(readmePath, 'utf8')
    const converter = new showdown.Converter({ openLinksInNewWindow: true })
    const html = converter.makeHtml(data)
    return html
  } catch (error) {
    return ''
  }
}

const addJobOffer = (jobInfo: any, inGameTime: any) => {
  const companyJobData = []
  companyJobData.push(' target: "' + jobInfo.destination_company + '.' + jobInfo.destination_city + '"')
  const exp = Number(inGameTime) + 6120
  companyJobData.push(' expiration_time: ' + exp)
  companyJobData.push(' urgency: 0')
  companyJobData.push(' shortest_distance_km: ' + jobInfo.shortest_distance_km)
  companyJobData.push(' ferry_time: 0')
  companyJobData.push(' ferry_price: 0')
  companyJobData.push(' cargo: cargo.' + jobInfo.cargo)
  companyJobData.push(' company_truck: ' + jobInfo.company_truck)
  companyJobData.push(' trailer_variant: ' + jobInfo.trailer_variant)
  companyJobData.push(' trailer_definition: ' + jobInfo.trailer_definition)
  companyJobData.push(' units_count: ' + jobInfo.units_count)
  companyJobData.push(' fill_ratio: 1')
  companyJobData.push(' trailer_place: 0')
  return companyJobData
}

const addJobInfo = (jobInfo: any, inGameTime: any) => {
  const jobData = []
  jobData.push('')
  jobData.push('job_info : ets666.nameless.job.info {')
  jobData.push(' cargo: cargo.' + jobInfo.cargo)
  jobData.push(' source_company: company.volatile.' + jobInfo.departure_company + '.' + jobInfo.departure_city)
  jobData.push(' target_company: company.volatile.' + jobInfo.destination_company + '.' + jobInfo.destination_city)
  const exp = Number(inGameTime) + 6120
  jobData.push(' cargo_model_index: ' + exp)
  jobData.push(' is_articulated: false')
  jobData.push(' is_cargo_market_job: false')
  jobData.push(' start_time: 0')
  jobData.push(' planned_distance_km: ' + jobInfo.shortest_distance_km)
  jobData.push(' ferry_time: 0')
  jobData.push(' ferry_price: 0')
  jobData.push(' urgency: 0')
  jobData.push(' special: null')
  jobData.push(' units_count: ' + jobInfo.units_count)
  jobData.push(' fill_ratio: 1')
  jobData.push('}')
  return jobData
}

// edit game.sii
const editGameSii = async (path: string, info: any, fRead: string) => {
  try {
    const { setting, jobInfo, job } = info
    const arrFile = fRead.replace(/\r\n?/g, '\n').split('\n')
    const skills: number[] = []
    const garage: number[] = []
    const exper: number[] = []
    let hqCity = ''
    const visitedCity: string[] = []
    const visitedIndex: {
      city: number
      count: number
      company: number[]
    } = {
      city: 0,
      count: 0,
      company: []
    }
    const cityName = new Set()
    const dealerCities = new Set()
    const unlockedDealers: string[] = []
    let unlockedDealersIndex = 0

    // 做货
    let companyIndex = 0 // 起点货场
    let companyEndIndex = 0 // 终点货场
    let inGameTime = 0
    const economyEventIndex: number[] = []
    const jobInfoIndex: number[] = []
    let selectedJobInfoNameless = ''
    const gpsNameless: string[] = []
    const gpsNamelessIndex: number[] = []

    let index = 0
    arrFile.forEach((element: string, fileIndex: number) => {
      if (element.startsWith(' hq_city: ')) {
        hqCity = element.split(': ')[1]
      } else if (element.startsWith(' companies[')) {
        if (setting.city) {
          cityName.add(element.split('.')[3])
        }
        if (setting.dealer) {
          dealerCities.add(element.split('.')[3])
        }
      }
      if (setting.money && element.startsWith(' money_account')) {
        arrFile[fileIndex] = element.replace(/money_account: [^,\n]+/, 'money_account: 100000000')
      } else if (setting.level && element.startsWith(' experience_points')) {
        exper.push(index)
      } else if (setting.skills && element.startsWith(' adr:')) {
        skills.push(index)
      } else if (setting.skills && element.startsWith(' screen_access_list:')) {
        arrFile[fileIndex] = element.replace(/screen_access_list: [^,\n]+/, 'screen_access_list: 0')
      } else if (setting.skills && element.startsWith(' screen_access_list[')) {
        arrFile[fileIndex] = ''
      } else if (setting.damage && element.startsWith(' trailer_body_wear:')) {
        arrFile[fileIndex] = element.replace(/_wear: [^,\n]+/, '_wear: 0')
      } else if (setting.damage && element.startsWith(' trailer_body_wear_unfixable:')) {
        arrFile[fileIndex] = element.replace(/_wear_unfixable: [^,\n]+/, '_wear_unfixable: 0')
      } else if (setting.damage && element.startsWith(' chassis_wear:')) {
        arrFile[fileIndex] = element.replace(/_wear: [^,\n]+/, '_wear: 0')
      } else if (setting.damage && element.startsWith(' chassis_wear_unfixable:')) {
        arrFile[fileIndex] = element.replace(/_wear_unfixable: [^,\n]+/, '_wear_unfixable: 0')
      } else if (setting.damage && element.startsWith(' engine_wear:')) {
        arrFile[fileIndex] = element.replace(/_wear: [^,\n]+/, '_wear: 0')
      } else if (setting.damage && element.startsWith(' engine_wear_unfixable:')) {
        arrFile[fileIndex] = element.replace(/_wear_unfixable: [^,\n]+/, '_wear_unfixable: 0')
      } else if (setting.damage && element.startsWith(' transmission_wear:')) {
        arrFile[fileIndex] = element.replace(/_wear: [^,\n]+/, '_wear: 0')
      } else if (setting.damage && element.startsWith(' transmission_wear_unfixable:')) {
        arrFile[fileIndex] = element.replace(/_wear_unfixable: [^,\n]+/, '_wear_unfixable: 0')
      } else if (setting.damage && element.startsWith(' cabin_wear:')) {
        arrFile[fileIndex] = element.replace(/_wear: [^,\n]+/, '_wear: 0')
      } else if (setting.damage && element.startsWith(' cabin_wear_unfixable:')) {
        arrFile[fileIndex] = element.replace(/_wear_unfixable: [^,\n]+/, '_wear_unfixable: 0')
      } else if (setting.damage && element.startsWith(' wheels_wear:')) {
        arrFile[fileIndex] = element.replace(/_wear: [^,\n]+/, '_wear: 0')
      } else if (setting.damage && element.startsWith(' wheels_wear_unfixable:')) {
        arrFile[fileIndex] = element.replace(/_wear_unfixable: [^,\n]+/, '_wear_unfixable: 0')
      } else if (setting.damage && element.startsWith(' wheels_wear[')) {
        arrFile[fileIndex] = ''
      } else if (setting.damage && element.startsWith(' wheels_wear_unfixable[')) {
        arrFile[fileIndex] = ''
      } else if (setting.oil && element.startsWith(' fuel_relative')) {
        arrFile[fileIndex] = element.replace(/fuel_relative: [^,\n]+/, 'fuel_relative: 1')
      } else if (setting.city && element.startsWith(' visited_cities[')) {
        visitedCity.push(element.split(': ')[1])
      } else if (setting.city && element.startsWith(' visited_cities: ')) {
        visitedIndex.city = index
      } else if (setting.city && element.startsWith(' visited_cities_count: ')) {
        visitedIndex.count = index
      } else if (setting.city && element.startsWith(' reserved_trailer_slot: ')) {
        visitedIndex.company.push(index - 1)
      } else if (setting.garage && element.startsWith('garage : garage.')) {
        if (!element.startsWith('garage : garage.' + hqCity)) {
          garage.push(index)
        }
      } else if (setting.dealer && element.startsWith(' unlocked_dealers[')) {
        unlockedDealers.push(element.split(': ')[1])
      } else if (setting.dealer && element.startsWith(' unlocked_dealers: ')) {
        unlockedDealersIndex = index
      } else if (element.startsWith('company : company.volatile.' + jobInfo.departure_company + '.' + jobInfo.departure_city)) {
        companyIndex = index
      } else if (element.startsWith('company : company.volatile.' + jobInfo.destination_company + '.' + jobInfo.destination_city)) {
        companyEndIndex = index
      } else if (element.startsWith(' game_time: ')) {
        inGameTime = Number(element.split(' ')[2])
      } else if (element.startsWith(' unit_link: company.volatile.' + jobInfo.departure_company + '.' + jobInfo.departure_city)) {
        economyEventIndex.push(index)
      } else if (job.moveToCargo && element.startsWith(' truck_placement: ')) {
        arrFile[fileIndex] = ' truck_placement: ' + jobInfo.departure_coordinates
      } else if (job.moveToCargo && element.startsWith(' trailer_placement: ')) {
        arrFile[fileIndex] = ' trailer_placement: (0, 0, 0) (' + jobInfo.departure_coordinates.split('(')[2]
      } else if (job.moveToCargo && element.startsWith(' slave_trailer_placements[')) {
        arrFile[fileIndex] = ' slave_trailer_placements[' + element.split('[')[1].split(']')[0] + ']: (0, 0, 0) (' + jobInfo.departure_coordinates.split('(')[2]
      } else if (job.moveToCargo && element.startsWith(' stored_gps_behind_waypoints[')) {
        gpsNameless.push(element.split(': ')[1])
      } else if (job.moveToCargo && element.startsWith('gps_waypoint_storage : ')) {
        gpsNamelessIndex.push(index)
      } else if (job.syncJob && job.moveToCargo && element.startsWith(' selected_job: ')) {
        selectedJobInfoNameless = element.split(': ')[1]
        arrFile[fileIndex] = ' selected_job: ets666.nameless.job.info'
      } else if (job.syncJob && job.moveToCargo && element.startsWith('job_info :')) {
        jobInfoIndex.push(index)
      }
      index++
    })

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
      visitedCity.forEach(element => {
        cityName.delete(element)
      })
      const cityNum = Number(arrFile[visitedIndex.city].split(': ')[1])
      const num = cityNum + cityName.size
      const arrCityName = Array.from(cityName)

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
      } else if (num > cityNum) {
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

    if (dealerCities.size > 0) {
      unlockedDealers.forEach(element => {
        dealerCities.delete(element)
      })
      const dealerNum = Number(arrFile[unlockedDealersIndex].split(': ')[1])
      const num = dealerNum + dealerCities.size
      const arrDealerCity = Array.from(dealerCities)

      if (dealerNum === 0) {
        let str = '\r\n'
        for (let j = 0; j < arrDealerCity.length; j++) {
          if (j === arrDealerCity.length - 1) {
            str += ` unlocked_dealers[${j}]: ${arrDealerCity[j]}`
          } else {
            str += ` unlocked_dealers[${j}]: ${arrDealerCity[j]}\r\n`
          }
        }
        arrFile[unlockedDealersIndex] = ' unlocked_dealers: ' + num + str
      } else if (num > dealerNum) {
        let str = '\r\n'
        for (let j = 0; j < arrDealerCity.length; j++) {
          const num = j + dealerNum
          str += ` unlocked_dealers[${num}]: ${arrDealerCity[j]}`
          if (j < arrDealerCity.length - 1) {
            str += '\r\n'
          }
        }
        arrFile[unlockedDealersIndex] = ' unlocked_dealers: ' + num
        arrFile[unlockedDealersIndex + dealerNum] += str
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
        for (let t = 1; t < 6; t++) {
          const statusIndex = garage[i] + 2 + vehiclesNum + driversNum + t
          if (arrFile[statusIndex].startsWith(' status: ')) {
            arrFile[statusIndex] = ' status: 3'
            break
          }
        }
      }
    }

    // change navigation position to (0, 0, 0)
    if (job.moveToCargo && gpsNameless.length > 0) {
      gpsNameless.forEach(value => {
        gpsNamelessIndex.forEach(index => {
          if (arrFile[index].indexOf(value) !== -1) {
            arrFile[index + 1] = ' nav_node_position: (0, 0, 0)'
          }
        })
      })
    }

    // 做货
    if (job.syncJob) {
      if (companyIndex === 0 || companyEndIndex === 0) {
        return 'companyNotFound'
      }

      let jobIndex = companyIndex
      const companyJobData = addJobOffer(jobInfo, inGameTime)
      while (!arrFile[jobIndex].startsWith(' job_offer: ')) {
        jobIndex++
      }
      const jobOfferNum = Number(arrFile[jobIndex].split(': ')[1])
      if (jobOfferNum === 0) {
        return 'companyNotSupported'
      }
      while (!arrFile[jobIndex].startsWith(' job_offer[')) {
        jobIndex++
      }
      const nameless = arrFile[jobIndex].split(' ')[2]
      while (!arrFile[jobIndex].startsWith('job_offer_data : ' + nameless)) {
        jobIndex++
      }
      for (let i = 0; i < companyJobData.length; i++) {
        arrFile[jobIndex + 1 + i] = companyJobData[i]
      }

      economyEventIndex.forEach(index => {
        if (arrFile[index + 1].startsWith(' param: 0')) {
          arrFile[index - 1] = ' time: ' + (Number(inGameTime) + 6120)
        }
      })

      if (job.moveToCargo) {
        const selectedJobInfo = addJobInfo(jobInfo, inGameTime)
        if (selectedJobInfoNameless.startsWith('null')) {
          arrFile.splice(arrFile.length - 2, 0, ...selectedJobInfo)
        } else {
          jobInfoIndex.forEach(index => {
            if (arrFile[index].startsWith('job_info : ' + selectedJobInfoNameless)) {
              for (let i = 1; i < selectedJobInfo.length; i++) {
                arrFile[index + i - 1] = selectedJobInfo[i]
              }
            }
          })
        }
      }
    }

    const buf = Buffer.from(arrFile.join('\r\n'))
    try {
      const res = await fileWrite(path, buf)
      if (res === 1) {
        return 'success'
      }
    } catch (error) {
      return 'writeFileFailed'
    }
  } catch (error) {
    return 'failed'
  }
}

const Utils = {
  ipcOn: () => {
    ipcMain.on('open-url', (event: Electron.IpcMainEvent, url: string) => {
      shell.openExternal(url)
    })

    ipcMain.on('about', (event: Electron.IpcMainEvent) => {
      dialog.showMessageBox({
        title: 'ETS666 Tool',
        message: 'ETS666 Tool',
        detail: `Version: ${info.version}\nAuthor: xiaosi & sunwinbus\nUI Design: Mingran7\nhttps://github.com/ets666/ets666-tool`
      })
    })

    ipcMain.on('saveStore', (event: Electron.IpcMainEvent, { storeName, val }: { storeName: string, val: any }) => {
      store.set(storeName, val)
    })

    ipcMain.handle('getStore', async (event: Electron.IpcMainInvokeEvent, storeName: string) => {
      return store.get(storeName)
    })
    ipcMain.on('userData', (event: Electron.IpcMainEvent) => {
      event.reply('userData', app.getPath('userData'))
    })

    const insecureAgent = new https.Agent({
      rejectUnauthorized: false
    })
    ipcMain.handle('ets666', async (event: Electron.IpcMainInvokeEvent, apiName: string) => {
      try {
        const { data } = await axios.get(`https://ets666.com/api/${apiName}`, {
          httpsAgent: insecureAgent
        })
        return data
      } catch (err: any) {
        throw new Error(err.message)
      }
    })
  },
  fileOn: () => {
    ipcMain.handle('readReadme', async (event: Electron.IpcMainInvokeEvent) => {
      return readReadme()
    })

    /**
     * @description:查找文件夹名字
     * @param {String} dir 文件路径
     * @param {String} filedirname 需要查找的文件夹名
     * @param {function} callback 成功返回函数
     * @param {function} errorcallback 失败返回函数
     */
    ipcMain.handle('mapDirName', async (event: Electron.IpcMainInvokeEvent, { dir, filedirname }: { dir: string, filedirname: string }) => {
      try {
        const dirurl = path.join(dir, filedirname)
        const code = await fileAccess(dirurl, constants.F_OK)
        if (code === 1) {
          try {
            const files = await fileDir(dirurl) as string[]
            // 只读取文件夹
            const filedir: string[] = []
            files.forEach((filename: string) => {
              const pathname = path.join(dirurl, filename)
              const statInfo = statSync(pathname)
              if (statInfo.isDirectory()) {
                filedir.push(filename)
              }
            })
            return filedir
          } catch (error) {
            return 'fileNotExist'
          }
        }
      } catch (error) {
        return 'invalidPath'
      }
    })

    /**
   * @description: 解码info.sii
   * @param {String} dir 文件路径
   */
    ipcMain.handle('SiiDecryptInfo', async (event: Electron.IpcMainInvokeEvent, dir: string) => {
      try {
        const infoSiiPath = path.join(dir, '/info.sii')
        const result = SIIDecryptor.decrypt(infoSiiPath, true)
        if (result.success) {
            const coverString = result.string_content
            if (coverString) {
              return readInfoName(infoSiiPath, coverString)
            } else {
              return ''
            }
        } else {
          return result.error
        }
      } catch (error) {
        return 'saveNotFound'
      }
    })

    /**
   * @description: 解码game.sii
   * @param {String} dir 文件路径
   */
    ipcMain.handle('SiiDecrypt', async (event: Electron.IpcMainInvokeEvent, { dir, info }: { dir: string, info: string }) => {
      try {
        const gameSiiPath = path.join(dir, '/game.sii')
        const backSiiPath = path.join(dir, '/game_bak.sii')
        const result = SIIDecryptor.decrypt(gameSiiPath, true)
        if (result.success) {
            // backup
            copyFileSync(gameSiiPath, backSiiPath)
            const infos = JSON.parse(info)
            const coverString = result.string_content
            return coverString && await editGameSii(gameSiiPath, infos, coverString)
        } else {
          return result.error
        }
      } catch (error) {
        return 'saveNotFound'
      }
    })

    ipcMain.handle('openDir', async (event: Electron.IpcMainInvokeEvent) => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      // event.reply('selectedDir', result.filePaths[0])
      return result.filePaths[0]
    })
  },
  update: () => {
    ipcMain.on('updateMsg', async () => {
      const downloadUrl = 'https://github.com/ets666/ets666-tool/releases/latest'
      dialog.showMessageBox({
        type: 'info',
        title: 'New Version Available',
        buttons: ['Yes', 'No'],
        message: 'A new version has been released. Do you want to download it?',
        checkboxLabel: 'Don\'t remind me again',
        checkboxChecked: false
      }).then((res: { response: number, checkboxChecked: boolean }) => {
        const { response, checkboxChecked } = res
        if (response === 0) { // if selected yes
          shell.openExternal(downloadUrl)
        }
        store.set('showUpdate', !checkboxChecked)
      })
    })
  }
}
export default Utils
