<template>
  <div class="app-container">
    <div id="message">{{ msg }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: '供应商管理'
    }
  }
}
</script>
<style scoped>
#message {
  font-size: 1rem;
  font-weight: 600;
  color: #42b983;
}
</style>
