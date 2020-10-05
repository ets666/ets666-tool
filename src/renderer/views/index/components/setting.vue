<template>
  <el-container class="h" v-loading="fullscreenLoading">
    <el-aside width="320px" class="aside">
      <div class="icon_box">
        <i class="iconfont iconlogo-640 ets666_icon"></i>
        <div class="websize cursor_pointer" @click="goToWeb">
          ETS666.COM
        </div>
        <div class="line"></div>
      </div>
      <div class="btn_box">
        <div class="btn mb10">
        <i class="iconfont iconsucai" style="font-size: 18px;"></i>
          {{ $t('select') }}
        </div>
        <div>
          <el-select v-model="profile" size="mini" :placeholder="$t('selectProfile')" class="mb10 w select_shadow" @change="changeProfile">
            <el-option
              v-for="item in profileOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="save" size="mini" :placeholder="$t('selectSave')" class="mb10 w select_shadow" @change="reSet">
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
          {{ $t('save') }}
        </div>
        <div class="copyright cursor_pointer" @click="about">
          &copy; ETS666
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
                <div class="f21 fb ml10">{{ $t('job') }}</div>
                <div class="line2">
                  &nbsp;
                </div>
                <el-select v-model="tody" size="mini" style="width: 200px;" @change="changeTime">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="job_check_box">
                <div class="check_btn job_bg" style="min-width: 100px;" @click="clickBtn('syncJob')">
                  <div class="check">
                    <i v-show="job.syncJob" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    {{ $t('syncJob') }}
                  </div>
                </div>
                <div class="check_btn job_bg ml10" @click="clickBtn('moveToCargo')">
                  <div class="check">
                    <i v-show="job.moveToCargo" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    {{ $t('moveCar') }}
                  </div>
                </div>
              </div>
            </div>

            <div class="job_table">
              <el-row>
                <el-col :span="8">
                  <div class="title bgf8d2af" style="padding: 10px 0;">
                    {{ $t('server') }}
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
                    {{ $t('departureCity') }}
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
                    {{ $t('departureCompany') }}
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
                    {{ $t('destinationCity') }}
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
                    {{ $t('destinationCompany') }}
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
                    {{ $t('cargo') }}
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
                    {{ $t('mileage') }}
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="padding: 10px 0 10px 20px;" class="bgf8d2af">
                    <template v-if="jobInfo && jobInfo.shortest_distance_km">
                      {{ jobInfo.shortest_distance_km + jobInfo.ferry_distance_km }} km <span v-if="jobInfo.ferry_distance_km">({{ jobInfo.ferry_distance_km }} km {{ $t('ferry') }})</span>
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
              <span class="f21 fb ml10">
              {{ $t('change') }}
              </span>
            </div>
            <div class="setting_table">
              <div class="setting_check_box">
                <div class="check_btn bgfab97d" @click="clickBtn('money')">
                  <div class="check">
                    <i v-show="setting.money" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    {{ $t('money') }}
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('level')">
                  <div class="check">
                    <i v-show="setting.level" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    {{ $t('level') }}
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('skills')">
                  <div class="check">
                    <i v-show="setting.skills" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    {{ $t('skills') }}
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('city')">
                  <div class="check">
                    <i v-show="setting.city" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    {{ $t('city') }}
                  </div>
                </div>
              </div>

              <div class="setting_check_box">
                <div class="check_btn bgfab97d" @click="clickBtn('garage')">
                  <div class="check">
                    <i v-show="setting.garage" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    {{ $t('garage') }}
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('damage')">
                  <div class="check">
                    <i v-show="setting.damage" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    {{ $t('damage') }}
                  </div>
                </div>

                <div class="check_btn bgfab97d" @click="clickBtn('oil')">
                  <div class="check">
                    <i v-show="setting.oil" class="iconfont iconfuxuankuanggou check_active"></i>
                  </div>
                  <div class="ml10">
                    {{ $t('oil') }}
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
const { ipcRenderer } = require('electron')

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
      i18n: null,
      severJobInfo: [],
      jobInfo: {},
      fullscreenLoading: false,
      localLanguage: 'zh-CN'
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
      this.localLanguage = navigator.language
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

      axios.get('https://ets666.com/api/random_jobs/')
        .then(res => {
          if (res.data) {
            _this.severJobInfo = res.data
            _this.jobInfo = res.data[0]
            _this.tody = this.utcDiff(res.data[0].assembly_time)
            res.data.forEach((element) => {
              const obj = {
                value: element.assembly_time,
                label: this.utcDiff(element.assembly_time)
              }
              _this.timeOption.push(obj)
            })
            _this.setLanguage()
          }
        })
    },
    utcDiff (serverTime) {
      const localTime = moment.utc(serverTime).local().format('YYYY-MM-DD HH:mm')
      let diff = moment(localTime).diff(moment(serverTime), 'hours')
      if (diff >= 0) {
        diff = '+' + diff
      }
      return localTime + ' (UTC' + diff + ')'
    },
    setLanguage () {
      const obj = new Map()
      this.jobInfo.i18n.map(element => {
        obj.set(element.language, element)
      })
      if (obj.has(this.localLanguage)) {
        this.$set(this, 'i18n', obj.get(this.localLanguage))
      } else {
        this.$set(this, 'i18n', obj.get('Default'))
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
                data = fs.readFileSync(infoPath, 'utf8')
                const reg = / name: (.*)/
                let name = reg.exec(data)[1].trim()

                if (name.startsWith('"')) {
                  name = escape(name.substring(1, name.length - 1))
                  name = name.replace(/%5Cx/gm, '%')
                  name = name.replace(/%5C/gm, '')
                  obj.label = decodeURIComponent(name)
                } else {
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
    goToWeb () {
      ipcRenderer.send('open-url', 'https://www.ets666.com/')
    },
    about () {
      ipcRenderer.send('about')
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
          message: this.$t('error.selectSaveFirst'),
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
              fileEdit.editGameSii(gameSiiPath, '/game.sii', obj, (file) => {
                _this.$alert(_this.$t('success.fileSaved'), _this.$t('success.success'), {
                  confirmButtonText: _this.$t('ok'),
                  callback: action => {
                    _this.fullscreenLoading = false
                  }
                })
              }, (err) => {
                _this.$alert(err, _this.$t('error.error'), {
                  confirmButtonText: _this.$t('ok'),
                  callback: action => {
                    _this.fullscreenLoading = false
                  }
                })
              })
              break

            default:
              _this.$notify({ title: _this.$t('error.failed'), message: _this.$t('error.decryptFailed'), type: 'success' })
              _this.error = _this.$t('error.decryptFailed')
              _this.fullscreenLoading = false
              break
          }
        }, (err) => {
          _this.$alert(err, _this.$t('error.error'), {
            confirmButtonText: _this.$t('ok'),
            callback: action => {
              _this.fullscreenLoading = false
            }
          })
        })
      } else {
        _this.$message.error(_this.$t('error.nothingSelected'))
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

.copyright {
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
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
  min-width: 150px;
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
    color: #fff;
    font-size: 20px;
    font-family: Regular;
    font-style: normal;
    font-weight: 400;
    margin: 20px 0;
  }

  .line {
    width: 100%;
    height: 1px;
    background: #fff;
    margin: 0 auto;
  }

  .ets666_icon {
    font-size: 80px;
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

