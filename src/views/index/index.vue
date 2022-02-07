<template>
  <div class="w h">
    <select-euro-path v-if="!savePath" @pathSave="pathSave" />
    <setting v-else :savePath="savePath" />
  </div>
</template>

<script>
import SelectEuroPath from './components/select-euro-path'
import Setting from './components/setting'
import { errCatch } from '@/utils/index'
const ipc = window.ipc

export default {
  components: {
    SelectEuroPath,
    Setting
  },
  data () {
    return {
      fileInfo: '',
      savePath: ''
    }
  },
  async created () {
    try {
      this.savePath = ''
      const path = await ipc.invoke('getStore', 'path')
      if (path) {
        const dir = await ipc.invoke('mapDirName', { dir: path, filedirname: '/profiles' })
        if (!errCatch(dir)) {
          this.savePath = path
        }
      }
    } catch (error) {
      this.savePath = ''
    }
  },
  methods: {
    pathSave (path) {
      this.savePath = path
    }
  }
}
</script>

<style scoped lang="scss">
.w {
  width: 100%;
}
.h {
  height: 100%;
}
</style>
