<template>
  <div class="box">
    <div class="content">
      请选择存档所在目录
    </div>
    <div>
      <el-input style="width: 80%;" v-model="input" placeholder="请选择文件路径"></el-input>
      <el-button @click="openFileHandler">选择</el-button>
      <input ref="input_file" type="file" readonly webkitdirectory directory style="filter:alpha(opacity=0);opacity:0;width: 0;height: 0;" @change="fileChange">
    </div>
  </div>
</template>

<script>
export default {
  name: 'find-file',
  data () {
    return {
      input: ''
    }
  },
  methods: {
    openFileHandler () {
      this.$refs.input_file.click()
    },
    fileChange () {
      console.log(this.$refs.input_file.files)
      const file = this.$refs.input_file.files[0]
      this.input = file.path
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

