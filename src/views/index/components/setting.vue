<template>
  <el-container class="h" v-loading="fullscreenLoading">
    <el-container class="h">
      <el-aside width="340px">
        <el-container class="h">
          <el-header height="50px" class="nav">
            <div class="nav-box" @click="pathTypeChange('ETS2')" :class="{ active: pathType === 'ETS2' }">
              <div class="img"><i class="iconfont iconbaocun" style="margin-right: 10px;"></i>ETS2</div>
            </div>
            <div class="nav-box" @click="pathTypeChange('ATS')" :class="{ active: pathType === 'ATS' }">
              <div class="img"><i class="iconfont iconbaocun" style="margin-right: 10px;"></i>ATS</div>
            </div>
            <div class="nav-box" @click="pathTypeChange('666')" :class="{ active: pathType === '666' }">
              <div class="img"><i class="iconfont iconbaocun" style="margin-right: 10px;"></i>ABOUT</div>
              <!-- <img src="../../../assets/logo.png" alt=""> -->
            </div>
          </el-header>
          <el-main class="aside">
            <div class="icon_box">
              <i class="iconfont iconlogo-640 ets666_icon"></i>
              <div class="websize cursor_pointer" @click="goToWeb('https://ets666.com/')">ETS666.COM</div>
              <div class="line"></div>
            </div>
            <div class="btn_box">
              <div class="btn mb10 path_btn">
                <i class="iconfont iconsucai" style="font-size: 18px;margin-right: 10px;"></i>
                {{ $t("select") }}
                <!-- <div class="path_btn__item" @click="pathTypeChange('ETS2')">
                <div class="check">
                  <i v-show="pathType === 'ETS2'" class="iconfont iconfuxuankuanggou check_active"></i>
                </div>
                <div class="ml10">
                  ETS2
                </div>
              </div>
              <div class="path_btn__item ml10" @click="pathTypeChange('ATS')">
                <div class="check">
                  <i v-show="pathType === 'ATS'" class="iconfont iconfuxuankuanggou check_active"></i>
                </div>
                <div class="ml10">
                  ATS
                </div>
              </div> -->
              </div>
              <div>
                <el-select v-model="profile" size="large" :placeholder="$t('selectProfile')" class="mb10 w select_shadow"
                  @change="changeProfile">
                  <el-option v-for="(item, index) in profileOptions" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="save" size="large" :placeholder="$t('selectSave')" class="mb10 w select_shadow"
                  @change="reSet">
                  <el-option v-for="item in saveOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="btn mb10 cursor_pointer" @click="saveSetting">
                <i class="iconfont iconbaocun" style="margin-right: 5px;"></i>
                {{ $t("save") }}
              </div>
            </div>
          </el-main>
        </el-container>

      </el-aside>
      <el-main style="padding: 10px 18px; user-select: none">
        <div v-show="['ETS2', 'ATS'].indexOf(pathType) !== -1" class="content_box w">
          <div v-show="pathType === 'ETS2'" class="job_box">
            <div class="shadow_box">
              <div class="job_offer">
                <div class="job_info">
                  <i class="iconfont iconhb-addrss f21"></i>
                  <div class="f21 fb ml10">{{ $t("job") }}</div>
                  <div class="line2">&nbsp;</div>
                  <el-select v-model="tody" size="large" popper-class="select-ets" style="width: 200px"
                    @change="changeTime">
                    <el-option v-for="item in timeOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="job_check_box">
                  <div class="check_btn job_bg" style="min-width: 100px" @click="clickBtn('syncJob')">
                    <div class="check">
                      <i v-show="job.syncJob" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("syncJob") }}
                    </div>
                  </div>
                  <div class="check_btn job_bg ml10" @click="clickBtn('moveToCargo')">
                    <div class="check">
                      <i v-show="job.moveToCargo" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("moveCar") }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="job_table">
                <el-row>
                  <el-col :span="8">
                    <div class="title bgf8d2af" style="padding: 10px 0">
                      {{ $t("server") }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div style="padding: 10px 0 10px 20px" class="bgf8d2af">
                      <span v-if="i18nCustom">{{ i18nCustom.server }}</span>
                      <span v-else>&nbsp;</span>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <div class="title" style="padding: 10px 0">
                      {{ $t("departureCity") }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div style="padding: 10px 0 10px 20px">
                      <span v-if="i18nCustom">{{ i18nCustom.departure_city }}</span>
                      <span v-else>&nbsp;</span>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <div class="title bgf8d2af" style="padding: 10px 0">
                      {{ $t("departureCompany") }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div style="padding: 10px 0 10px 20px" class="bgf8d2af">
                      <span v-if="i18nCustom">{{ i18nCustom.departure_company }}</span>
                      <span v-else>&nbsp;</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <div class="title" style="padding: 10px 0">
                      {{ $t("destinationCity") }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div style="padding: 10px 0 10px 20px">
                      <span v-if="i18nCustom">{{ i18nCustom.destination_city }}</span>
                      <span v-else>&nbsp;</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <div class="title bgf8d2af" style="padding: 10px 0">
                      {{ $t("destinationCompany") }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div style="padding: 10px 0 10px 20px" class="bgf8d2af">
                      <span v-if="i18nCustom">{{ i18nCustom.destination_company }}</span>
                      <span v-else>&nbsp;</span>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <div class="title" style="padding: 10px 0">
                      {{ $t("cargo") }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div style="padding: 10px 0 10px 20px">
                      <span v-if="i18nCustom">{{ i18nCustom.cargo }}</span>
                      <span v-else>&nbsp;</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <div class="title bgf8d2af" style="padding: 10px 0">
                      {{ $t("mileage") }}
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div style="padding: 10px 0 10px 20px" class="bgf8d2af">
                      <template v-if="jobInfo && jobInfo.shortest_distance_km">
                        {{
                          jobInfo.shortest_distance_km + jobInfo.ferry_distance_km
                        }}
                        km
                        <span v-if="jobInfo.ferry_distance_km">({{ jobInfo.ferry_distance_km }} km {{ $t("ferry")
                        }})</span>
                      </template>
                      <span v-else>&nbsp;</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>

          <div class="setting_box">
            <div class="shadow_box">
              <div class="setting_title">
                <i class="iconfont iconico-share" style="font-size: 18px"></i>
                <span class="f21 fb ml10">
                  {{ $t("change") }}
                </span>
              </div>
              <div class="setting_table">
                <div class="setting_check_box">
                  <div class="check_btn bgfab97d" @click="clickBtn('money')">
                    <div class="check">
                      <i v-show="setting.money" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("money") }}
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('level')">
                    <div class="check">
                      <i v-show="setting.level" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("level") }}
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('skills')">
                    <div class="check">
                      <i v-show="setting.skills" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("skills") }}
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('city')">
                    <div class="check">
                      <i v-show="setting.city" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("city") }}
                    </div>
                  </div>
                </div>

                <div class="setting_check_box">
                  <div class="check_btn bgfab97d" @click="clickBtn('garage')">
                    <div class="check">
                      <i v-show="setting.garage" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("garage") }}
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('dealer')">
                    <div class="check">
                      <i v-show="setting.dealer" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("dealer") }}
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('damage')">
                    <div class="check">
                      <i v-show="setting.damage" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("damage") }}
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('oil')">
                    <div class="check">
                      <i v-show="setting.oil" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      {{ $t("oil") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="pathType === '666'" class="w">
          <aboutUs></aboutUs>
        </div>
        <el-dialog :title="$t('selectPath')" v-model="dialogTableVisible" :width="'80%'" :close-on-click-modal="false"
          :close-on-press-escape="false" :show-close="false">
          <selectPath v-if="dialogTableVisible" @pathSave="pathSave"></selectPath>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import moment from 'moment'
import selectPath from './select-euro-path'
import aboutUs from './about-us'
import { hex2utf8, errCatch } from '@/utils/index'
import { randomJobs } from '@/api/index'
const ipc = window.ipc

export default {
  name: 'SettingItem',
  components: {
    selectPath,
    aboutUs
  },
  props: {
    savePath: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogTableVisible: false,
      tody: '',
      timeOption: [],
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
        dealer: false,
        damage: false,
        oil: false
      },
      job: {
        moveToCargo: false,
        syncJob: false
      },
      pathType: 'ETS2',
      i18nCustom: null,
      severJobInfo: [],
      jobInfo: {},
      fullscreenLoading: false,
      localLanguage: 'en'
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
  async mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.localLanguage = navigator.language
      this.profileOptions = []
      const dir = await ipc.invoke('mapDirName', { dir: this.savePath, filedirname: '/profiles' })
      if (dir === 'invalidPath') this.dialogTableVisible = true
      if (!errCatch(dir)) {
        dir.forEach((element) => {
          const obj = {
            value: element,
            label: hex2utf8(element)
          }
          this.profileOptions.push(obj)
        })
      }
      // 获取随机Job
      if (this.pathType === 'ETS2') {
        const res = await randomJobs()
        if (res) {
          this.severJobInfo = res
          this.jobInfo = res[0]
          this.tody = this.utcDiff(res[0].assembly_time)
          res.forEach((element) => {
            const obj = {
              value: element.assembly_time,
              label: this.utcDiff(element.assembly_time)
            }
            this.timeOption.push(obj)
          })
          this.setLanguage()
        }
      }
    },
    utcDiff (serverTime) {
      const localTime = moment
        .utc(serverTime)
        .local()
        .format('YYYY-MM-DD HH:mm')
      const d = new Date()
      let diff = -d.getTimezoneOffset() / 60
      if (diff >= 0) {
        diff = '+' + diff
      }
      return localTime + ' (UTC' + diff + ')'
    },
    setLanguage () {
      const obj = new Map()
      this.jobInfo.i18n.map((element) => {
        obj.set(element.language, element)
      })
      if (obj.has(this.localLanguage)) {
        this.i18nCustom = obj.get(this.localLanguage)
      } else {
        this.i18nCustom = obj.get('Default')
      }
    },
    changeTime (val) {
      this.severJobInfo.forEach((element) => {
        if (element.assembly_time === val) {
          this.jobInfo = element
          this.setLanguage()
        }
      })
    },
    async changeProfile (path) {
      this.save = ''
      this.saveOptions = []
      const file = await ipc.invoke('mapDirName', { dir: this.savePath, filedirname: `/profiles/${path}/save` })
      if (file === 'invalidPath') this.dialogTableVisible = true
      if (!errCatch(file)) {
        file.forEach(async (element) => {
          // const data = ''
          const obj = {
            value: element,
            label: element
          }
          const name = await ipc.invoke('SiiDecryptInfo', `${this.savePath}/profiles/${path}/save/${element}`)
          if (!errCatch(name, 'info.sii') && name) {
            obj.label = name
          }
          this.saveOptions.push(obj)
        })
      }
      this.reSet()
    },
    reSet () {
      this.setting = {
        money: false,
        level: false,
        skills: false,
        city: false,
        garage: false,
        dealer: false,
        damage: false,
        oil: false
      }
      this.job = {
        moveToCargo: false,
        syncJob: false
      }
    },
    goToWeb (url) {
      ipc.send('open-url', url)
    },
    about () {
      ipc.send('about')
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
          case 'dealer':
            this.setting.dealer = !this.setting.dealer
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
            this.job.moveToCargo = !this.job.moveToCargo
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
    async saveSetting () {
      const { money, level, skills, city, garage, dealer, damage, oil } =
        this.setting
      const { moveToCargo, syncJob } = this.job
      if (
        money ||
        level ||
        skills ||
        city ||
        garage ||
        dealer ||
        damage ||
        oil ||
        moveToCargo ||
        syncJob
      ) {
        this.fullscreenLoading = true
        const info = {
          setting: this.setting,
          jobInfo: this.jobInfo,
          job: this.job
        }
        const gameSiiPath = `${this.savePath}/profiles/${this.profile}/save/${this.save}`
        const res = await ipc.invoke('SiiDecrypt', { dir: gameSiiPath, info: JSON.stringify(info) })
        this.gameSiiCatch(res)
      } else {
        this.$message.error(this.$t('error.nothingSelected'))
      }
    },
    gameSiiCatch (type) {
      if (['companyNotFound', 'companyNotSupported', 'writeFileFailed', 'failed', 'decryptFailed'].indexOf(type) !== -1) {
        this.$alert(this.$t(`error.${type}`), this.$t('error.error'), {
          confirmButtonText: this.$t('ok'),
          callback: action => {
            this.fullscreenLoading = false
          }
        })
      } else {
        this.$alert(this.$t('success.fileSaved'), this.$t('success.success'), {
          confirmButtonText: this.$t('ok'),
          callback: action => {
            this.fullscreenLoading = false
          }
        })
      }
    },
    pathSave ({ path, type }) {
      // TODO check logic
      // this.$message.success(this.$t('success.success'))
      this.dialogTableVisible = false
      // this.init()
      this.$emit('pathSave', { path, type })
    },
    pathTypeChange (type) {
      this.pathType = type
      this.reSetAll()
      this.$emit('pathTypeChange', type)
    },
    reSetAll () {
      this.job = {
        moveToCargo: false,
        syncJob: false
      }
      this.setting = {
        money: false,
        level: false,
        skills: false,
        city: false,
        garage: false,
        dealer: false,
        damage: false,
        oil: false
      }
      this.tody = ''
      this.timeOption = []
      this.profile = ''
      this.save = ''
      this.profileOptions = []
      this.saveOptions = []
      this.severJobInfo = []
      this.jobInfo = {}
    }
  }
}
</script>

<style scoped lang="scss">
$dark-blue: #4a71a0;
$blue: #1d4e89;
$light-blue: #6e8db3;
$grey: #7d8597;
$bg: #dbdbdb;
$bg2: #ededed;
$white: #fff;
$black: #000;

.w {
  width: 100%;
}

.h {
  height: 100%;
}

.cursor_pointer {
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
  color: $white;
  font-size: 16px;
  margin-top: 10px;
}

@font-face {
  font-family: Regular;
  src: url("../../../assets/font/LeagueGothic-Regular.ttf");
}

.check {
  background: $bg2;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  border: 2px solid $white;
  position: relative;
}

.check_active {
  position: absolute;
  font-size: 30px;
  color: $black;
  bottom: -5px;
  left: -5px;
}

.check_btn {
  padding: 5px 10px;
  text-align: left;
  border-radius: 5px;
  color: $white;
  font-size: 15px;
  box-shadow: 0px 0px 0px 1px $white, 3px 4px 10px 0px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  min-width: 160px;
}

.nav {
  background-color: $dark-blue;
  box-sizing: border-box;
  display: flex;
  padding: 5px 15px 0 15px;

  .active {
    background-color: $blue;
    margin: 5px 0 0 0;
    padding: 0;
    border-radius: 10px 10px 0 0;
  }

  .active::before,
  .active::after {
    position: absolute;
    bottom: 0;
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 100%;
    box-shadow: 0 0 0 40px $blue;
    /*使用box-shadow不影响尺寸*/
    transition: .2s;
  }

  .active::before {
    left: -20px;
    clip-path: inset(50% -10px 0 50%);
  }

  .active::after {
    right: -20px;
    clip-path: inset(50% 50% 0 -10px);
  }

  .nav-box {
    position: relative;
    display: flex;
    justify-content: center;
    width: 32.333%;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
      object-fit: cover;
      border-radius: 50%;
    }

    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: $white;
    }
  }
}

