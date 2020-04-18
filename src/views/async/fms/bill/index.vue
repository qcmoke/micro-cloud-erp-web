<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="queryCreateTimes"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="filter-item"
      />

      <el-button class="filter-item" type="primary" plain @click="search">
        {{ $t("table.search") }}
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        {{ $t("table.reset") }}
      </el-button>
      <el-dropdown trigger="click" class="filter-item">
        <el-button>
          {{ $t("table.more") }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="add">{{
            $t("table.add")
          }}</el-dropdown-item>
          <el-dropdown-item @click.native="batchDelete">{{
            $t("table.delete")
          }}</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel">{{
            $t("table.export")
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="pageResult.rows"
      fit
      style="width: 100%;"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column prop="billId" label="账单编号" min-width="150px" />
      <el-table-column prop="typeInfo" label="账目类型" min-width="150px" />
      <el-table-column prop="totalAmount" label="合计金额" min-width="180px" />
      <el-table-column prop="dealNum" label="交易单据编号" min-width="80px" />
      <el-table-column prop="accountName" label="账户名称" min-width="150px" />
      <el-table-column prop="bankName" label="交易平台" min-width="150px" />
      <el-table-column prop="createTime" label="创建时间" min-width="150px" />
    </el-table>
    <pagination
      v-show="pageResult.total > 0"
      :total="pageResult.total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="search"
    />
  </div>
</template>

<script>
import { pageBillApi } from '@/api/fms'
import Pagination from '@/components/Pagination'

export default {
  name: 'SupplierManage',
  components: { Pagination },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 5,
        createTimeFrom: null,
        createTimeTo: null
      },
      pageResult: {
        row: [],
        total: 10
      },
      selection: [],
      loading: false,
      tableKey: 0,
      queryCreateTimes: []
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch: function() {
      this.loading = true
      if (this.queryCreateTimes.length === 2) {
        this.query.createTimeFrom = this.queryCreateTimes[0]
        this.query.createTimeTo = this.queryCreateTimes[1]
      }
      const params = this.query
      pageBillApi(params).then(r => {
        this.pageResult = r.data.data
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    search: function() {
      this.fetch()
    },
    reset: function() {
      this.queryCreateTimes = []
      this.query.createTimeFrom = null
      this.query.createTimeTo = null
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    exportExcel: function() {},
    onSelectChange: function(selection) {
      this.selection = selection
    }
  }
}
</script>
<style lang="scss" scoped></style>
