<template>
    <div class="job_box markdown-body">
      <div v-html="props.info"></div>
    </div>
  </template>

<script setup lang="ts">
  import 'github-markdown-css/github-markdown-light.css'

  const props = defineProps<{
    info: string
  }>()

</script>
