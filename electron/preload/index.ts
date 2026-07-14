import { contextBridge, ipcRenderer } from 'electron'

// 暴露受保护的 API 到渲染进程
contextBridge.exposeInMainWorld('electron', {
  ping: () => ipcRenderer.send('ping'),
  // 在这里添加更多 API
})