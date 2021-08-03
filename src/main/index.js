'use strict'

import { app, BrowserWindow, dialog, shell, ipcMain, nativeImage } from 'electron'
import packageInfo from '../../package'
import uploader from '../utils/uploader.js'
const path = require('path')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const iconImage = process.env.NODE_ENV === 'development'
  ? nativeImage.createFromPath(path.join(__dirname, '../../resources/icons/icon.png'))
  : nativeImage.createFromPath(path.join(process.resourcesPath, '/icons/icon.png'))
const version = packageInfo.version

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 650, // 设置窗口的高
    useContentSize: true,
    width: 1220, // 设置窗口的宽
    minHeight: 650,
    minWidth: 1220,
    webPreferences: {
      webSecurity: false, // 是否禁用浏览器的跨域安全特性
      nodeIntegration: true // 是否完整支持node
    },
    icon: iconImage
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

ipcMain.on('open-url', (event, url) => {
  shell.openExternal(url)
})

ipcMain.on('about', (event) => {
  dialog.showMessageBox({
    title: 'ETS666 SaveEdit & JobSync Tool',
    message: 'ETS666 SaveEdit & JobSync Tool',
    detail: `Version: ${version}\nAuthor: xiaosi & sunwinbus\nUI Design: Mingran7\nhttps://github.com/ets666/ets666-tool`,
    icon: iconImage
  })
})

app.on('ready', () => {
  createWindow()
  uploader()
})

app.on('window-all-closed', () => {
  app.quit()
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
