<template>
  <div class="box">
    <div class="content">
      请选择游戏路径
    </div>
    <div class="input-box w">
      <el-input class="mr10 w60" v-model="gamePath" disabled placeholder="选择路径"></el-input>
      <el-button class="mr10" @click="openFileHandler">选择</el-button>
      <el-button style="margin-left: 0;" :disabled="disableSure" type="primary" @click="saveToLocal">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { errCatch } from '@/utils/index'

const ipc = window.ipc

const props = defineProps<{
  type: string
}>()

const emit = defineEmits<{
  (e: 'pathSave', payload: { path: string, type: string }): void
}>()

const gamePath = ref('')
const disableSure = ref(true)

onMounted(async () => {
  try {
    let path = ''
    if (props.type === 'ETS2') {
      path = await ipc.invoke('getStore', 'path')
    } else {
      path = await ipc.invoke('getStore', 'aPath')
    }
    gamePath.value = path || ''
  } catch (error) {
    gamePath.value = ''
  }
})

const openFileHandler = async () => {
  try {
    const files = await ipc.invoke('openDir')
    gamePath.value = files
    const dir = await ipc.invoke('mapDirName', { dir: files, filedirname: '/profiles' })
    if (!errCatch(dir)) {
      disableSure.value = false
    } else {
      disableSure.value = true
    }
  } catch (error) {
    console.log(error)
  }
}

const saveToLocal = () => {
  if (props.type === 'ETS2') {
    ipc.send('saveStore', { storeName: 'path', val: gamePath.value })
    ipc.send('saveStore', { storeName: 'pathType', val: 'custom' })
  } else {
    ipc.send('saveStore', { storeName: 'aPath', val: gamePath.value })
    ipc.send('saveStore', { storeName: 'aPathType', val: 'custom' })
  }
  emit('pathSave', { path: gamePath.value, type: props.type })
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
