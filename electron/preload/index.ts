import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld(
  '_platform',
  process.platform
)


/**
* 通信方法挂载到window对象上
* 在渲染进程中使用:
* <script setup lang="ts">
* window.ipc.on('WindowID', (e, f) => console.log(e, f))
* window.ipc.send('navBar', val)
* </script>
*/
contextBridge.exposeInMainWorld('ipc', {
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, listener)
  },
  once: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.once(channel, listener)
  }
})
