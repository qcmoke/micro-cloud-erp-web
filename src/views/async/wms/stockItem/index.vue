<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.materialName"
        placeholder="名称"
        class="filter-item search-item"
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

      <el-table-column
        prop="stockTypeInfo"
        label="出入库类型"
        min-width="150px"
      />
      <el-table-column
        prop="stockItemId"
        label="出入库编号"
        min-width="150px"
      />
      <el-table-column
        prop="itemTypeInfo"
        label="货物类型"
        min-width="150px"
      />
      <el-table-column
        prop="applyUserName"
        label="移交用户"
        min-width="150px"
      />
      <el-table-column
        prop="checkStatusInfo"
        label="审核状态"
        min-width="150px"
      />  <el-table-column
        prop="finishStatusInfo"
        label="完成状态"
        min-width="150px"
      />  <el-table-column
        prop="orderId"
        label="订单编号"
        min-width="150px"
      />
      <el-table-column
        prop="makeDate"
        label="出入库时间"
        min-width="150px"
      />
      <el-table-column prop="createTime" label="创建时间" min-width="155px" />
      <el-table-column prop="modifyTime" label="修改时间" min-width="155px" />
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        min-width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-dropdown size="small" split-button type="primary">
            审核
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :disabled="row.checkStatus === 3 || row.status != null"
                @click.native="checkPass(row)"
              >审核通过</el-dropdown-item>
              <el-dropdown-item
                :disabled="row.checkStatus === 2 || row.status != null"
                @click.native="checkFail(row)"
              >审核不通过</el-dropdown-item>
              <el-dropdown-item
                :disabled="row.checkStatus != 3"
                @click.native="addItemToStock(row)"
              >入库</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
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
import {
  pageApi,
  checkPassApi,
  checkFailApi,
  addItemToStockApi,
  batchDeleteMaterialRefundApi
} from '@/api/wms'
import Pagination from '@/components/Pagination'

export default {
  name: 'StockItemManage',
  components: { Pagination },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 5,
        materialName: null
      },
      pageResult: {
        row: [],
        total: 10
      },
      selection: [],
      loading: false,
      tableKey: 0
    }
  },
  computed: {},
  mounted() {
    this.fetch()
  },
  methods: {
    fetch: function() {
      this.loading = true
      const params = this.query
      pageApi(params)
        .then(r => {
          this.pageResult = r.data.data
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
    },
    search: function() {
      this.fetch()
    },
    reset: function() {
      this.query.materialName = null
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    singleDelete: function(row) {
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete: function() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const stockItemIds = this.selection.map(row => row.stockItemId).join()
        this.loading = true
        batchDeleteMaterialRefundApi(stockItemIds)
          .then(r => {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
            this.loading = false
            this.$refs.table.clearSelection()
            this.search()
          })
          .catch(err => {
            console.error(err)
            this.loading = false
            this.$refs.table.clearSelection()
          })
      })
    },
    exportExcel: function() {},
    onSelectChange: function(selection) {
      this.selection = selection
    },
    checkFail: function(row) {
      checkFailApi({ stockItemId: row.stockItemId }).then(r => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.search()
      })
    },
    checkPass: function(row) {
      checkPassApi({ stockItemId: row.stockItemId }).then(r => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.search()
      })
    },
    addItemToStock: function(row) {
      addItemToStockApi([row.stockItemId]).then(r => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.search()
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
