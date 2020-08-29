'use strict'

import { app, BrowserWindow, Tray, Menu, dialog } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let tray
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 620, // 设置窗口的高
    useContentSize: true,
    width: 1200, // 设置窗口的宽
    webPreferences: {
      webSecurity: false, // 是否禁用浏览器的跨域安全特性
      nodeIntegration: true // 是否完整支持node
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
// 创建图标
function createTray () {
  const truckPic = process.platform === 'darwin' ? `${__static}/truck.png` : `${__static}/truck-nodarwin.png`
  tray = new Tray(truckPic) // 指定图片的路径
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '关于',
      click () {
        dialog.showMessageBox({
          title: 'ets666',
          message: 'ets666',
          detail: `Version: 0.0.1\nAuthor: xiaosi\nGithub: https://github.com/fe-test-group/ets666`
        })
      }
    }
    // { label: 'Item3', type: 'radio', checked: true }
  ])
  tray.setToolTip('ets666')
  tray.setContextMenu(contextMenu)
}

function createMenu () {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'ets666',
        submenu: [
          {
            role: 'quit'
          }]
      }]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    // windows及linux系统
    Menu.setApplicationMenu(null)
  }
}

app.on('ready', () => {
  createWindow()
  createTray()
  createMenu()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // 当操作系统不是darwin（macOS）的话
    app.quit() // 退出应用
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
