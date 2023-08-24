<template>
  <div class="job_box markdown-body">
    <div v-html="info"></div>
  </div>
</template>

<script>
import 'github-markdown-css/github-markdown-light.css'
export default {
  props: {
    info: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
</style>
