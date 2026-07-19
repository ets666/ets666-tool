<template>
  <el-container class="h" v-loading="fullscreenLoading">
    <el-container class="h">
      <el-aside width="340px" class="bg-color">
        <el-container class="h bg-color">
          <el-header height="50px" class="nav">
            <div class="nav-box" @click="pathTypeChange('ETS2')" :class="{ active: pathType === 'ETS2' }">
              <div class="img"><i class="iconfont iconkache3" style="margin-right: 10px;"></i>ETS2</div>
            </div>
            <div class="nav-box" @click="pathTypeChange('ATS')" :class="{ active: pathType === 'ATS' }">
              <div class="img"><i class="iconfont iconhuoche" style="margin-right: 10px;"></i>ATS</div>
            </div>
          </el-header>
          <el-main class="aside">
            <div class="icon_box">
              <i class="iconfont iconlogo-640 ets666_icon cursor_pointer" @click="goToWeb('https://ets666.com/')"></i>
              <div class="websize cursor_pointer" @click="goToWeb('https://ets666.com/')">ETS666.COM</div>
              <div class="line"></div>
            </div>
            <div class="btn_box">
              <div class="btn mb10 path_btn" @click="dialogTableVisible = true">
                <i class="iconfont iconsucai" style="font-size: 18px;margin-right: 10px;"></i>
                选择路径
              </div>
              <div>
                <el-select v-model="profile" size="large" placeholder="选择存档" class="mb10 w select_shadow" @change="changeProfile" @visibleChange="visibleProfile">
                  <el-option v-for="(item, index) in profileOptions" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="save" size="large" placeholder="选择存档" class="mb10 w select_shadow"
                  @change="reSet">
                  <el-option v-for="item in saveOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="btn mb10 cursor_pointer" @click="saveSetting">
                <i class="iconfont iconbaocun" style="margin-right: 5px;"></i>
                保存
              </div>
              <div class="copyright cursor_pointer" @click="pathTypeChange('666')">&copy; ETS666</div>
            </div>
          </el-main>
        </el-container>

      </el-aside>
      <el-main style="padding: 10px 18px; user-select: none">
        <div v-show="['ETS2', 'ATS'].indexOf(pathType) !== -1" class="content_box w">
          <div v-show="pathType === 'ETS2' || pathType === 'ATS'" class="job_box">
            <div class="shadow_box">
              <div class="job_offer">
                <div class="job_info">
                  <i class="iconfont iconhb-addrss f21"></i>
                  <div class="f21 fb ml10">任务</div>
                  <div class="line2">&nbsp;</div>
                  <el-select v-model="tody" size="large" class="selsect_ets6" popper-class="select-ets" style="width: 240px"
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
                      同步任务
                    </div>
                  </div>
                  <div class="check_btn job_bg ml10" style="min-width: 100px" @click="clickBtn('moveToCargo')">
                    <div class="check">
                      <i v-show="job.moveToCargo" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      移动到货物
                    </div>
                  </div>
                </div>
              </div>

              <div class="job_table">
                <el-row>
                  <el-col :span="8">
                    <div class="title bgf8d2af" style="padding: 10px 0">
                      服务器
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
                      出发城市
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
                      出发公司
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
                      目的城市
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
                      目的公司
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
                      货物
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
                      里程
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div style="padding: 10px 0 10px 20px" class="bgf8d2af">
                      <template v-if="jobInfo && jobInfo.shortest_distance_km">
                        {{
                          jobInfo.shortest_distance_km + jobInfo.ferry_distance_km
                        }}
                        km
                        <span v-if="jobInfo.ferry_distance_km">({{ jobInfo.ferry_distance_km }} km 渡轮)</span>
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
                  修改设置
                </span>
              </div>
              <div class="setting_table">
                <div class="setting_check_box">
                  <div class="check_btn bgfab97d" @click="clickBtn('money')">
                    <div class="check">
                      <i v-show="setting.money" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      金钱
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('level')">
                    <div class="check">
                      <i v-show="setting.level" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      等级
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('skills')">
                    <div class="check">
                      <i v-show="setting.skills" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      技能
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('city')">
                    <div class="check">
                      <i v-show="setting.city" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      城市
                    </div>
                  </div>
                </div>

                <div class="setting_check_box">
                  <div class="check_btn bgfab97d" @click="clickBtn('garage')">
                    <div class="check">
                      <i v-show="setting.garage" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      车库
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('dealer')">
                    <div class="check">
                      <i v-show="setting.dealer" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      经销商
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('damage')">
                    <div class="check">
                      <i v-show="setting.damage" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      损坏
                    </div>
                  </div>

                  <div class="check_btn bgfab97d" @click="clickBtn('oil')">
                    <div class="check">
                      <i v-show="setting.oil" class="iconfont iconfuxuankuanggou check_active"></i>
                    </div>
                    <div class="ml10">
                      燃油
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="pathType === '666'" class="w">
          <aboutUs :info="readMe"></aboutUs>
        </div>
        <el-dialog title="选择路径" v-model="dialogTableVisible" :width="'80%'" :close-on-click-modal="false"
          :close-on-press-escape="false">
          <selectPath v-if="dialogTableVisible" :type="pathType" @pathSave="pathSave"></selectPath>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import moment from 'moment'
