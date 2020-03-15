<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.masterId"
        placeholder="订单编号"
        class="filter-item search-item"
      />
      <el-button class="filter-item" type="primary" plain @click="search">
        {{ $t("table.search") }}
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        {{ $t("table.reset") }}
      </el-button>
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="pageResult.rows"
      fit
      style="width: 100%;"
      :row-class-name="tableRowClassName"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column prop="masterId" label="订单编号" min-width="60px" />
      <el-table-column prop="supplier" label="供应商" min-width="60px">
        <template slot-scope="scope">
          <div>{{ scope.row.supplier.supplierName }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="总金额" min-width="60px" />
      <el-table-column
        prop="payType"
        label="支付类型"
        min-width="60px"
        :formatter="formatterPayType"
      />
      <el-table-column prop="purchaseDate" label="支付时间" min-width="150px" />
      <el-table-column
        prop="status"
        label="入库状态"
        min-width="100px"
        :formatter="formatterStatus"
      />
      <el-table-column prop="createTime" label="创建时间" min-width="150px" />
      <el-table-column prop="modifyTime" label="修改时间" min-width="150px" />
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        min-width="300px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-dropdown size="small" split-button type="primary">
            审核
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :disabled="row.status == 0 || row.status === 4"
                @click.native="checkPass(row.masterId)"
              >审核通过</el-dropdown-item>
              <el-dropdown-item
                :disabled="row.status == 0 || row.status === 4"
                @click.native="checkFail(row.masterId)"
              >审核不通过</el-dropdown-item>
              <el-dropdown-item
                :disabled="row.status != 3"
                @click.native="addToStock(row.masterId)"
              >入库</el-dropdown-item>
              <el-dropdown-item
                :disabled="row.status == 0"
                @click.native="toRefund(row.masterId)"
              >退订</el-dropdown-item>
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
  pagePurchaseOrderMasterForAddStockApi,
  addMaterialToStockApi,
  updatePurchaseOrderMasterApi
} from '@/api/pms'
import Pagination from '@/components/Pagination'

export default {
  name: 'PurchaseManage',
  components: { Pagination },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 5,
        masterId: null
      },
      pageResult: {
        row: [],
        total: 10
      },
      dialog: {
        isVisible: false,
        title: '',
        dto: {}
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
      pagePurchaseOrderMasterForAddStockApi(params).then(r => {
        this.pageResult = r.data.data
      })
      this.loading = false
    },
    search: function() {
      this.fetch()
    },
    reset: function() {
      this.query.masterId = null
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    onSelectChange: function(selection) {
      this.selection = selection
    },
    formatterStatus: function(row, column) {
      switch (row.status) {
        case 4:
          return '审核通过并已入库'
        case 3:
          return '审核通过但未入库'
        case 2:
          return '审核不通过'
        case 1:
          return '已提交申请但未审核'
        case 0:
          return '未提交入库申请'
        default:
          return row.status
      }
    },
    formatterPayType: function(row, column) {
      switch (row.payType) {
        case 1:
          return '支付宝'
        case 2:
          return '微信'
        case 3:
          return '银联'
        case 4:
          return '货到付款'
        default:
          break
      }
      return row.payType
    },
    tableRowClassName: function({ row, rowIndex }) {
      if (row.status === 3) {
        return 'success-row'
      } else {
        return 'warning-row'
      }
    },
    /**
     * 行功能操作
     */
    checkFail: async function(masterId) {
      this.loading = true
      await updatePurchaseOrderMasterApi({ masterId: masterId, status: 2 }).then(
        r => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      )
      this.loading = false
      this.$refs.table.clearSelection()
      this.search()
    },
    checkPass: async function(masterId) {
      this.loading = true
      await updatePurchaseOrderMasterApi({ masterId: masterId, status: 3 }).then(
        r => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      )
      this.loading = false
      this.$refs.table.clearSelection()
      this.search()
    },
    addToStock: async function(masterId) {
      this.loading = true
      await addMaterialToStockApi(masterId)
        .then(r => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      this.loading = false
      this.$refs.table.clearSelection()
      this.search()
    },
    toRefund: function(masterId) {
      console.log(masterId)
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
