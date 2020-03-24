<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="query.materialName"
        placeholder="名称"
        class="filter-item search-item"
      />
      <el-button class="filter-item" type="primary" plain @click="search">
        {{ $t("table.search") }}
      </el-button>
      -->
      <el-button class="filter-item" type="warning" plain @click="reset">
        {{ $t("table.reset") }}
      </el-button>
      <el-dropdown trigger="click" class="filter-item">
        <el-button>
          {{ $t("table.more") }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="batchDelete">{{
            $t("table.delete")
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
        prop="purchaseOrderMasterId"
        label="订单编号"
        min-width="150px"
      />
      <el-table-column
        prop="refundChannelInfo"
        label="退款渠道"
        min-width="150px"
      />
      <el-table-column prop="totalAmount" label="退订金额" min-width="80px" />
      <el-table-column prop="reason" label="退货原因" min-width="180px" />
      <el-table-column prop="createTime" label="创建时间" min-width="150px" />
      <el-table-column prop="modifyTime" label="修改时间" min-width="80px" />
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
  pageMaterialRefundApi,
  batchDeleteMaterialRefundApi
} from '@/api/pms'
import Pagination from '@/components/Pagination'

export default {
  name: 'RefundManage',
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
      pageMaterialRefundApi(params)
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
        const refundIds = this.selection.map(row => row.refundId).join()
        this.loading = true
        batchDeleteMaterialRefundApi(refundIds)
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
    onSelectChange: function(selection) {
      this.selection = selection
    }
  }
}
</script>
<style lang="scss" scoped></style>