import { ElMessage, ElMessageBox } from 'element-plus'
import selectPath from '@/views/selectEuroPath/Index.vue'
import aboutUs from '@/views/about/Index.vue'
import { hex2utf8, errCatch } from '@/utils/index'
import { randomJobs, randomJobsATS } from '@/api/index'

const ipc = window.ipc

const props = defineProps<{
  savePath: string
}>()

const emit = defineEmits<{
  (e: 'pathTypeChange', type: string): void
  (e: 'pathSave', payload: { path: string, type: string }): void
}>()

const dialogTableVisible = ref(false)
const tody = ref('')
const timeOption = ref<Array<{ value: string, label: string }>>([])
const profile = ref('')
const save = ref('')
const profileOptions = ref<Array<{ value: string, label: string }>>([])
const saveOptions = ref<Array<{ value: string, label: string }>>([])
const setting = reactive({
  money: false,
  level: false,
  skills: false,
  city: false,
  garage: false,
  dealer: false,
  damage: false,
  oil: false
})
const job = reactive({
  moveToCargo: false,
  syncJob: false
})
const pathType = ref('')
const i18nCustom = ref<any>(null)
const severJobInfo = ref<any[]>([])
const jobInfo = ref<any>({})
const fullscreenLoading = ref(false)
const localLanguage = ref('en')
const readMe = ref('')

watch(() => job.syncJob, (val) => {
  if (!val) {
    job.moveToCargo = false
  }
})

onMounted(async () => {
  init()
  const res = await ipc.invoke('readReadme')
  readMe.value = res
})

const init = async () => {
  fullscreenLoading.value = true
  localLanguage.value = navigator.language
  profileOptions.value = []
  const dir = await ipc.invoke('mapDirName', { dir: props.savePath, filedirname: '/profiles' })
  try {
    if (dir !== 'invalidPath' && !errCatch(dir)) {
      dir.forEach((element: string) => {
        const obj = {
          value: element,
          label: hex2utf8(element)
        }
        profileOptions.value.push(obj)
      })
    }
  } catch (error) {
    fullscreenLoading.value = false
  }

  try {
    let res: any = null
    if (pathType.value === 'ETS2') {
      res = await randomJobs()
    } else if (pathType.value === 'ATS') {
      res = await randomJobsATS()
    }
    if (res) {
      severJobInfo.value = res
      jobInfo.value = res[0]
      tody.value = utcDiff(res[0].assembly_time)
      res.forEach((element: any) => {
        const obj = {
          value: element.assembly_time,
          label: utcDiff(element.assembly_time)
        }
        timeOption.value.push(obj)
      })
      setLanguage()
    }
    fullscreenLoading.value = false
  } catch (error) {
    fullscreenLoading.value = false
  }
}

const utcDiff = (serverTime: string) => {
  const localTime = moment
    .utc(serverTime)
    .local()
    .format('YYYY-MM-DD HH:mm')
  const d = new Date()
  let diff: string | number = -d.getTimezoneOffset() / 60
  if (diff >= 0) {
    diff = '+' + diff
  }
  return localTime + ' (UTC' + diff + ')'
}

const setLanguage = () => {
  const obj = new Map()
  jobInfo.value.i18n.map((element: any) => {
    obj.set(element.language, element)
  })
  if (obj.has(localLanguage.value)) {
    i18nCustom.value = obj.get(localLanguage.value)
  } else {
    i18nCustom.value = obj.get('Default')
  }
}

const changeTime = (val: string) => {
  severJobInfo.value.forEach((element: any) => {
    if (element.assembly_time === val) {
      jobInfo.value = element
      setLanguage()
    }
  })
}

const changeProfile = async (path: string) => {
  save.value = ''
  saveOptions.value = []
  const file = await ipc.invoke('mapDirName', { dir: props.savePath, filedirname: `/profiles/${path}/save` })
  if (file === 'invalidPath') dialogTableVisible.value = true
  if (!errCatch(file)) {
    file.forEach(async (element: string) => {
      const obj: { value: string, label: string } = {
        value: element,
        label: element
      }
      const name = await ipc.invoke('SiiDecryptInfo', `${props.savePath}/profiles/${path}/save/${element}`)
      if (!errCatch(name, 'info.sii') && name) {
        obj.label = name
      }
      saveOptions.value.push(obj)
    })
  }
  reSet()
}

const visibleProfile = (flag: boolean) => {
  if (flag && profileOptions.value.length === 0) {
    ElMessage({
      message: '暂无数据',
      type: 'warning'
    })
  }
}

const reSet = () => {
  Object.assign(setting, {
    money: false,
    level: false,
    skills: false,
    city: false,
    garage: false,
    dealer: false,
    damage: false,
    oil: false
  })
  Object.assign(job, {
    moveToCargo: false,
    syncJob: false
  })
}

const goToWeb = (url: string) => {
  ipc.send('open-url', url)
}

