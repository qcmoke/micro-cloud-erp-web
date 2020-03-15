<template>
  <div>
    <el-input-number v-model="num1" />
    <el-input-number v-model="num2" size="medium" />
    <el-input-number v-model="num3" size="small" />
    <el-input-number v-model="num4" size="mini" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      num1: 1,
      num2: 1,
      num3: 1,
      num4: 1
    }
  }
}
</script>
