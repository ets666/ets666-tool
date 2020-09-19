<template>
  <el-container class="h" v-loading="fullscreenLoading">
    <el-aside width="320px" class="aside">
      <div class="icon_box">
        <i class="iconfont icon00000 ets666_icon"></i>
        <div class="websize">
          ETS666.COM
        </div>
        <div class="line"></div>
      </div>
      <div class="btn_box">
        <div class="btn mb10">
        <i class="iconfont iconsucai" style="font-size: 18px;"></i>
          选择存档
        </div>
        <div>
          <el-select v-model="profile" size="mini" placeholder="请选择档案" class="mb10 w select_shadow" @change="changeProfile">
            <el-option
              v-for="item in profileOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="save" size="mini" placeholder="请选择存档" class="mb10 w select_shadow" @change="reSet">
            <el-option
              v-for="item in saveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="btn mb10 cursor_pointer" @click="saveSetting">
          <i class="iconfont iconbaocun"></i>
          保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存
        </div>
      </div>
    </el-aside>
    <el-main style="padding: 10px 18px;user-select: none;">
      <div class="content_box w">
        <div class="job_box">
          <div class="shadow_box">
            <div class="job_offer">
              <div class="job_info">
                <i class="iconfont iconhb-addrss f21"></i>
                <div class="f21 fb ml10">联运任务</div>
                <div class="line2">
                  &nbsp;
                </div>
                <el-select v-model="tody" size="mini" style="width: 150px;" @change="changeTime">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="job_check_box">
                <div class="check_btn job_bg" @click="clickBtn('syncJob')">
                  <div class="check">
                    <i v-show="job.syncJob" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    同步今日联运任务
                  </div>
                </div>
                <div class="check_btn job_bg ml10" @click="clickBtn('moveToCargo')">
                  <div class="check">
                    <i v-show="job.moveToCargo" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    移动车辆至起点货场(实验性)
                  </div>
                </div>
              </div>
            </div>

            <div class="job_table">
              <el-row>
                <el-col :span="8">
                  <div class="title bgf8d2af" style="padding: 10px 0;">
                    服&nbsp;&nbsp;务&nbsp;&nbsp;器
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="padding: 10px 0 10px 20px;" class="bgf8d2af">
                    <span v-if="i18n">{{ i18n.server}}</span>
                  </div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <div class="title" style="padding: 10px 0;">
                    出发城市
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="padding: 10px 0 10px 20px;">
                    <span v-if="i18n">{{ i18n.departure_city}}</span>
                  </div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <div class="title bgf8d2af" style="padding: 10px 0;">
                    出发货场
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="padding: 10px 0 10px 20px;" class="bgf8d2af">
                    <span v-if="i18n">{{ i18n.departure_company}}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="title" style="padding: 10px 0;">
                    终点城市
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="padding: 10px 0 10px 20px;">
                    <span v-if="i18n">{{ i18n.destination_city}}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="title bgf8d2af" style="padding: 10px 0;">
                    终点货场
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="padding: 10px 0 10px 20px;" class="bgf8d2af">
                    <span v-if="i18n">{{ i18n.destination_company}}</span>
                  </div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <div class="title" style="padding: 10px 0;">
                    货&nbsp;&nbsp;&nbsp;&nbsp;物
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="padding: 10px 0 10px 20px;">
                    <span v-if="i18n">{{ i18n.cargo}}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div class="title bgf8d2af" style="padding: 10px 0;">
                    预估里程
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="padding: 10px 0 10px 20px;" class="bgf8d2af">
                    <template v-if="jobInfo && jobInfo.shortest_distance_km">
                      {{ jobInfo.shortest_distance_km + jobInfo.ferry_distance_km }} km <span v-if="jobInfo.ferry_distance_km">(含轮渡{{ jobInfo.ferry_distance_km }} km)</span>
                    </template>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>

        <div class="setting_box">
          <div class="shadow_box">
            <div class="setting_title">
              <i class="iconfont iconico-share" style="font-size: 18px;"></i>
              <span class="f21 fb ml10">存档修改</span>
            </div>
            <div class="setting_table">
              <div class="setting_check_box">
                <div class="check_btn bgfab97d" @click="clickBtn('money')">
                  <div class="check">
                    <i v-show="setting.money" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    修改金钱为1亿
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('level')">
                  <div class="check">
                    <i v-show="setting.level" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    修改玩家级别为100级
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('skills')">
                  <div class="check">
                    <i v-show="setting.skills" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    解锁全部技能
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('city')">
                  <div class="check">
                    <i v-show="setting.city" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    解锁全部城市
                  </div>
                </div>
              </div>

              <div class="setting_check_box">
                <div class="check_btn bgfab97d" @click="clickBtn('garage')">
                  <div class="check">
                    <i v-show="setting.garage" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    解锁全部车库
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('damage')">
                  <div class="check">
                    <i v-show="setting.damage" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    修复全部车损
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('oil')">
                  <div class="check">
                    <i v-show="setting.oil" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    全部车辆满油
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import moment from 'moment'
import { hex2utf8 } from '../../../../utils/byte'
const fileEdit = require('../../../../utils/fileEdit')
const axios = require('axios')
const fs = require('fs')
const paths = require('path')

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
  watch: {
    'job.syncJob': {
      handler (val) {
        if (!val) {
          this.job.moveToCargo = false
        }
      },
      deep: true
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
          if (res.data) {
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
          }
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
          let data = ''
          const obj = {
            value: element,
            label: element
          }
          fileEdit.SiiDecryptInfo(_this.savePath + '/profiles/' + path + '/save/' + element, (code) => {
            let infoPath = paths.join(_this.savePath, '/profiles/' + path + '/save/', element + '/info.sii')
            switch (code) {
              case 0:
              case 1:
                data = fs.readFileSync(infoPath)
                const name = JSON.parse(data.toString().slice(data.toString().indexOf(' name: ') + 7, data.toString().indexOf(' time: ') - 1))
                if (name !== '') {
                  obj.label = name
                }
                break
            }
          })
          _this.saveOptions.push(obj)
        })
      }, (err) => {
        _this.$nextTick(() => {
          _this.$message.error(err)
          _this.error = err
        })
      })
      this.reSet()
    },
    reSet () {
      this.setting = {
        money: false,
        level: false,
        skills: false,
        city: false,
        garage: false,
        damage: false,
        oil: false
      }
      this.job = {
        moveToCargo: false,
        syncJob: false
      }
    },
    clickBtn (val) {
      if (this.profile && this.save) {
        switch (val) {
          case 'money':
            this.setting.money = !this.setting.money
            break
          case 'level':
            this.setting.level = !this.setting.level
            break
          case 'skills':
            this.setting.skills = !this.setting.skills
            break
          case 'city':
            this.setting.city = !this.setting.city
            break
          case 'garage':
            this.setting.garage = !this.setting.garage
            break
          case 'damage':
            this.setting.damage = !this.setting.damage
            break
          case 'oil':
            this.setting.oil = !this.setting.oil
            break
          case 'syncJob':
            this.job.syncJob = !this.job.syncJob
            break
          case 'moveToCargo':
            if (this.job.syncJob) {
              this.job.moveToCargo = !this.job.moveToCargo
            }
            break
        }
      } else {
        this.$message({
          message: '请先选择存档',
          type: 'warning',
          center: 'center'
        })
      }
    },
    saveSetting () {
      const _this = this
      const {money, level, skills, city, garage, damage, oil} = this.setting
      const {moveToCargo, syncJob} = this.job
      if (money || level || skills || city || garage || damage || oil || moveToCargo || syncJob) {
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
      } else {
        _this.$message.error('没有勾选项')
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
.cursor_pointer{
  cursor: pointer;
}

.mb10 {
  margin-bottom: 10px;
}
.ml10 {
  margin-left: 10px;
}

.f21 {
  font-size: 21px;
}

.fb {
  font-weight: bold;
}

@font-face{
  font-family: Regular;
  src:url('../../../assets/font/LeagueGothic-Regular.ttf');
}

.check {
  background: #efe9e2;
  border-radius: 10px;
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  position: relative;
}

.check_active {
  position: absolute;
  font-size: 30px;
  color: #000;
  bottom: -5px;
  left: -5px;
}

.check_btn {
  padding: 5px 10px;
  text-align: left;
  border-radius: 5px;
  color: #fff;
  font-size: 15px;
  box-shadow: 0px 0px 0px 1px #fff, 3px 4px 10px 0px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.aside {
  background: #ef5350;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  user-select: none;
}

.icon_box {
  position: relative;

  .websize {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
    color: #fff;
    font-size: 20px;
    font-family: Regular;
    font-style: normal;
    font-weight: 400;
  }

  .line {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    width: 65%;
    height: 1px;
    background: #fff;
    margin: 0 auto;
  }

  .ets666_icon {
    font-size: 200px;
    color: #fff;
  }
}

  .btn_box {
    width: 65%;

    .btn {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 5px;
      color: #fff;
      background: #dd7262;
      font-size: 21px;
      box-shadow: 0px 0px 0px 1px #fff, 3px 4px 10px 0px rgba(0, 0, 0, 0.4);
    }
    .select_shadow {
      box-shadow: 0px 0px 0px 1px #fff, 3px 4px 10px 0px rgba(0, 0, 0, 0.4);
      border-radius: 5px;
    }

    /deep/ .el-input__inner {
      background: #f4c7c2;
      border: none;
      height: 40px;

      &::-webkit-input-placeholder {
        color: #606266;
      }
    }

    /deep/ .el-select .el-input .el-select__caret {
      color: #606266;
    }
  }

  .content_box {
    background: #efe9e2;
    border-radius: 5px;
    display: inline-block;
    color: #fff;

    .job_box {
      padding: 10px;
    }

    .shadow_box {
      box-shadow: 0px 0px 0px 0px #fff, 3px 4px 10px 0px rgba(0, 0, 0, 0.4);
      border-radius: 5px;
      overflow: hidden;
    }

    .job_offer {
      background: #dd7262;
      height: 70px;
      padding: 0 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .job_info {
      display: flex;
      flex-direction: row;
      align-items: center;

      /deep/ .el-input__inner {
        background: transparent;
        border: none;
        color: #fff;
        border-bottom: 1px solid #fff;
        border-radius: 0;

        &::-webkit-input-placeholder {
          color: #fff;
        }
      }

      /deep/ .el-select .el-input .el-select__caret {
        color: #fff;
      }

      .line2 {
        background-color: #fff;
        width: 1px;
        height: 35px;
        margin: 0 10px;
      }
    }

    .job_check_box {
      display: flex;
      flex-direction: row;
      align-items: center;

      .job_bg {
        background: #e99386;
      }
    }

    .job_table {
      background: #f5dfcb;
      color: #dd7262;
      font-size: 21px;
      font-weight: bold;

      .bgf8d2af {
        background: #f8d2af;
      }

      .title {
        text-align: center;
        border-right: 1px solid #fff;
      }
    }

  .setting_box {
      padding: 10px;

      .setting_title {
        background: #dd7262;
        height: 40px;
        padding: 0 20px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }

      .setting_table {
        background: #f5dfcb;
        height: 180px;
      }

      .setting_check_box {
        padding: 25px 30px;
        display: flex;
        flex-direction: row;
      }

      .bgfab97d {
        background: #fab97d;
        margin-right: 20px;
      }
    }
  }
</style>

