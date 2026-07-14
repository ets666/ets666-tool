<template>
  <div class="about">
    <el-card>
      <template #header>
        <h2>{{ $t('about.title') }}</h2>
      </template>
      
      <p>{{ $t('about.description') }}</p>
      <el-divider />
      <p>Version: 1.0.0</p>
      <p>Built with Vue 3 + Vite + Electron + TypeScript</p>
      
      <template #footer>
        <router-link to="/">
          <el-button type="primary">
            <el-icon><HomeFilled /></el-icon>
            {{ $t('common.home') }}
          </el-button>
        </router-link>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { HomeFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.about {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>