<template>
  <div class="hello-world">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message?: string
}>()
</script>

<style scoped>
.hello-world {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin: 10px 0;
}

.hello-world h3 {
  margin-bottom: 10px;
  color: #409eff;
}

.hello-world p {
  color: #666;
}
</style>