const clickBtn = async (val: string) => {
  if (await catchPathSaveAddress()) return
  if (profile.value && save.value) {
    switch (val) {
      case 'money':
        setting.money = !setting.money
        break
      case 'level':
        setting.level = !setting.level
        break
      case 'skills':
        setting.skills = !setting.skills
        break
      case 'city':
        setting.city = !setting.city
        break
      case 'garage':
        setting.garage = !setting.garage
        break
      case 'dealer':
        setting.dealer = !setting.dealer
        break
      case 'damage':
        setting.damage = !setting.damage
        break
      case 'oil':
        setting.oil = !setting.oil
        break
      case 'syncJob':
        job.syncJob = !job.syncJob
        break
      case 'moveToCargo':
        job.moveToCargo = !job.moveToCargo
        break
    }
  } else {
    ElMessage({
      message: '请先选择存档',
      type: 'warning',
      center: true
    })
  }
}

const catchPathSaveAddress = async () => {
  try {
    const dir = await ipc.invoke('mapDirName', { dir: props.savePath, filedirname: '/profiles' })
    errCatch(dir)
    if (dir === 'invalidPath') {
      dialogTableVisible.value = true
      return true
    } else {
      return false
    }
  } catch (error) {
    return true
  }
}

const saveSetting = async () => {
  if (await catchPathSaveAddress()) return
  const { money, level, skills, city, garage, dealer, damage, oil } = setting
  const { moveToCargo, syncJob } = job
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
    fullscreenLoading.value = true
    const info = {
      setting: { ...setting },
      jobInfo: { ...jobInfo.value },
      job: { ...job }
    }
    const gameSiiPath = `${props.savePath}/profiles/${profile.value}/save/${save.value}`
    const res = await ipc.invoke('SiiDecrypt', { dir: gameSiiPath, info: JSON.stringify(info) })
    gameSiiCatch(res)
  } else {
    ElMessage.error('未选择任何修改项')
  }
}

const errorMessages: Record<string, string> = {
  companyNotFound: '未找到公司',
  companyNotSupported: '不支持该公司',
  writeFileFailed: '写入文件失败',
  failed: '操作失败',
  decryptFailed: '解密失败'
}

const gameSiiCatch = (type: string) => {
  if (['companyNotFound', 'companyNotSupported', 'writeFileFailed', 'failed', 'decryptFailed'].indexOf(type) !== -1) {
    ElMessageBox.alert(errorMessages[type] || type, '错误', {
      confirmButtonText: '确定',
      callback: () => {
        fullscreenLoading.value = false
      }
    })
  } else {
    ElMessageBox.alert('文件保存成功', '成功', {
      confirmButtonText: '确定',
      callback: () => {
        fullscreenLoading.value = false
      }
    })
  }
}

const pathSave = ({ path, type }: { path: string, type: string }) => {
  dialogTableVisible.value = false
  emit('pathSave', { path, type })
}

const pathTypeChange = (type: string) => {
  pathType.value = type
  reSetAll()
  emit('pathTypeChange', type)
}

const reSetAll = () => {
  Object.assign(job, {
    moveToCargo: false,
    syncJob: false
  })
  Object.assign(setting, {
    money: false,
    level: false,
    skills: false,
    city: false,
    garage: false,
    dealer: false,
    damage: false,
    oil: false
  })
  tody.value = ''
  timeOption.value = []
  profile.value = ''
  save.value = ''
  profileOptions.value = []
  saveOptions.value = []
  severJobInfo.value = []
  jobInfo.value = {}
}

defineExpose({
  pathType,
  init
})
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

.bg-color {
  background-color: $dark-blue;
}

.nav {
  background-color: $dark-blue;
  box-sizing: border-box;
  display: flex;
  padding: 5px 15px 0 15px;

  .active {
    background-color: $blue;
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
    width: 48%;
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

  :deep(.el-input__wrapper) {
    background: $bg;
  }

  :deep(.el-input__inner) {
    background: $bg;
    border: none;
    height: 40px;

    &::-webkit-input-placeholder {
      color: $grey;
    }
  }

  :deep(.el-select .el-input) {
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


    :deep(.selsect_ets6) {
      .el-select__wrapper {
        background: transparent;
        box-shadow: none !important;
        border: none;
        border-bottom: 1px solid $white;
        border-radius: 0;

        &::-webkit-input-placeholder {
          color: $white;
        }
      }

      .el-select__placeholder, .el-select__caret {
        color: $white;
      }
    }

    :deep(.selsect_ets6 .el-input__wrapper) {
      background: transparent;
      box-shadow: none !important;
      border: none;
      border-bottom: 1px solid $white;
      border-radius: 0;

      &::-webkit-input-placeholder {
        color: $white;
      }
    }

    :deep(.el-select .el-input__wrapperis-focus) {
      background: transparent;
      box-shadow: none !important;
      border-bottom: 1px solid $white;
      border: none;
      border-radius: 0;

      &::-webkit-input-placeholder {
        color: $white;
      }
    }

    :deep(.el-input__inner) {
      background: transparent;
      border: none;
      color: $white;
      border-radius: 0;

      &::-webkit-input-placeholder {
        color: $white;
      }
    }

    :deep(.el-select .el-input .el-select__caret) {
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
