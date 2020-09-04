<template>
  <div class="w h">
    <select-euro-path v-if="!savePath" @pathSave="pathSave" />
    <setting v-else @changePath="changePath" />
  </div>
</template>

<script>
import SelectEuroPath from './components/select-euro-path'
import Setting from './components/setting'

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
      this.savePath = this.$db.read().get('path').value()
    } catch (error) {
      this.savePath = ''
    }
  },
  methods: {
    pathSave (path) {
      this.savePath = path
    },
    changePath () {
      this.savePath = ''
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