.aside {
  background: $blue;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  user-select: none;
  overflow: hidden;
}

.icon_box {
  position: relative;

  .websize {
    color: $white;
    font-size: 20px;
    font-family: Regular;
    font-style: normal;
    font-weight: 400;
    margin: 20px 0;
  }

  .line {
    width: 100%;
    height: 1px;
    background: $white;
    margin: 0 auto;
  }

  .ets666_icon {
    font-size: 85px;
    color: $white;
  }
}

.btn_box {
  width: 75%;

  .path_btn {
    display: flex;
    padding: 0 10px;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;

    .path_btn__item {
      display: flex;
      align-items: center;
      position: relative;

      .check_active {
        bottom: -10px;
      }
    }
  }

  .btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    color: $white;
    background: $dark-blue;
    font-size: 21px;
    box-shadow: 0px 0px 0px 1px $white, 3px 4px 10px 0px rgba(0, 0, 0, 0.4);
  }

  .select_shadow {
    box-shadow: 0px 0px 0px 1px $white, 3px 4px 10px 0px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
  }

  /deep/ .el-input__wrapper {
    background: $bg;
  }

  /deep/ .el-input__inner {
    background: $bg;
    border: none;
    height: 40px;

    &::-webkit-input-placeholder {
      color: $grey;
    }
  }

  /deep/ .el-select .el-input {
    color: $grey;
  }

}

