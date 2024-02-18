<template>
  <div class="w h">
    <setting ref="setting" :savePath="savePath" @pathTypeChange="pathTypeChange" @pathSave="pathSave" />
  </div>
</template>

<script>
import Setting from './components/setting'
const ipc = window.ipc

export default {
  name: 'IndexItem',
  components: {
    // SelectEuroPath,
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
      // 默认路径设置
      if (path) {
        this.savePath = path
        this.type = 'ETS2'
        this.$nextTick(() => {
          this.$refs.setting.pathType = 'ETS2'
        })
      } else if (aPath) {
        this.savePath = aPath
        this.type = 'ATS'
        this.$nextTick(() => {
          this.$refs.setting.pathType = 'ATS'
        })
      } else {
        this.savePath = ''
        this.type = 'ETS2'
        this.$nextTick(() => {
          this.$refs.setting.pathType = 'ETS2'
        })
      }
      this.$nextTick(() => {
        this.$refs.setting.init()
      })
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
        this.savePath = this.paths.path
        if (this.savePath) {
          this.$nextTick(() => {
            this.$refs.setting.init()
          })
        }
      } else if (type === 'ATS') {
        this.savePath = this.paths.aPath
        if (this.savePath) {
          this.$nextTick(() => {
            this.$refs.setting.init()
          })
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
