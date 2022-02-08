<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { release } from '@/api/index'
import { version } from '../package.json'
import compareVersions from 'compare-versions'
const ipc = window.ipc

export default {
  async mounted () {
    this.checkUpdate()
  },
  methods: {
    async checkUpdate () {
      let showTip = null
      showTip = await ipc.invoke('getStore', 'showUpdate')
      if (showTip === undefined) {
        ipc.send('saveStore', { storeName: 'showUpdate', val: true })
        showTip = true
      }
      if (showTip) {
        const res = await release()
        const latest = res.name // 获取版本号
        const result = compareVersions(version, latest)

        if (result === -1) {
          ipc.send('updateMsg')
        }
      }
    }
  }
}
</script>

<style>
  /* CSS */
  html,body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  #app {
    width: 100%;
    height: 100%;
  }
</style>