.content_box {
  background: $bg2;
  border-radius: 5px;
  display: inline-block;
  color: $white;

  .job_box {
    padding: 10px;
  }

  .shadow_box {
    box-shadow: 0px 0px 0px 0px $white, 3px 4px 10px 0px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    overflow: hidden;
  }

  .job_offer {
    background: $dark-blue;
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

    /deep/ .el-select .el-input__wrapper {
      background: transparent;
      box-shadow: none !important;
      border-bottom: 1px solid $white;
      border: none;
      border-radius: 0;

      &::-webkit-input-placeholder {
        color: $white;
      }
    }

    /deep/ .el-select .el-input__wrapperis-focus {
      background: transparent;
      box-shadow: none !important;
      border-bottom: 1px solid $white;
      border: none;
      border-radius: 0;

      &::-webkit-input-placeholder {
        color: $white;
      }
    }

    /deep/ .el-input__inner {
      background: transparent;
      border: none;
      color: $white;
      // border-bottom: 1px solid $white;
      border-radius: 0;

      &::-webkit-input-placeholder {
        color: $white;
      }
    }

    /deep/ .el-select .el-input .el-select__caret {
      color: $white;
    }

    .line2 {
      background-color: $white;
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
      background: $dark-blue;
    }
  }

  .job_table {
    background: $bg2;
    color: $dark-blue;
    font-size: 21px;
    font-weight: bold;

    .bgf8d2af {
      background: $bg;
    }

    .title {
      text-align: center;
      border-right: 1px solid $white;
    }
  }

  .setting_box {
    padding: 10px;

    .setting_title {
      background: $dark-blue;
      height: 40px;
      padding: 0 20px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .setting_table {
      background: $bg;
      height: 180px;
    }

    .setting_check_box {
      padding: 25px 30px;
      display: flex;
      flex-direction: row;
    }

    .bgfab97d {
      background: $light-blue;
      margin-right: 20px;
    }
  }
}
</style>
