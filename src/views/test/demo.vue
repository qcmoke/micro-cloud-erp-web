<template>
  <div class="app-container">
    <el-table :data="tableData" border>
      <el-table-column
        fixed
        prop="date"
        label="日期"
        width="150"
        align="center"
      />
      <el-table-column prop="name" label="姓名" width="120" align="center" />
      <el-table-column
        prop="province"
        label="省份"
        width="120"
        align="center"
      />
      <el-table-column prop="city" label="市区" width="120" align="center" />
      <el-table-column prop="address" label="地址" width="300" align="center" />
      <el-table-column prop="zip" label="邮编" width="120" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
        }
      ]
    }
  },
  methods: {
    handleClick(row) {
      console.log(row)
    }
  }
}
</script>
<style lang="scss" scoped></style>
