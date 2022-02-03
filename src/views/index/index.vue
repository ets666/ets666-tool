<template>
  <div class="w h">
    <select-euro-path v-if="!savePath" @pathSave="pathSave" />
    <setting v-else :savePath="savePath" />
  </div>
</template>

<script>
import SelectEuroPath from './components/select-euro-path'
import Setting from './components/setting'
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
  created () {
    try {
      ipc.send('getStore', { storeName: 'path', callBackName: 'gamePath' })
      ipc.on('gamePath', (e, f) => {
        this.savePath = f.path || ''
      })
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
