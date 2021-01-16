<template>
  <div class="box">
    <div class="content">
      {{$t('selectTips')}}
    </div>
    <div style="width: 100%;">
      <el-input style="width: 60%;" v-model="gamePath" disabled :placeholder="$t('selectPath')"></el-input>
      <el-button @click="openFileHandler">{{$t('selectBtn')}}</el-button>
      <el-button :disabled="disableSure" type="primary" style="margin-left: 0;" @click="saveToLocal">{{$t('ok')}}</el-button>
      <input v-show="false" ref="input_file" type="file" readonly webkitdirectory directory style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;" @change="fileChange">
    </div>
  </div>
</template>

<script>
const fileEdit = require('../../../../utils/fileEdit')

export default {
  data () {
    return {
      gamePath: '',
      fileInfo: '',
      disableSure: true
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
      const _this = this
      // 判断路径是否存在
      fileEdit.mapDirName(this.gamePath, '/profiles', (file) => {
        this.$db.update('path', n => _this.gamePath).write()
        this.$db.update('pathType', n => 'custom').write()
        _this.disableSure = false
      }, () => {
        _this.$nextTick(() => {
          _this.disableSure = true
          _this.$message.error(_this.$i18n.t('error.invalidPath'))
        })
      })
    },
    // 写入本地
    saveToLocal () {
      this.$emit('pathSave')
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

