const { app, dialog, ipcMain, shell } = require('electron')
const Store = require('electron-store')
const store = new Store()
const info = require('../package.json')
const { readFile, readdir, access, constants, stat } = require('fs')
const path = require('path')
// const EURO_PATH = path.join(app.getPath('documents'), '/Euro Truck Simulator 2')

// read file data
const fileData = (path) => {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

// read file name
const fileDir = (dir) => {
  return new Promise((resolve, reject) => {
    readdir(dir, (err, files) => {
      if (err) {
        reject(err)
      }
      resolve(files)
    })
  })
}

// read file infomation
const fileStat = (dir) => {
  return new Promise((resolve, reject) => {
    stat(dir, (err, stats) => {
      if (err) {
        reject(err)
      }
      resolve(stats)
    })
  })
}

// Check the file
const fileAccess = (path, constants) => {
  return new Promise((resolve, reject) => {
    access(path, constants, (err) => {
      if (err) {
        reject(err)
      }
      resolve(1)
    })
  })
}

const Utils = {
  ipcOn: () => {
    ipcMain.on('open-url', (event, url) => {
      shell.openExternal(url)
    })

    ipcMain.on('about', (event) => {
      dialog.showMessageBox({
        title: 'ETS666 SaveEdit & JobSync Tool',
        message: 'ETS666 SaveEdit & JobSync Tool',
        detail: `Version: ${info.version}\nAuthor: xiaosi & sunwinbus\nUI Design: Mingran7\nhttps://github.com/ets666/ets666-tool`
      })
    })

    ipcMain.on('saveStore', (event, { storeName, val }) => {
      store.set(storeName, val)
    })

    ipcMain.on('getStore', (event, { storeName, callBackName }) => {
      try {
        event.reply(callBackName, { [storeName]: store.get(storeName) })
      } catch (error) {
        console.log(error)
      }
    })
    ipcMain.on('userData', (event) => {
      event.reply('userData', app.getPath('userData'))
    })
  },
  fileOn: () => {
    /**
     * @description:查找文件夹名字
     * @param {String} dir 文件路径
     * @param {String} filedirname 需要查找的文件夹名
     * @param {function} callback 成功返回函数
     * @param {function} errorcallback 失败返回函数
     */
    ipcMain.on('mapDirName', async (event, { dir, filedirname }) => {
      try {
        const dirurl = path.join(dir, filedirname)
        console.log(dirurl)
        const code = await fileAccess(dirurl, constants.F_OK)
        if (code === 1) {
          event.reply(filedirname)
        }
      } catch (error) {
        event.reply('invalidPath', `${filedirname}不存在`)
      }
    })

    ipcMain.on('openDir', async (event) => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      event.reply('selectedDir', result.filePaths[0])
    })
  }
}
module.exports = Utils
