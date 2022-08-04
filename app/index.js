// const { autoUpdater } = require('electron-differential-updater')
const { app, Menu, BrowserWindow, dialog } = require('electron')
const path = require('path')
const info = require('../package.json')
const process = require('process')
const { ipcOn, fileOn, update } = require('./utils')

ipcOn()
fileOn()
update()
// 平台判定
const platform = require('os').platform()
const isMac = platform === 'darwin'

const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9521' : `file://${path.resolve(__dirname, '../../app.asar/build/')}/index.html`

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
// autoUpdater.autoDownload = false

function createWindow () {
  // const clearObj = {
  //   storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage']
  // }
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        // { role: 'about' },
        { type: 'separator' },
        { label: '服务', role: 'services' },
        { type: 'separator' },
        { label: '隐藏', role: 'hide' },
        { label: '隐藏其他', role: 'hideothers' },
        { type: 'separator' },
        { label: '退出', role: 'quit' }
      ]
    }] : []),
    // {
    //   label: '视图',
    //   submenu: [
    //     { label: '重新加载', role: 'reload' },
    //     { label: '强制重新加载', role: 'forcereload' },
    //     { label: '开发者工具', role: 'toggledevtools' },
    //     {
    //       label: '清除缓存数据',
    //       accelerator: 'CmdOrCtrl+Shift+Delete',
    //       click: (item, focusedWindow) => {
    //         if (focusedWindow) {
    //           focusedWindow.webContents.session.clearStorageData(clearObj)
    //         }
    //       }
    //     }
    //   ]
    // },
    {
      label: '其他',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox({
              title: 'ets666-tool',
              message: 'ets666-tool',
              detail: `Version: ${info.version}`,
              type: 'info'
            })
          }
        }
      ]
    }
  ]

  mainWindow = new BrowserWindow({
    frame: true,
    width: 1220,
    height: 700,
    minWidth: 1220,
    minHeight: 700,
    center: true,
    resizable: true,
    show: false,
    webPreferences: {
      autoplayPolicy: 'no-user-gesture-required',
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, './preload')
    }
  })

  mainWindow.center()
  // and load the index.html of the app.
  mainWindow.loadURL(winURL)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow === mainWindow) {
      mainWindow = null
    }
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  const menu = Menu.buildFromTemplate(template)
  if (process.env.NODE_ENV === 'development') {
    Menu.setApplicationMenu(menu)
  } else {
    Menu.setApplicationMenu(null)
  }

  if (platform === 'darwin') {
    mainWindow.excludedFromShownWindowsMenu = true
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  console.log('main process activate')
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }

  if (mainWindow) {
    mainWindow.show()
  }
})
