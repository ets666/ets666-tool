<template>
  <div class="w h" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="menu_box">
      <div class="path_box">
        路径:
        <el-input placeholder="服务器" style="width: 80%;" size="mini" disabled v-model="savePath" />
        <el-button type="text" style="font-size: 12px;" @click="changePath">修改</el-button>
      </div>
    </div>
    <div class="menu_box">
      <div class="box">
        <div class="mb10">
          选择存档:
        </div>
        <el-select v-model="profile" size="mini" placeholder="请选择档案" class="mb10" @change="changeProfile">
          <el-option
            v-for="item in profileOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="save" size="mini" placeholder="请选择存档" class="mb10">
          <el-option
            v-for="item in saveOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="box">
        <div class="mb10">
          货物同步:
        </div>
        <el-checkbox v-model="job.synTody" class="mb10">
          同步今日联运任务
        </el-checkbox>
        <el-checkbox v-model="job.moveToCargo">
          移动车辆至起点货场
        </el-checkbox>
      </div>
    </div>

    <div class="menu_box">
      <div class="box">
        <div class="mb10">
          存档修改:
        </div>
        <el-checkbox v-model="setting.money" class="mb10">
          修改金钱为1亿
        </el-checkbox>
        <el-checkbox v-model="setting.level" class="mb10">
          修改玩家级别为100级
        </el-checkbox>
        <el-checkbox v-model="setting.skills" class="mb10">
          解锁全部技能
        </el-checkbox>
        <el-checkbox v-model="setting.city" class="mb10">
          解锁全部城市
        </el-checkbox>
        <el-checkbox v-model="setting.garage" class="mb10">
          解锁全部车库
        </el-checkbox>
        <el-checkbox v-model="setting.damage" class="mb10">
          修复全部车损
        </el-checkbox>
        <el-checkbox v-model="setting.oil" class="mb10">
          全部车辆满油
        </el-checkbox>
      </div>

      <div class="box">
        <div class="mb10">
          {{ tody }}联运信息:
        </div>
        <div class="text_box mb10">
          <span class="text">服务器:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="jobInfo.server" />
        </div>
        <div class="text_box mb10">
          <span class="text">起点城市:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="jobInfo.startCity" />
        </div>
        <div class="text_box mb10">
          <span class="text">起点货场:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="jobInfo.startCargo" />
        </div>
        <div class="text_box mb10">
          <span class="text">终点城市:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="jobInfo.endCity" />
        </div>
        <div class="text_box mb10">
          <span class="text">终点货场:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="jobInfo.endCargo" />
        </div>
        <div class="text_box mb10">
          <span class="text">货物:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="jobInfo.cargo" />
        </div>
        <div class="text_box mb10">
          <span class="text">预估里程:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="jobInfo.mileage" />
        </div>


      </div>
    </div>

    <div class="menu_box">
      <div class="box" style="margin-right: 10px;">
        <el-button type="primary" class="btn" :disabled="!(profile && save)" @click="saveSetting">一键修改存档</el-button>
      </div>

      <div class="box">
        <el-button type="primary" class="btn" :disabled="!(profile && save)">保存联运任务</el-button>
      </div>
    </div>

    <div class="menu_box">
      <div class="err_box">
        错误信息
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { hex2utf8 } from '../../../../utils/byte'
const fileEdit = require('../../../../utils/fileEdit')

export default {
  data () {
    return {
      savePath: '',
      tody: moment().format('yyyy年MM月DD日'),
      profile: '',
      save: '',
      profileOptions: [],
      saveOptions: [],
      setting: {
        money: false,
        level: false,
        skills: false,
        city: false,
        garage: false,
        damage: false,
        oil: false
      },
      job: {
        synTody: false,
        moveToCargo: false
      },
      jobInfo: {
        server: '',
        startCity: '',
        startCargo: '',
        endCity: '',
        endCargo: '',
        cargo: '',
        mileage: ''
      },
      fullscreenLoading: false
    }
  },
  created () {
    try {
      this.savePath = this.$db.read().get('path').value()
    } catch (error) {
      this.savePath = ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const _this = this
      _this.profileOptions = []
      fileEdit.mapDirName(this.savePath, '/profiles', (file) => {
        file.forEach((element) => {
          const obj = {
            value: element,
            label: hex2utf8(element)
          }
          _this.profileOptions.push(obj)
        })
      }, (err) => {
        _this.$nextTick(() => {
          _this.$message.error(err)
        })
      })
    },
    changePath () {
      this.$emit('changePath')
    },
    changeProfile (path) {
      const _this = this
      _this.saveOptions = []
      console.log(this.savePath, '/profiles/' + path)
      fileEdit.mapDirName(this.savePath, '/profiles/' + path + '/save', (file) => {
        file.forEach((element) => {
          const obj = {
            value: element,
            label: element
          }
          _this.saveOptions.push(obj)
        })
      }, (err) => {
        _this.$nextTick(() => {
          _this.$message.error(err)
        })
      })
    },
    saveSetting () {
      const _this = this
      _this.fullscreenLoading = true
      const obj = {
        setting: _this.setting,
        jobInfo: _this.jobInfo,
        job: _this.job
      }
      const gameSiiPath = this.savePath + '/profiles/' + this.profile + '/save/' + this.save
      fileEdit.SiiDecrypt(gameSiiPath, (code) => {
        switch (code) {
          case 0:
          case 1:
            // _this.$notify({ title: '成功', message: '解码成功', type: 'success' })
            fileEdit.editGameSii(gameSiiPath, '/game.sii', obj, (file) => {
              _this.$alert('保存成功', '成功', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.fullscreenLoading = false
                }
              })
            }, (err) => {
              _this.$alert(err, '错误', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.fullscreenLoading = false
                }
              })
            })
            break

          default:
            _this.$notify({ title: '失败', message: '解码失败', type: 'success' })
            _this.fullscreenLoading = false
            break
        }
      }, (err) => {
        _this.$alert(err, '错误', {
          confirmButtonText: '确定',
          callback: action => {
            _this.fullscreenLoading = false
          }
        })
      })
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

.menu_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
}
.mb10 {
  margin-bottom: 10px;
}
.text_box {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.text {
  width: 100px;
  text-align: left;
}
.btn {
  width: 100%;
  margin-top: 30px;
}
.err_box {
  width: 100%;
  height: 80px;
  padding: 5px;
  border: 1px solid #ddd;
  color: #F56C6C;
  font-size: 12px;
}
.path_box {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  font-size: 12px;
}
</style>

