<template>
  <div class="app-container">
    <div id="message">{{ hello }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hello: 'hello world'

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
