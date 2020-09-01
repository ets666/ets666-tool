<template>
  <div class="box" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="content">
      请选择存档所在目录
    </div>
    <div>
      <el-input style="width: 70%;" v-model="gamePath" disabled placeholder="请选择文件路径"></el-input>
      <el-button @click="openFileHandler">选择</el-button>
      <el-button style="margin-left: 0;" @click="isExists">加载</el-button>
      <input ref="input_file" type="file" readonly webkitdirectory directory style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;" @change="fileChange">
    </div>
  </div>
</template>

<script>
import { exec } from 'child_process'
const fs = require('fs')
const path = require('path')

export default {
  name: 'find-file',
  data () {
    return {
      gamePath: '',
      fullscreenLoading: false
    }
  },
  methods: {
    openFileHandler () {
      this.$refs.input_file.click()
    },
    // 获取path
    fileChange () {
      const file = this.$refs.input_file.files[0]
      this.gamePath = file.path
    },
    // 判断文件是否存在
    isExists () {
      this.$electron.ipcRenderer.send('request:game:path', [this.gamePath])
      // const _this = this
      // const oldName = path.join(_this.gamePath, '/game.sii')
      // this.fullscreenLoading = true
      // fs.access(oldName, fs.F_OK, (err) => {
      //   if (err) {
      //     _this.fullscreenLoading = false
      //     _this.$message.error('路径错误!')
      //     return
      //   }
      //   _this.loadFile()
      // })
    },
    loadFile () {
      const _this = this
      const oldUrl = path.join(process.cwd(), '/resources/SII_Decrypt.exe')
      // const newUrl = path.join(process.cwd(), '/resources/SII_Decrypt.exe')
      const oldName = path.join(_this.gamePath, '/game.sii')
      const newName = path.join(_this.gamePath, '/game.sii.bak')
      fs.copyFile(oldName, newName, function (err) {
        if (err) {
          console.log('err')
        } else {
          console.log('copy')
        }
      })
      fs.stat(oldUrl, function (err) {
        if (err) {
          // _this.runCmd(newUrl)
          _this.$message.error('没有找到解码器')
        } else {
          _this.runCmd(oldUrl)
        }
      })
    },
    runCmd (cmdStr) {
      const _this = this
      cmdStr = cmdStr + ' "' + `${path.join(_this.gamePath, '/game.sii')}` + '"'
      console.log(cmdStr)
      // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
      const workerProcess = exec(cmdStr, {})

      // 打印正常的后台可执行程序输出
      workerProcess.stdout.on('data', function (data) {
        console.log(data)
      })

      // 打印错误的后台可执行程序输出
      workerProcess.stderr.on('data', function (data) {
        _this.$alert('请确认存档所在地址是否正确!', '解码失败', {
          confirmButtonText: '确定',
          callback: action => {
            _this.fullscreenLoading = false
          }
        })
      })

      // 退出之后的输出
      workerProcess.on('close', function (code) {
        console.log('out code：' + code)
        if (code === 0) {
          _this.$notify({
            title: '成功',
            message: '解码成功',
            type: 'success'
          })
        } else if (code === 1) {
          _this.$notify({
            title: '成功',
            message: '已解码',
            type: 'success'
          })
        } else {
          _this.$notify({
            title: '失败',
            message: '读取失败',
            type: 'success'
          })
        }
        _this.fullscreenLoading = false
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

