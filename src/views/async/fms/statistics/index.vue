<template>
  <div>
    <el-select
      v-model="value"
      class="select"
      placeholder="请选择年份"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="chart-container">
      <finance-chart :chart-data="chartData" />
    </div>
    <div class="chart-container">
      <order-chart :chart-data="chartData" />
    </div>
  </div>
</template>

<script>
import FinanceChart from './charts/financeCharts'
import OrderChart from './charts/orderQuantity'

import { statisticsApi } from '@/api/fms'

export default {
  name: 'DashboardAdmin',
  components: {
    FinanceChart,
    OrderChart
  },
  data() {
    const now = new Date()
    const year = now.getFullYear()
    return {
      options: [
        {
          value: year,
          label: year
        },
        {
          value: year - 1,
          label: year - 1
        },
        {
          value: year - 2,
          label: year - 2
        }
      ],
      value: year,
      chartData: {}
    }
  },
  created() {
    this.handleChange(this.value)
  },
  methods: {
    handleChange(v) {
      // this.chartData = {
      //   // 每月订单数
      //   orderQuantity: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2],
      //   // 纯利润
      //   profit: [0, 0, 1050, 1000, 0, 0, 325, 695, 740, 990, -694.9, -14764],
      //   // 营业额
      //   turnover: [0, 0, 5000, 2300, 0, 0, 432, 777, 1111, 1000, 111, 323]
      // }
      statisticsApi(this.value).then(r => {
        this.chartData = r.data.data
      }).catch(_ => {
        console.log('获取失败')
      })
    }

  }
}
</script>

<style scoped>
.select {
  margin-top: 10px;
  margin-left: 30px;
  margin-bottom: 10px;
}
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 65px);
}
</style>
