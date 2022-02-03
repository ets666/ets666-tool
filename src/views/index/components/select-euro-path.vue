<template>
  <div class="box">
    <div class="content">
      {{$t('selectTips')}}
    </div>
    <div class="input-box w">
      <el-input class="mr10 w60" v-model="gamePath" disabled :placeholder="$t('selectPath')"></el-input>
      <el-button class="mr10" @click="openFileHandler">{{$t('selectBtn')}}</el-button>
      <el-button style="margin-left: 0;" :disabled="disableSure" type="primary" @click="saveToLocal">{{$t('ok')}}</el-button>
    </div>
  </div>
</template>

<script>
const ipc = window.ipc

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
      ipc.send('getStore', { storeName: 'path', callBackName: 'gamePath' })
      ipc.on('gamePath', (e, f) => {
        this.gamePath = f.path || ''
      })
    } catch (error) {
      this.gamePath = ''
    }
  },
  methods: {
    openFileHandler () {
      try {
        ipc.send('openDir')
        ipc.on('selectedDir', (event, files) => {
          this.gamePath = files
          // 判断路径是否存在
          ipc.send('mapDirName', { dir: this.gamePath, filedirname: '/profiles' })
          ipc.on('/profiles', (e, f) => {
            this.disableSure = false
          })
          // 路径无效
          ipc.on('invalidPath', (e, f) => {
            this.disableSure = true
            this.$message.error(this.$t('error.invalidPath'))
          })
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 写入本地
    saveToLocal () {
      ipc.send('saveStore', { storeName: 'path', val: this.gamePath })
      ipc.send('saveStore', { storeName: 'pathType', val: 'custom' })
      this.$emit('pathSave', this.gamePath)
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 0 0 0 15%;

  .content {
    margin-bottom: 10px;
    font-size: 14px;
  }
  .input-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .w {
    width: 100%;
  }

  .w60 {
    width: 60%;
  }

  .mr10 {
    margin-right: 10px;
  }
}
</style>
