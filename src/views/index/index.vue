<template>
  <div class="w h">
    <select-euro-path v-if="!savePath" :type="type" @pathSave="pathSave" />
    <setting ref="setting" v-else :savePath="savePath" @pathTypeChange="pathTypeChange" @pathSave="pathSave" />
  </div>
</template>

<script>
import SelectEuroPath from './components/select-euro-path'
import Setting from './components/setting'
import { errCatch } from '@/utils/index'
const ipc = window.ipc

export default {
  name: 'IndexItem',
  components: {
    SelectEuroPath,
    Setting
  },
  data () {
    return {
      fileInfo: '',
      savePath: '',
      type: 'ETS2',
      paths: {
        path: null,
        aPath: null
      }
    }
  },
  async created () {
    try {
      this.savePath = ''
      const path = await ipc.invoke('getStore', 'path')
      const aPath = await ipc.invoke('getStore', 'aPath')
      this.paths.path = path
      this.paths.aPath = aPath
      // 判定是否显示首页
      // 依据是否有欧卡或者美卡其一 且地址不为空的情况
      if (path || aPath) {
        // 优先选择欧卡地址进入首页
        if (path) {
          const dir = await ipc.invoke('mapDirName', { dir: path, filedirname: '/profiles' })
          if (!errCatch(dir)) {
            this.savePath = path
            this.type = 'ETS2'
            this.$nextTick(() => {
              this.$refs.setting.pathType = 'ETS2'
            })
          }
        } else if (aPath) {
          const dir = await ipc.invoke('mapDirName', { dir: aPath, filedirname: '/profiles' })
          if (!errCatch(dir)) {
            this.savePath = aPath
            this.type = 'ATS'
            this.$nextTick(() => {
              this.$refs.setting.pathType = 'ATS'
            })
          }
        }
      }
    } catch (error) {
      this.savePath = ''
    }
  },
  methods: {
    pathSave ({ path, type }) {
      this.savePath = path
      if (this.type === 'ETS2') {
        this.paths.path = path
      } else {
        this.paths.aPath = path
      }
      this.$nextTick(() => {
        this.$refs.setting.pathType = type
        this.$refs.setting.init()
      })
    },
    async pathTypeChange (type) {
      this.type = type
      if (type === 'ETS2') {
        const dir = await ipc.invoke('mapDirName', { dir: this.paths.path, filedirname: '/profiles' })
        if (!errCatch(dir)) {
          this.savePath = this.paths.path
          if (this.savePath) {
            this.$nextTick(() => {
              this.$refs.setting.init()
            })
          }
        } else {
          this.savePath = ''
        }
      } else if (type === 'ATS') {
        const dir = await ipc.invoke('mapDirName', { dir: this.paths.aPath, filedirname: '/profiles' })
        if (!errCatch(dir)) {
          this.savePath = this.paths.aPath
          if (this.savePath) {
            this.$nextTick(() => {
              this.$refs.setting.init()
            })
          }
        } else {
          this.savePath = ''
        }
      }
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
