// import { autoUpdater } from 'electron-differential-updater'
import { app, BrowserWindow, Menu, dialog } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'
import { platform } from 'os'
// import { ipcOn, fileOn, update } from './server/index'

// 执行初始化
// ipcOn()
// fileOn()
// update()

// 平台判定
const isMac = platform() === 'darwin'

// 开发/生产环境 URL
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5173'
  : `file://${join(__dirname, '../dist/index.html')}`

// 窗口引用
let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // 清除缓存配置
  const clearObj: Electron.ClearStorageDataOptions = {
    storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'] as any
  }

  // 菜单模板
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { type: 'separator' },
        { label: '服务', role: 'services' },
        { type: 'separator' },
        { label: '隐藏', role: 'hide' },
        { label: '隐藏其他', role: 'hideothers' },
        { type: 'separator' },
        { label: '退出', role: 'quit' }
      ]
    }] as Electron.MenuItemConstructorOptions[] : []),
    {
      label: '视图',
      submenu: [
        { label: '重新加载', role: 'reload' },
        { label: '强制重新加载', role: 'forceReload' },
        { label: '开发者工具', role: 'toggleDevTools' },
        {
          label: '清除缓存数据',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: (_item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.webContents.session.clearStorageData(clearObj)
            }
          }
        }
      ]
    },
    {
      label: '其他',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox({
              title: 'ets666-tool',
              message: 'ets666-tool',
              detail: `Version: ${app.getVersion()}`,
              type: 'info'
            })
          }
        }
      ]
    }
  ]

  // 根据平台确定图标路径
  const getIconPath = (): string | undefined => {
    const iconName = process.platform === 'win32' ? 'icon.ico' :
                     process.platform === 'darwin' ? 'icon.icns' : 'icon.png'

    // 开发环境：从项目根目录读取
    // 生产环境：从 app 目录读取
    const iconPath = app.isPackaged
      ? join(process.resourcesPath, 'icons', iconName)
      : join(__dirname, '../resources/icons', iconName)

    // 检查文件是否存在
    if (existsSync(iconPath)) {
      console.log('Icon path:', iconPath)
      return iconPath
    }

    console.warn('Icon file not found:', iconPath)
    return undefined
  }

  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    frame: true,
    width: 1240,
    height: 670,
    minWidth: 1240,
    minHeight: 670,
    center: true,
    resizable: false,
    show: false,
    icon: getIconPath(),
    webPreferences: {
      autoplayPolicy: 'no-user-gesture-required',
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, './preload/index.js')
    }
  })

  mainWindow.center()

  // 加载页面
  mainWindow.loadURL(winURL)

  // 窗口关闭事件
  mainWindow.on('closed', function () {
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow === mainWindow) {
      mainWindow = null
    }
    mainWindow = null
  })

  // 窗口准备好显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // 设置菜单
  const menu = Menu.buildFromTemplate(template)
  if (process.env.NODE_ENV === 'development') {
    Menu.setApplicationMenu(menu)
  } else {
    Menu.setApplicationMenu(null)
  }

  // macOS 特定设置
  if (platform() === 'darwin') {
    mainWindow.excludedFromShownWindowsMenu = true
  }
}

// 当 Electron 完成初始化时触发
app.on('ready', createWindow)

// 当所有窗口都关闭时退出应用（除了 macOS）
app.on('window-all-closed', function () {
  // 在 macOS 上，应用程序和菜单栏通常保持活动状态，直到用户明确使用 Cmd + Q 退出
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  console.log('main process activate')
  // 在 macOS 上，通常在点击 dock 图标时重新创建窗口
  if (mainWindow === null) {
    createWindow()
  }

  if (mainWindow) {
    mainWindow.show()
  }
})
