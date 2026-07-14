<template>
  <div class="home">
    <el-container>
      <el-header>
        <h1>{{ $t('home.title') }}</h1>
      </el-header>
      
      <el-main>
        <el-card>
          <p>{{ $t('home.description') }}</p>
          <el-divider />
          <p>{{ $t('home.count') }}: {{ store.count }}</p>
          <el-space>
            <el-button type="primary" @click="store.increment">
              {{ $t('home.increment') }}
            </el-button>
            <el-button type="danger" @click="store.decrement">
              {{ $t('home.decrement') }}
            </el-button>
          </el-space>
        </el-card>
        
        <el-divider />
        
        <el-space>
          <el-button type="primary" @click="changeLanguage('zh-CN')">
            中文
          </el-button>
          <el-button @click="changeLanguage('en-US')">
            English
          </el-button>
        </el-space>
      </el-main>
      
      <el-footer>
        <router-link to="/about">
          <el-button type="text">
            <el-icon><InfoFilled /></el-icon>
            {{ $t('common.about') }}
          </el-button>
        </router-link>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores'
import { InfoFilled } from '@element-plus/icons-vue'

const { locale } = useI18n()
const store = useAppStore()

const changeLanguage = (lang: string) => {
  locale.value = lang
}
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-footer {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>