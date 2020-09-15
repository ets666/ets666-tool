<template>
  <div class="w h" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- <div class="menu_box">
      <div class="path_box">
        路径:
        <el-input placeholder="服务器" style="width: 80%;" size="mini" disabled v-model="savePath" />
        <el-button type="text" style="font-size: 12px;" @click="changePath">修改</el-button>
      </div>
    </div> -->
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
        <div class="text_box mb10">
          <span class="text">集合时间:</span>
          <el-select v-model="tody" size="mini" class="mb10" @change="changeTime">
            <el-option
              v-for="item in timeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="menu_box">
      <div class="box">
        <div class="mb10">
          存档修改:
        </div>
        <el-checkbox v-model="setting.money" :disabled="!(profile && save)" class="mb10">
          修改金钱为1亿
        </el-checkbox>
        <el-checkbox v-model="setting.level" :disabled="!(profile && save)" class="mb10">
          修改玩家级别为100级
        </el-checkbox>
        <el-checkbox v-model="setting.skills" :disabled="!(profile && save)" class="mb10">
          解锁全部技能
        </el-checkbox>
        <el-checkbox v-model="setting.city" :disabled="!(profile && save)" class="mb10">
          解锁全部城市
        </el-checkbox>
        <el-checkbox v-model="setting.garage" :disabled="!(profile && save)" class="mb10">
          解锁全部车库
        </el-checkbox>
        <el-checkbox v-model="setting.damage" :disabled="!(profile && save)" class="mb10">
          修复全部车损
        </el-checkbox>
        <el-checkbox v-model="setting.oil" :disabled="!(profile && save)" class="mb10">
          全部车辆满油
        </el-checkbox>
      </div>

      <div class="box">
        <div class="text_box mb10">
          <span class="text">服务器:</span>
          <!-- {{ jobInfo.server }} -->
          <span v-if="i18n">{{ i18n.server}}</span>
        </div>
        <div class="text_box mb10">
          <span class="text">起点城市:</span>
          <!-- {{ jobInfo.departure_city }} -->
          <span v-if="i18n">{{ i18n.departure_city}}</span>
        </div>
        <div class="text_box mb10">
          <span class="text">起点货场:</span>
          <!-- {{ jobInfo.departure_company }} -->
          <span v-if="i18n">{{ i18n.departure_company}}</span>
        </div>
        <div class="text_box mb10">
          <span class="text">终点城市:</span>
          <!-- {{ jobInfo.destination_city }} -->
          <span v-if="i18n">{{ i18n.destination_city}}</span>
        </div>
        <div class="text_box mb10">
          <span class="text">终点货场:</span>
          <!-- {{ jobInfo.destination_company }} -->
          <span v-if="i18n">{{ i18n.destination_company}}</span>
        </div>
        <div class="text_box mb10">
          <span class="text">货物:</span>
          <!-- {{ jobInfo.cargo }} -->
          <span v-if="i18n">{{ i18n.cargo}}</span>
        </div>
        <div class="text_box mb10">
          <span class="text">预估里程:</span>
          {{ jobInfo.shortest_distance_km + jobInfo.ferry_distance_km }} km <span v-if="jobInfo.ferry_distance_km">(含轮渡{{ jobInfo.ferry_distance_km }} km)</span>
        </div>

        <el-checkbox v-model="job.syncJob" :disabled="!(profile && save)">
          同步今日联运任务
        </el-checkbox>
        <el-checkbox v-model="job.moveToCargo" :disabled="!(profile && save && job.syncJob)">
          移动车辆至起点货场(实验性)
        </el-checkbox>
      </div>
    </div>

    <div class="menu_box">
        <el-button type="primary" class="btn" :disabled="!(profile && save)" @click="saveSetting">一键修改存档</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { hex2utf8 } from '../../../../utils/byte'
const fileEdit = require('../../../../utils/fileEdit')
const axios = require('axios')

export default {
  data () {
    return {
      savePath: '',
      tody: '',
      timeOption: [],
      error: '',
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
        moveToCargo: false,
        syncJob: false
      },
      i18n: {},
      severJobInfo: [],
      jobInfo: {},
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
          _this.error = err
        })
      })

      axios.get('https://api.ets666.com/jobsync/')
        .then(res => {
          _this.severJobInfo = res.data
          _this.jobInfo = res.data[0]
          _this.tody = moment.utc(res.data[0].assembly_time).local().format('YYYY-MM-DD HH:mm')
          res.data.forEach((element) => {
            const obj = {
              value: element.assembly_time,
              label: moment.utc(element.assembly_time).local().format('YYYY-MM-DD HH:mm')
            }
            _this.timeOption.push(obj)
          })
          _this.setLanguage()
        })
    },
    setLanguage () {
      for (let i = 0; i < this.jobInfo.i18n.length; i++) {
        if (this.jobInfo.i18n[i].language === 'zh-CN') {
          this.$set(this, 'i18n', this.jobInfo.i18n[i])
          break
        }
      }
    },
    changePath () {
      this.$emit('changePath')
    },
    changeTime (val) {
      this.severJobInfo.forEach(element => {
        if (element.assembly_time === val) {
          this.jobInfo = element
          this.setLanguage()
        }
      })
    },
    changeProfile (path) {
      const _this = this
      _this.save = ''
      _this.saveOptions = []
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
          _this.error = err
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
            _this.error = '解码失败'
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

