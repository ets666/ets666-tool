<template>
  <div class="w h">
    <setting ref="settingRef" :savePath="savePath" @pathTypeChange="pathTypeChange" @pathSave="pathSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import Setting from '@/views/setting/Index.vue'

const ipc = window.ipc

const settingRef = ref<any>(null)
const savePath = ref('')
const type = ref('ETS2')
const paths = reactive({
  path: null as string | null,
  aPath: null as string | null
})

const pathSave = ({ path, type: t }: { path: string, type: string }) => {
  savePath.value = path
  if (type.value === 'ETS2') {
    paths.path = path
  } else {
    paths.aPath = path
  }
  nextTick(() => {
    if (settingRef.value) {
      settingRef.value.pathType = t
      settingRef.value.init()
    }
  })
}

const pathTypeChange = (t: string) => {
  type.value = t
  if (t === 'ETS2') {
    savePath.value = paths.path || ''
    if (savePath.value) {
      nextTick(() => {
        if (settingRef.value) {
          settingRef.value.init()
        }
      })
    }
  } else if (t === 'ATS') {
    savePath.value = paths.aPath || ''
    if (savePath.value) {
      nextTick(() => {
        if (settingRef.value) {
          settingRef.value.init()
        }
      })
    }
  }
}

onMounted(async () => {
  try {
    savePath.value = ''
    const path = await ipc.invoke('getStore', 'path')
    const aPath = await ipc.invoke('getStore', 'aPath')
    paths.path = path
    paths.aPath = aPath
    // Default path setting
    if (path) {
      savePath.value = path
      type.value = 'ETS2'
      nextTick(() => {
        if (settingRef.value) {
          settingRef.value.pathType = 'ETS2'
        }
      })
    } else if (aPath) {
      savePath.value = aPath
      type.value = 'ATS'
      nextTick(() => {
        if (settingRef.value) {
          settingRef.value.pathType = 'ATS'
        }
      })
    } else {
      savePath.value = ''
      type.value = 'ETS2'
      nextTick(() => {
        if (settingRef.value) {
          settingRef.value.pathType = 'ETS2'
        }
      })
    }
    nextTick(() => {
      if (settingRef.value) {
        settingRef.value.init()
      }
    })
  } catch (error) {
    savePath.value = ''
  }
})
</script>

<style scoped lang="scss">
.w {
  width: 100%;
}
.h {
  height: 100%;
}
</style>
