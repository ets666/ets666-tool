<template>
  <div class="w h">
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
        <el-select v-model="value" size="mini" placeholder="请选择档案" class="mb10">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="value" size="mini" placeholder="请选择存档" class="mb10">
          <el-option
            v-for="item in options"
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
        <el-checkbox v-model="checked" class="mb10">
          同步今日联运任务
        </el-checkbox>
        <el-checkbox v-model="checked">
          移动车辆至起点货场
        </el-checkbox>
      </div>
    </div>

    <div class="menu_box">
      <div class="box">
        <div class="mb10">
          存档修改:
        </div>
        <el-checkbox v-model="checked" class="mb10">
          修改金钱为1亿
        </el-checkbox>
        <el-checkbox v-model="checked" class="mb10">
          修改玩家级别为100级
        </el-checkbox>
        <el-checkbox v-model="checked" class="mb10">
          解锁全部技能
        </el-checkbox>
        <el-checkbox v-model="checked" class="mb10">
          解锁全部城市
        </el-checkbox>
        <el-checkbox v-model="checked" class="mb10">
          解锁全部车库
        </el-checkbox>
        <el-checkbox v-model="checked" class="mb10">
          修复全部车损
        </el-checkbox>
        <el-checkbox v-model="checked" class="mb10">
          全部车辆满油
        </el-checkbox>
      </div>

      <div class="box">
        <div class="mb10">
          {{ tody }}联运信息:
        </div>
        <div class="text_box mb10">
          <span class="text">服务器:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="input1" />
        </div>
        <div class="text_box mb10">
          <span class="text">起点城市:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="input1" />
        </div>
        <div class="text_box mb10">
          <span class="text">起点货场:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="input1" />
        </div>
        <div class="text_box mb10">
          <span class="text">终点城市:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="input1" />
        </div>
        <div class="text_box mb10">
          <span class="text">终点货场:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="input1" />
        </div>
        <div class="text_box mb10">
          <span class="text">货物:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="input1" />
        </div>
        <div class="text_box mb10">
          <span class="text">预估里程:</span>
          <el-input placeholder="服务器" size="mini" disabled v-model="input1" />
        </div>


      </div>
    </div>

    <div class="menu_box">
      <div class="box" style="margin-right: 10px;">
        <el-button type="primary" class="btn">一键修改存档</el-button>
      </div>

      <div class="box">
        <el-button type="primary" class="btn">保存联运任务</el-button>
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
const fs = require('fs')
const path = require('path')

export default {
  data () {
    return {
      savePath: '',
      checked: true,
      value: '',
      input1: 'S1',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      tody: moment().format('yyyy年MM月DD日')
    }
  },
  created () {
    try {
      let data = fs.readFileSync(path.join(process.cwd(), '/resources/db.json'))
      this.savePath = JSON.parse(data.toString()).path
    } catch (error) {
      this.savePath = ''
    }
  },
  methods: {
    changePath () {
      this.$emit('changePath')
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

