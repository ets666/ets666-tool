<template>
  <div class="box">
    <div class="content">
      请选择欧卡存档所在目录 ex: C:\Users\xx\Documents\Euro Truck Simulator 2
    </div>
    <div>
      <el-input style="width: 70%;" v-model="gamePath" disabled placeholder="请选择文件路径"></el-input>
      <el-button @click="openFileHandler">选择</el-button>
      <el-button style="margin-left: 0;" @click="saveToLocal">下一步</el-button>
      <input ref="input_file" type="file" readonly webkitdirectory directory style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;" @change="fileChange">
    </div>
  </div>
</template>

<script>
const fs = require('fs')

export default {
  data () {
    return {
      gamePath: '',
      fileInfo: ''
    }
  },
  mounted () {
    try {
      this.gamePath = this.$db.read().get('path').value()
    } catch (error) {
      this.gamePath = ''
    }
  },
  methods: {
    openFileHandler () {
      this.$refs.input_file.click()
    },
    // 读取地址
    fileChange () {
      const file = this.$refs.input_file.files[0]
      this.gamePath = file.path
    },
    // 写入本地
    saveToLocal () {
      const _this = this
      // 判断路径是否存在
      fs.access(this.gamePath, fs.F_OK, (err) => {
        if (err) {
          _this.$message.error('路径不存在！')
          return
        }
        this.$db.update('path', n => _this.gamePath).write()
        _this.$emit('pathSave', _this.gamePath)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .content {
    margin-bottom: 10px;
    font-size: 14px;
  }
}
</style>

