const { contextBridge, ipcRenderer } = require('electron')

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
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener)
  }
})
