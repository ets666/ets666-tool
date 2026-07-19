<template>
  <router-view />
</template>

<script setup lang="ts">
import { release } from '@/api/index'
import { version } from '../package.json'
import { compareVersions } from 'compare-versions'
import { onMounted } from 'vue'

const ipc = window.ipc

const checkUpdate = async () => {
  let showTip = null
  showTip = await ipc.invoke('getStore', 'showUpdate')
  if (showTip === undefined) {
    ipc.send('saveStore', { storeName: 'showUpdate', val: true })
    showTip = true
  }
  if (showTip) {
    const res = await release()
    const latest = res.name
    const result = compareVersions(version, latest)

    if (result === -1) {
      ipc.send('updateMsg')
    }
  }
}

onMounted(() => {
  checkUpdate()
})
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>