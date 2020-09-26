'use strict'

import { app, BrowserWindow, dialog, shell, ipcMain } from 'electron'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 650, // 设置窗口的高
    useContentSize: true,
    width: 1280, // 设置窗口的宽
    minHeight: 650,
    minWidth: 1280,
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

ipcMain.on('open-url', (event, url) => {
  shell.openExternal(url)
})

ipcMain.on('about', (event) => {
  dialog.showMessageBox({
    title: 'ETS666 联运工具',
    message: 'ETS666 联运工具',
    detail: `Version: 0.0.1\nAuthor: xiaosi\nContributor: sunwinbus\nUI Design: Mingran7\nFeedback: feedback@ets666.com`
  })
})

app.on('ready', () => {
  createWindow()
  // createMenu()
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
