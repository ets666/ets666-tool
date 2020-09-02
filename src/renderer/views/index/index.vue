<template>
  <div class="w h">
    <select-euro-path v-if="!savePath" @pathSave="pathSave" />
  </div>
</template>

<script>
import SelectEuroPath from './components/select-euro-path'
const fs = require('fs')
const path = require('path')

export default {
  components: {
    SelectEuroPath
  },
  data () {
    return {
      fileInfo: '',
      savePath: ''
    }
  },
  created () {
    try {
      let data = fs.readFileSync(path.join(process.cwd(), '/resources/db.json'))
      this.fileInfo = data.toString()
      this.savePath = JSON.parse(this.fileInfo).path
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

